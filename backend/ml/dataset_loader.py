import os
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

# UCI Feature Definitions
UCI_NUMERIC_FEATURES = [
    'age', 'Medu', 'Fedu', 'traveltime', 'studytime', 
    'failures', 'famrel', 'freetime', 'goout', 
    'Dalc', 'Walc', 'health', 'absences', 'G1', 'G2', 'G3'
]

UCI_BINARY_FEATURES = [
    'schoolsup', 'famsup', 'paid', 'activities', 
    'nursery', 'higher', 'internet', 'romantic'
]

UCI_CATEGORICAL_FEATURES = [
    'school', 'sex', 'address', 'famsize', 'Pstatus', 
    'Mjob', 'Fjob', 'reason', 'guardian'
]

UCI_DEFAULT_BEHAVIORAL = [
    'studytime', 'failures', 'absences', 'freetime', 'goout', 
    'Dalc', 'Walc', 'health', 'G1', 'G2', 'G3'
]

# KU Leuven Feature Definitions (Learning Platform Telemetry)
KUL_NUMERIC_FEATURES = [
    'total_clicks', 'total_sessions', 'active_days', 'active_weeks', 
    'materials_viewed', 'actions_per_session', 'cramming_ratio', 
    'procrastination_latency', 'study_regularity', 'total_posts_read', 
    'threads_read_count', 'forum_posts_written', 'avg_post_length', 
    'grade_equivalent'
]

KUL_BINARY_FEATURES = [
    'passed', 'passed_first_attempt'
]

KUL_CATEGORICAL_FEATURES = [
    'course', 'score_category'
]

KUL_DEFAULT_BEHAVIORAL = [
    'total_clicks', 'total_sessions', 'active_days', 'active_weeks', 
    'materials_viewed', 'actions_per_session', 'study_regularity', 
    'cramming_ratio', 'procrastination_latency', 'total_posts_read', 
    'grade_equivalent'
]

# Alias for backwards compatibility
DEFAULT_BEHAVIORAL_FEATURES = KUL_DEFAULT_BEHAVIORAL

def is_kuleuven(dataset_type):
    return dataset_type in ['kul-acc', 'kul-eco']

def load_dataset(dataset_type='kul-acc'):
    """
    Load dataset:
    - 'kul-acc': KU Leuven Accountancy (756 students, VLE telemetry)
    - 'kul-eco': KU Leuven Global Economics (743 students, VLE telemetry)
    - 'mat': UCI Mathematics (395 students)
    - 'por': UCI Portuguese (649 students)
    """
    filename = f"student-{dataset_type}.csv"
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset file not found at: {path}")
    
    df = pd.read_csv(path, sep=';')
    return df

