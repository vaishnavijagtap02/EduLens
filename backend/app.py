import os
from flask import Flask, request, jsonify
from flask_cors import CORS

from ml.dataset_loader import (
    load_dataset, 
    get_dataset_metadata, 
    preprocess_features, 
    DEFAULT_BEHAVIORAL_FEATURES,
    KUL_DEFAULT_BEHAVIORAL,
    UCI_DEFAULT_BEHAVIORAL,
    is_kuleuven
)
from ml.kmeans import run_kmeans_analysis, compute_elbow_curve
from ml.gmm_em import run_gmm_analysis
from ml.evaluation import evaluate_models, compute_bic_aic_curve
from ml.insights import generate_cohort_insights

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

def build_student_plot_point(i, df, prep_coords, cluster_label, extra=None):
    row = df.iloc[i]
    is_kul = 'total_clicks' in df.columns
    point = {
        'id': i + 1,
        'x': round(float(prep_coords[i, 0]), 3),
        'y': round(float(prep_coords[i, 1]), 3),
        'cluster': cluster_label,
        'is_kul': is_kul,
    }
    if is_kul:
        point.update({
            'grade': int(row['grade_equivalent']) if 'grade_equivalent' in df.columns else 10,
            'sessions': int(row['total_sessions']) if 'total_sessions' in df.columns else 0,
            'clicks': int(row['total_clicks']) if 'total_clicks' in df.columns else 0,
            'cramming': float(row['cramming_ratio']) if 'cramming_ratio' in df.columns else 0.0,
            'active_days': int(row['active_days']) if 'active_days' in df.columns else 0,
            'score_category': str(row['score_category']) if 'score_category' in df.columns else 'Pass',
            'passed': int(row['passed']) if 'passed' in df.columns else 1,
            # Common display aliases
            'G3': int(row['grade_equivalent']) if 'grade_equivalent' in df.columns else 10,
            'studytime': int(row['total_sessions']) if 'total_sessions' in df.columns else 0,
            'failures': 1 if row.get('passed', 1) == 0 else 0,
            'absences': int(row['procrastination_latency']) if 'procrastination_latency' in df.columns else 0
        })
    else:
        point.update({
            'G3': int(row['G3']) if 'G3' in df.columns else None,
            'studytime': int(row['studytime']) if 'studytime' in df.columns else None,
            'failures': int(row['failures']) if 'failures' in df.columns else None,
            'absences': int(row['absences']) if 'absences' in df.columns else None,
            'grade': int(row['G3']) if 'G3' in df.columns else None,
            'sessions': int(row['studytime']) if 'studytime' in df.columns else None,
            'clicks': None,
            'cramming': None,
            'active_days': None,
            'score_category': 'Pass' if int(row.get('G3', 10)) >= 10 else 'Fail',
            'passed': 1 if int(row.get('G3', 10)) >= 10 else 0
        })
    if extra:
        point.update(extra)
    return point

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'application': 'EduLens Backend',
        'version': '2.0.0',
        'supported_datasets': ['kul-acc', 'kul-eco', 'mat', 'por']
    })

@app.route('/api/dataset/metadata', methods=['GET'])
def dataset_metadata():
    dataset_type = request.args.get('dataset', 'kul-acc')
    try:
        metadata = get_dataset_metadata(dataset_type)
        return jsonify({'success': True, 'data': metadata})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 400

@app.route('/api/kmeans/run', methods=['POST'])
def kmeans_run():
    try:
        body = request.get_json() or {}
        dataset_type = body.get('dataset', 'kul-acc')
        default_feats = KUL_DEFAULT_BEHAVIORAL if is_kuleuven(dataset_type) else UCI_DEFAULT_BEHAVIORAL
        selected_features = body.get('features', default_feats)
        scaling = body.get('scaling', 'standard')
        k = int(body.get('k', 3))
        init_method = body.get('init', 'k-means++')
        max_iter = int(body.get('max_iter', 100))
        
        df = load_dataset(dataset_type)
        prep = preprocess_features(df, selected_features=selected_features, scaling=scaling, dataset_type=dataset_type)
        
        result = run_kmeans_analysis(
            X_scaled=prep['X_scaled'],
            pca_coords=prep['pca_coords'],
            n_clusters=k,
            max_iter=max_iter,
            init=init_method
        )
        
        plot_points = [
            build_student_plot_point(i, df, prep['pca_coords'], result['labels'][i])
            for i in range(len(df))
        ]
            
        result['points'] = plot_points
        result['pca_variance'] = prep['pca_variance']
        result['features_used'] = prep['features']
        
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/kmeans/elbow', methods=['POST'])
def kmeans_elbow():
    try:
        body = request.get_json() or {}
        dataset_type = body.get('dataset', 'kul-acc')
        default_feats = KUL_DEFAULT_BEHAVIORAL if is_kuleuven(dataset_type) else UCI_DEFAULT_BEHAVIORAL
        selected_features = body.get('features', default_feats)
        scaling = body.get('scaling', 'standard')
        
        df = load_dataset(dataset_type)
        prep = preprocess_features(df, selected_features=selected_features, scaling=scaling, dataset_type=dataset_type)
        elbow_data = compute_elbow_curve(prep['X_scaled'], k_min=2, k_max=8)
        
        return jsonify({'success': True, 'data': elbow_data})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/gmm/run', methods=['POST'])
