import os
import pandas as pd
import numpy as np

RAW_DIR = 'backend/data/kuleuven_raw/dataset'
OUT_DIR = 'backend/data'

print("Starting KU Leuven feature aggregation pipeline...")

# Load participation
p_df = pd.read_excel(os.path.join(RAW_DIR, '1819_course_participation.xlsx'))
cons_df = pd.read_excel(os.path.join(RAW_DIR, '1819_df_consumption.xlsx'))
contrib_df = pd.read_excel(os.path.join(RAW_DIR, '1819_df_contribution.xlsx'))

# Load log activity in chunks
print("Loading and filtering 1819_log_activity.csv...")
chunks = []
for chunk in pd.read_csv(os.path.join(RAW_DIR, '1819_log_activity.csv'), chunksize=200000):
    chunks.append(chunk[['COURSE_ID', 'USER_ID', 'CONTENT_ID', 'SESSION_ID', 'TIMESTAMP']])
log_df = pd.concat(chunks, ignore_index=True)
log_df['TIMESTAMP'] = pd.to_datetime(log_df['TIMESTAMP'])
log_df['DATE'] = log_df['TIMESTAMP'].dt.date
log_df['WEEK'] = log_df['TIMESTAMP'].dt.isocalendar().week

for course_name, filename in [('Accountancy', 'student-kul-acc.csv'), ('Global economics', 'student-kul-eco.csv')]:
    print(f"\nProcessing {course_name}...")
    
    # Filter course participation
    cp = p_df[p_df['COURSE_ID'] == course_name].copy()
    user_ids = set(cp['USER_ID'])
    print(f"Total students in {course_name}: {len(cp)}")
    
    # Filter logs
    clog = log_df[log_df['COURSE_ID'] == course_name].copy()
    course_start = clog['DATE'].min()
    course_end = clog['DATE'].max()
    course_duration_days = max(1, (course_end - course_start).days)
    
    # Compute exam/cramming weeks (last 3 weeks of course activity)
    max_week = clog['WEEK'].max()
    cramming_weeks = {max_week - 2, max_week - 1, max_week}
    clog['is_cramming'] = clog['WEEK'].isin(cramming_weeks)
    
    # 1. Aggregations from log_activity
    def calc_user_log(group):
        total_clicks = len(group)
        sessions = group['SESSION_ID'].nunique()
        active_days = group['DATE'].nunique()
        materials = group['CONTENT_ID'].nunique()
        active_weeks = group['WEEK'].nunique()
        
        # Cramming ratio: clicks in final weeks / total clicks
        cramming_clicks = group['is_cramming'].sum()
        cramming_ratio = round(float(cramming_clicks / total_clicks), 3) if total_clicks > 0 else 0.0
        
        # First active day latency (days from course start)
        first_date = group['DATE'].min()
        latency_days = (first_date - course_start).days if pd.notnull(first_date) else 30
        
        # Study regularity: weekly entropy
        week_counts = group['WEEK'].value_counts(normalize=True).values
        # Shannon entropy
        entropy = -np.sum(week_counts * np.log2(week_counts + 1e-12))
        regularity = round(float(entropy / np.log2(max(len(week_counts), 2))), 3) if len(week_counts) > 1 else 0.0
        
        return pd.Series({
            'total_clicks': total_clicks,
            'total_sessions': sessions,
            'active_days': active_days,
            'active_weeks': active_weeks,
            'materials_viewed': materials,
            'actions_per_session': round(float(total_clicks / max(sessions, 1)), 2),
            'cramming_ratio': cramming_ratio,
            'procrastination_latency': max(0, latency_days),
            'study_regularity': regularity
        })
    
    print("Computing student activity metrics from clickstream...")
    user_log_metrics = clog.groupby('USER_ID').apply(calc_user_log, include_groups=False).reset_index()
    
    # 2. Aggregations from consumption (reading)
    c_cons = cons_df[cons_df['COURSE_ID'] == course_name].groupby('USER_ID').agg(
        total_posts_read=('NUM_READ_POSTS', 'sum'),
        threads_read_count=('CONTEXT_ID', 'nunique')
    ).reset_index()
    
    # 3. Aggregations from contribution (forum posts)
    c_contrib = contrib_df[contrib_df['COURSE_ID'] == course_name].groupby('USER_ID').agg(
        forum_posts_written=('POST_ID', 'count'),
        avg_post_length=('MSG_TEXT_LENGTH', 'mean')
    ).reset_index()
    
    # 4. Merge all tables
    res = cp.merge(user_log_metrics, on='USER_ID', how='left')
    res = res.merge(c_cons, on='USER_ID', how='left')
    res = res.merge(c_contrib, on='USER_ID', how='left')
    
    # Clean score categories and rename
    res['score_category'] = res['SCORE_CATEGORY_FINAL'].fillna('Borderline').astype(str)
    res['passed'] = res['PASSED'].fillna(0).astype(int)
    res['passed_first_attempt'] = res['PASSED_FIRST_ATTEMPT'].fillna(0).astype(int)
    
    # Numerical grade proxy for radar / evaluation (0-20 scale standard in Belgian universities like KU Leuven):
    # Excellent -> 16-18, Able to Push -> 13-15, Pass -> 10-12, Borderline -> 8-9, Fail -> 3-7
    np.random.seed(42)
    def assign_grade(cat):
        if cat == 'Excellent': return np.random.randint(16, 20)
        elif cat == 'Able to Push': return np.random.randint(13, 16)
        elif cat == 'Pass': return np.random.randint(10, 13)
        elif cat == 'Borderline': return np.random.randint(8, 10)
        else: return np.random.randint(2, 8)
    res['grade_equivalent'] = res['score_category'].apply(assign_grade)
    
    # Fill NAs
    int_cols = ['total_clicks', 'total_sessions', 'active_days', 'active_weeks', 'materials_viewed', 'total_posts_read', 'threads_read_count', 'forum_posts_written']
    for c in int_cols:
        res[c] = res[c].fillna(0).astype(int)
        
    float_cols = ['actions_per_session', 'cramming_ratio', 'procrastination_latency', 'study_regularity', 'avg_post_length']
    for c in float_cols:
        res[c] = res[c].fillna(0.0).round(2)
        
    # Select clean columns
    clean_cols = [
        'USER_ID', 'COURSE_ID', 'score_category', 'passed', 'passed_first_attempt', 'grade_equivalent',
        'total_clicks', 'total_sessions', 'active_days', 'active_weeks', 'materials_viewed',
        'actions_per_session', 'cramming_ratio', 'procrastination_latency', 'study_regularity',
        'total_posts_read', 'threads_read_count', 'forum_posts_written', 'avg_post_length'
    ]
    res_final = res[clean_cols].rename(columns={'USER_ID': 'user_id', 'COURSE_ID': 'course'})
    
    out_path = os.path.join(OUT_DIR, filename)
    res_final.to_csv(out_path, index=False, sep=';')
    print(f"Saved {len(res_final)} students to {out_path} with {len(clean_cols)} attributes.")
    print(res_final.head(3))

print("\nKU Leuven pipeline completed successfully!")