def get_dataset_metadata(dataset_type='kul-acc'):
    """
    Returns summary statistics, column types, and sample data.
    """
    df = load_dataset(dataset_type)
    is_kul = is_kuleuven(dataset_type)
    
    numeric_cols = KUL_NUMERIC_FEATURES if is_kul else UCI_NUMERIC_FEATURES
    binary_cols = KUL_BINARY_FEATURES if is_kul else UCI_BINARY_FEATURES
    cat_cols = KUL_CATEGORICAL_FEATURES if is_kul else UCI_CATEGORICAL_FEATURES
    default_cols = KUL_DEFAULT_BEHAVIORAL if is_kul else UCI_DEFAULT_BEHAVIORAL
    
    # Feature summaries
    numeric_summary = {}
    for col in numeric_cols:
        if col in df.columns:
            s = df[col]
            numeric_summary[col] = {
                'min': float(s.min()),
                'max': float(s.max()),
                'mean': round(float(s.mean()), 2),
                'std': round(float(s.std()), 2),
                'median': float(s.median())
            }
            
    categorical_summary = {}
    key_cats = ['score_category', 'passed', 'passed_first_attempt'] if is_kul else ['school', 'sex', 'higher', 'studytime', 'failures']
    for col in key_cats:
        if col in df.columns:
            counts = df[col].value_counts().to_dict()
            categorical_summary[col] = {str(k): int(v) for k, v in counts.items()}

    preview = df.head(10).to_dict(orient='records')
    
    if dataset_type == 'kul-acc':
        name = "KU Leuven (Accountancy LMS Activity)"
        source = "KU Leuven & Nature Scientific Data (Tiukhova et al., 2023, Zenodo DOI: 10.5281/zenodo.17087849)"
    elif dataset_type == 'kul-eco':
        name = "KU Leuven (Economics LMS Activity)"
        source = "KU Leuven & Nature Scientific Data (Tiukhova et al., 2023, Zenodo DOI: 10.5281/zenodo.17087849)"
    elif dataset_type == 'mat':
        name = "UCI Student Performance (Mathematics)"
        source = "UCI Machine Learning Repository (P. Cortez and A. Silva, 2008)"
    else:
        name = "UCI Student Performance (Portuguese)"
        source = "UCI Machine Learning Repository (P. Cortez and A. Silva, 2008)"
        
    return {
        'dataset_type': dataset_type,
        'name': name,
        'source': source,
        'is_learning_platform': is_kul,
        'total_records': len(df),
        'total_features': len(df.columns),
        'numeric_features': [c for c in numeric_cols if c in df.columns],
        'binary_features': [c for c in binary_cols if c in df.columns],
        'categorical_features': [c for c in cat_cols if c in df.columns],
        'default_features': default_cols,
        'numeric_summary': numeric_summary,
        'categorical_summary': categorical_summary,
        'preview': preview
    }

def preprocess_features(df, selected_features=None, scaling='standard', dataset_type='kul-acc'):
    """
    Prepares numerical matrix X and metadata for clustering.
    - Encodes binary columns
    - Scales features (StandardScaler or MinMaxScaler)
    - Performs PCA (2D) for universal coordinate visualization
    """
    is_kul = is_kuleuven(dataset_type)
    binary_cols = KUL_BINARY_FEATURES if is_kul else UCI_BINARY_FEATURES
    default_cols = KUL_DEFAULT_BEHAVIORAL if is_kul else UCI_DEFAULT_BEHAVIORAL
    
    if selected_features is None or len(selected_features) == 0:
        selected_features = default_cols
        
    df_copy = df.copy()
    
    # Encode binary columns if selected
    for col in binary_cols:
        if col in df_copy.columns:
            if df_copy[col].dtype == object:
                df_copy[col] = (df_copy[col].astype(str).str.lower().isin(['yes', '1', 'true'])).astype(int)
            else:
                df_copy[col] = df_copy[col].astype(float)
            
    # Filter features that exist in df
    valid_features = [f for f in selected_features if f in df_copy.columns]
    if not valid_features:
        valid_features = [f for f in default_cols if f in df_copy.columns]
        
    X_raw = df_copy[valid_features].values.astype(float)
    
    if scaling == 'minmax':
        scaler = MinMaxScaler()
    else:
        scaler = StandardScaler()
        
    X_scaled = scaler.fit_transform(X_raw)
    
    # 2D PCA for visual projection
    pca = PCA(n_components=2, random_state=42)
    pca_coords = pca.fit_transform(X_scaled)
    explained_variance = [round(float(v), 4) for v in pca.explained_variance_ratio_]
    
    return {
        'X_raw': X_raw,
        'X_scaled': X_scaled,
        'pca_coords': pca_coords,
        'pca_variance': explained_variance,
        'features': valid_features,
        'scaler_mean': [round(float(m), 4) for m in (scaler.mean_ if scaling == 'standard' else scaler.data_min_)],
        'scaler_scale': [round(float(s), 4) for s in (scaler.scale_ if scaling == 'standard' else scaler.data_range_)],
        'raw_df': df_copy
    }