def gmm_run():
    try:
        body = request.get_json() or {}
        dataset_type = body.get('dataset', 'kul-acc')
        default_feats = KUL_DEFAULT_BEHAVIORAL if is_kuleuven(dataset_type) else UCI_DEFAULT_BEHAVIORAL
        selected_features = body.get('features', default_feats)
        scaling = body.get('scaling', 'standard')
        k = int(body.get('k', 3))
        cov_type = body.get('covariance_type', 'full')
        max_iter = int(body.get('max_iter', 100))
        
        df = load_dataset(dataset_type)
        prep = preprocess_features(df, selected_features=selected_features, scaling=scaling, dataset_type=dataset_type)
        
        result = run_gmm_analysis(
            X_scaled=prep['X_scaled'],
            pca_coords=prep['pca_coords'],
            n_components=k,
            covariance_type=cov_type,
            max_iter=max_iter
        )
        
        plot_points = []
        for i in range(len(df)):
            mem = result['student_memberships'][i]
            extra = {
                'confidence': mem['max_confidence'],
                'uncertainty': mem['uncertainty'],
                'soft_probs': mem['soft_probs']
            }
            pt = build_student_plot_point(i, df, prep['pca_coords'], mem['hard_label'], extra=extra)
            plot_points.append(pt)
            
        result['points'] = plot_points
        result['pca_variance'] = prep['pca_variance']
        result['features_used'] = prep['features']
        
        return jsonify({'success': True, 'data': result})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/gmm/bic-aic', methods=['POST'])
def gmm_bic_aic():
    try:
        body = request.get_json() or {}
        dataset_type = body.get('dataset', 'kul-acc')
        default_feats = KUL_DEFAULT_BEHAVIORAL if is_kuleuven(dataset_type) else UCI_DEFAULT_BEHAVIORAL
        selected_features = body.get('features', default_feats)
        scaling = body.get('scaling', 'standard')
        cov_type = body.get('covariance_type', 'full')
        
        df = load_dataset(dataset_type)
        prep = preprocess_features(df, selected_features=selected_features, scaling=scaling, dataset_type=dataset_type)
        curve = compute_bic_aic_curve(prep['X_scaled'], k_min=2, k_max=8, covariance_type=cov_type)
        
        return jsonify({'success': True, 'data': curve})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/compare', methods=['POST'])
def compare_models():
    try:
        body = request.get_json() or {}
        dataset_type = body.get('dataset', 'kul-acc')
        default_feats = KUL_DEFAULT_BEHAVIORAL if is_kuleuven(dataset_type) else UCI_DEFAULT_BEHAVIORAL
        selected_features = body.get('features', default_feats)
        scaling = body.get('scaling', 'standard')
        k = int(body.get('k', 3))
        cov_type = body.get('covariance_type', 'full')
        
        df = load_dataset(dataset_type)
        prep = preprocess_features(df, selected_features=selected_features, scaling=scaling, dataset_type=dataset_type)
        
        km_res = run_kmeans_analysis(prep['X_scaled'], prep['pca_coords'], n_clusters=k)
        gmm_res = run_gmm_analysis(prep['X_scaled'], prep['pca_coords'], n_components=k, covariance_type=cov_type)
        
        soft_probs = [m['soft_probs'] for m in gmm_res['student_memberships']]
        import numpy as np
        soft_probs_arr = np.array(soft_probs)
        
        eval_metrics = evaluate_models(
            X_scaled=prep['X_scaled'],
            kmeans_labels=km_res['labels'],
            gmm_labels=gmm_res['hard_labels'],
            gmm_soft_probs=soft_probs_arr
        )
        
        return jsonify({
            'success': True,
            'data': {
                'metrics': eval_metrics,
                'kmeans_summary': {
                    'inertia': km_res['inertia'],
                    'silhouette': km_res['silhouette'],
                    'iterations': km_res['iterations']
                },
                'gmm_summary': {
                    'bic': gmm_res['bic'],
                    'aic': gmm_res['aic'],
                    'silhouette': gmm_res['silhouette'],
                    'log_likelihood': gmm_res['log_likelihood'],
                    'weights': gmm_res['weights']
                },
                'pca_variance': prep['pca_variance']
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/insights', methods=['POST'])
def insights():
    try:
        body = request.get_json() or {}
        dataset_type = body.get('dataset', 'kul-acc')
        default_feats = KUL_DEFAULT_BEHAVIORAL if is_kuleuven(dataset_type) else UCI_DEFAULT_BEHAVIORAL
        selected_features = body.get('features', default_feats)
        scaling = body.get('scaling', 'standard')
        k = int(body.get('k', 3))
        algorithm = body.get('algorithm', 'kmeans')
        
        df = load_dataset(dataset_type)
        prep = preprocess_features(df, selected_features=selected_features, scaling=scaling, dataset_type=dataset_type)
        
        if algorithm == 'gmm':
            res = run_gmm_analysis(prep['X_scaled'], prep['pca_coords'], n_components=k)
            labels = res['hard_labels']
            algo_name = f"Gaussian Mixture Model (K={k})"
        else:
            res = run_kmeans_analysis(prep['X_scaled'], prep['pca_coords'], n_clusters=k)
            labels = res['labels']
            algo_name = f"K-Means Clustering (K={k})"
            
        cohort_analysis = generate_cohort_insights(df, labels, algorithm_name=algo_name)
        
        return jsonify({'success': True, 'data': cohort_analysis})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting EduLens Backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
