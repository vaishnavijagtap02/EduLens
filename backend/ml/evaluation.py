import numpy as np
from sklearn.metrics import silhouette_score, davies_bouldin_score, adjusted_rand_score, normalized_mutual_info_score
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture

def evaluate_models(X_scaled, kmeans_labels, gmm_labels, gmm_soft_probs, gmm_obj=None):
    """
    Computes rigorous evaluation metrics comparing K-Means and GMM:
    - Silhouette Score (higher is better, range [-1, 1])
    - Davies-Bouldin Index (lower is better, >= 0)
    - Contingency / Agreement Matrix
    - Adjusted Rand Index (ARI) and Normalized Mutual Information (NMI)
    - Borderline / Uncertain students analysis
    """
    # 1. Silhouette Scores
    try:
        km_sil = float(silhouette_score(X_scaled, kmeans_labels))
    except Exception:
        km_sil = 0.0
        
    try:
        gmm_sil = float(silhouette_score(X_scaled, gmm_labels))
    except Exception:
        gmm_sil = 0.0
        
    # 2. Davies-Bouldin Indexes
    try:
        km_db = float(davies_bouldin_score(X_scaled, kmeans_labels))
    except Exception:
        km_db = 0.0
        
    try:
        gmm_db = float(davies_bouldin_score(X_scaled, gmm_labels))
    except Exception:
        gmm_db = 0.0
        
    # 3. Cluster Alignment / Agreement
    ari = float(adjusted_rand_score(kmeans_labels, gmm_labels))
    nmi = float(normalized_mutual_info_score(kmeans_labels, gmm_labels))
    
    # Contingency Table (K-Means clusters vs GMM clusters)
    km_k = len(np.unique(kmeans_labels))
    gmm_k = len(np.unique(gmm_labels))
    
    contingency_matrix = np.zeros((km_k, gmm_k), dtype=int)
    for km_l, gm_l in zip(kmeans_labels, gmm_labels):
        if 0 <= km_l < km_k and 0 <= gm_l < gmm_k:
            contingency_matrix[km_l, gm_l] += 1
            
    contingency_list = []
    for i in range(km_k):
        for j in range(gmm_k):
            contingency_list.append({
                'kmeans_cluster': f"K-Means C{i+1}",
                'gmm_cluster': f"GMM C{j+1}",
                'count': int(contingency_matrix[i, j])
            })
            
    # 4. Soft Clustering Uncertainty Analysis
    # Borderline students: Max posterior probability < 0.6
    max_probs = np.max(gmm_soft_probs, axis=1)
    borderline_mask = max_probs < 0.65
    borderline_count = int(np.sum(borderline_mask))
    borderline_pct = round((borderline_count / len(X_scaled)) * 100, 2)
    
    return {
        'silhouette': {
            'kmeans': round(km_sil, 4),
            'gmm': round(gmm_sil, 4),
            'winner': 'K-Means' if km_sil >= gmm_sil else 'GMM'
        },
        'davies_bouldin': {
            'kmeans': round(km_db, 4),
            'gmm': round(gmm_db, 4),
            'winner': 'K-Means' if km_db <= gmm_db else 'GMM'  # Lower is better
        },
        'agreement': {
            'adjusted_rand_index': round(ari, 4),
            'normalized_mutual_info': round(nmi, 4)
        },
        'contingency_matrix': contingency_list,
        'contingency_raw': contingency_matrix.tolist(),
        'borderline_analysis': {
            'total_students': len(X_scaled),
            'borderline_students_count': borderline_count,
            'borderline_percentage': borderline_pct,
            'avg_confidence': round(float(np.mean(max_probs)), 4)
        }
    }


def compute_bic_aic_curve(X_scaled, k_min=2, k_max=8, covariance_type='full', random_state=42):
    """
    Computes BIC and AIC for model order selection in GMM across components K.
    Lower BIC/AIC indicates better balance of goodness-of-fit and model complexity.
    """
    curve = []
    for k in range(k_min, k_max + 1):
        gmm = GaussianMixture(
            n_components=k, 
            covariance_type=covariance_type, 
            random_state=random_state,
            n_init=2
        )
        gmm.fit(X_scaled)
        curve.append({
            'k': k,
            'bic': round(float(gmm.bic(X_scaled)), 2),
            'aic': round(float(gmm.aic(X_scaled)), 2),
            'log_likelihood': round(float(gmm.score(X_scaled) * X_scaled.shape[0]), 2)
        })
    return curve

