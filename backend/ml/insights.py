import numpy as np
import pandas as pd

def generate_cohort_insights(raw_df, cluster_labels, algorithm_name="K-Means"):
    """
    Analyzes discovered clusters across behavioral and academic dimensions.
    Automatically handles both:
    1. KU Leuven Learning Platform Telemetry (sessions, clicks, cramming, regularity, forum engagement)
    2. UCI Student Survey Attributes (studytime, failures, absences, alcohol consumption, G3)
    """
    df = raw_df.copy()
    df['cluster'] = cluster_labels
    n_clusters = len(np.unique(cluster_labels))
    
    is_kul = 'total_clicks' in df.columns
    
    cohorts = []
    
    if is_kul:
        # KU Leuven baseline metrics
        base_sessions = float(df['total_sessions'].mean())
        base_clicks = float(df['total_clicks'].mean())
        base_days = float(df['active_days'].mean())
        base_cramming = float(df['cramming_ratio'].mean())
        base_latency = float(df['procrastination_latency'].mean())
        base_regularity = float(df['study_regularity'].mean())
        base_grade = float(df['grade_equivalent'].mean()) if 'grade_equivalent' in df.columns else 11.0
        base_pass_rate = float(df['passed'].mean() * 100) if 'passed' in df.columns else 70.0

        for c in range(n_clusters):
            cdf = df[df['cluster'] == c]
            c_size = len(cdf)
            if c_size == 0:
                continue
                
            c_pct = round((c_size / len(df)) * 100, 1)
            
            m_sessions = float(cdf['total_sessions'].mean())
            m_clicks = float(cdf['total_clicks'].mean())
            m_days = float(cdf['active_days'].mean())
            m_materials = float(cdf['materials_viewed'].mean())
            m_cramming = float(cdf['cramming_ratio'].mean())
            m_latency = float(cdf['procrastination_latency'].mean())
            m_regularity = float(cdf['study_regularity'].mean())
            m_grade = float(cdf['grade_equivalent'].mean()) if 'grade_equivalent' in cdf.columns else 10.0
            m_pass = float(cdf['passed'].mean() * 100) if 'passed' in cdf.columns else 50.0
            m_posts_read = float(cdf['total_posts_read'].mean()) if 'total_posts_read' in cdf.columns else 0.0

            # Unsupervised Academic Risk Score for LMS clickstreams:
            # + Procrastination latency (delayed first login)
            # + High cramming ratio (lack of consistent distributed practice)
            # - Total sessions & active days
            # - Study regularity
            # - Grade equivalent / pass rate
            risk_components = [
                (m_latency / (base_latency + 1.0)) * 2.0,
                (m_cramming / (base_cramming + 0.1)) * 1.5,
                - (m_sessions / (base_sessions + 1.0)) * 2.0,
                - (m_regularity / (base_regularity + 0.1)) * 1.5,
                - (m_grade / (base_grade + 0.1)) * 2.5
            ]
            raw_risk = sum(risk_components)
            risk_score = round(float(np.clip(50.0 + raw_risk * 10.0, 5.0, 95.0)), 1)
            
            # Archetype assignment
            if risk_score >= 62.0 or m_pass < 50.0 or m_sessions < (base_sessions * 0.6):
                risk_level = "High Risk"
                archetype = "Disengaged & Minimalist Learners"
                color = "#ef4444"
                recommendations = [
                    "Automated LMS activity nudges triggered after 7 consecutive days of inactivity.",
                    "Mandatory weekly diagnostic checkpoints to discourage complete drop-off.",
                    "Outreach by course teaching assistants to identify prerequisite roadblocks."
                ]
            elif m_cramming > 0.40 and m_regularity < 0.60:
                risk_level = "Moderate Risk"
                archetype = "Last-Minute Crammers (Irregular Pacing)"
                color = "#f59e0b"
                recommendations = [
                    "Implement weekly micro-quizzes to force distributed study spacing.",
                    "Time-management advising to balance semester load before examination blocks.",
                    "Release formative practice questions with strict milestone deadlines."
                ]
            elif m_sessions >= base_sessions and m_grade >= 13.0 and m_regularity >= 0.70:
                risk_level = "Low Risk"
                archetype = "Consistent Self-Regulated Learners"
                color = "#10b981"
                recommendations = [
                    "Encourage peer-mentoring roles in online discussion forums.",
                    "Advanced supplemental case studies and research seminar opportunities.",
                    "Fast-track recommendations for academic honours tracks."
                ]
            else:
                risk_level = "Low-Moderate Risk"
                archetype = "Steady Active Learners"
                color = "#3b82f6"
                recommendations = [
                    "Encourage transitioning from passive document downloads to active forum engagement.",
                    "Self-assessment trackers to convert average performance into mastery tier."
                ]
                
            radar_profile = [
                {'metric': 'LMS Activity Volume', 'value': round(float(min(100, (m_clicks / (base_clicks * 1.8)) * 100)), 1)},
                {'metric': 'Study Regularity', 'value': round(float(min(100, m_regularity * 100)), 1)},
                {'metric': 'Prompt Engagement', 'value': round(float(max(0, 100 - (m_latency / 30.0) * 100)), 1)},
                {'metric': 'Content Breadth', 'value': round(float(min(100, (m_materials / 150.0) * 100)), 1)},
                {'metric': 'Pass Rate', 'value': round(float(m_pass), 1)},
                {'metric': 'Even Pacing', 'value': round(float(max(0, 100 - (m_cramming * 100))), 1)}
            ]

            cohorts.append({
                'cluster_id': c,
                'cluster_name': f"Cohort {c + 1}",
                'archetype': archetype,
                'risk_level': risk_level,
                'risk_score': risk_score,
                'size': c_size,
                'percentage': c_pct,
                'color': color,
                'metrics': {
                    'avg_g3': round(m_grade, 2),
                    'avg_studytime': round(m_sessions, 1), # sessions proxy
                    'avg_failures': round(float(100 - m_pass), 1), # fail rate proxy
                    'avg_absences': round(m_latency, 1), # latency proxy
                    'avg_freetime': round(m_cramming * 10, 1),
                    'avg_goout': round(m_regularity * 5, 2),
                    'avg_alcohol': round(float(m_clicks / 500), 2),
                    'higher_asp_pct': round(m_pass, 1)
                },
                'radar_profile': radar_profile,
                'recommendations': recommendations
            })
            
        global_baselines = {
            'avg_g3': round(base_grade, 2),
            'avg_studytime': round(base_sessions, 1),
            'avg_failures': round(float(100 - base_pass_rate), 1),
            'avg_absences': round(base_latency, 1),
            'avg_alcohol': round(float(base_clicks / 500), 2)
        }
        
    else:
        # Standard UCI survey dataset interpretation
        global_g3 = float(df['G3'].mean()) if 'G3' in df.columns else 10.0
        global_study = float(df['studytime'].mean()) if 'studytime' in df.columns else 2.0
        global_failures = float(df['failures'].mean()) if 'failures' in df.columns else 0.3
        global_absences = float(df['absences'].mean()) if 'absences' in df.columns else 5.7
        global_alc = float((df['Dalc'] + df['Walc']).mean()) if ('Dalc' in df.columns and 'Walc' in df.columns) else 3.5

        for c in range(n_clusters):
            cdf = df[df['cluster'] == c]
            c_size = len(cdf)
            if c_size == 0:
                continue
                
            c_pct = round((c_size / len(df)) * 100, 1)
            mean_g3 = float(cdf['G3'].mean()) if 'G3' in cdf.columns else 0.0
            mean_g1 = float(cdf['G1'].mean()) if 'G1' in cdf.columns else 0.0
            mean_study = float(cdf['studytime'].mean()) if 'studytime' in cdf.columns else 0.0
            mean_failures = float(cdf['failures'].mean()) if 'failures' in cdf.columns else 0.0
            mean_absences = float(cdf['absences'].mean()) if 'absences' in cdf.columns else 0.0
            mean_freetime = float(cdf['freetime'].mean()) if 'freetime' in cdf.columns else 0.0
            mean_goout = float(cdf['goout'].mean()) if 'goout' in cdf.columns else 0.0
            mean_dalc = float(cdf['Dalc'].mean()) if 'Dalc' in cdf.columns else 0.0
            mean_walc = float(cdf['Walc'].mean()) if 'Walc' in cdf.columns else 0.0
            mean_total_alc = mean_dalc + mean_walc
            mean_famrel = float(cdf['famrel'].mean()) if 'famrel' in cdf.columns else 0.0
            
            higher_pct = round(float((cdf['higher'].astype(str).str.lower().isin(['yes', '1'])).mean()) * 100, 1) if 'higher' in cdf.columns else 90.0

            risk_components = [
                (mean_failures / (global_failures + 0.1)) * 2.5,
                (mean_absences / (global_absences + 1.0)) * 1.5,
                (mean_total_alc / (global_alc + 0.5)) * 1.2,
                - (mean_study / (global_study + 0.1)) * 1.5,
                - (mean_g3 / (global_g3 + 0.1)) * 2.0
            ]
            raw_risk = sum(risk_components)
            risk_score = round(float(np.clip(50.0 + raw_risk * 10.0, 5.0, 95.0)), 1)
            
            if risk_score >= 65.0 or mean_failures > 0.8 or mean_g3 < 8.5:
                risk_level = "High Risk"
                archetype = "Struggling Learners with High Attrition Risk"
                color = "#ef4444"
                recommendations = [
                    "Targeted academic tutoring for past prerequisite failure remediation.",
                    "Mandatory attendance tracking and early intervention on recurring absences.",
                    "Counseling support to investigate non-academic stressors and study habits."
                ]
            elif risk_score >= 45.0 or mean_absences > 8.0 or mean_total_alc > 4.5:
                risk_level = "Moderate Risk"
                archetype = "Socially Active / Potential Underachievers"
                color = "#f59e0b"
                recommendations = [
                    "Study-life balance mentoring to redirect excess leisure hours toward academic goals.",
                    "Weekly check-ins and structured peer study groups.",
                    "Encouraging consistent attendance during examination weeks."
                ]
            elif mean_g3 >= 13.0 and mean_study >= 2.2:
                risk_level = "Low Risk"
                archetype = "Consistent High-Achievers"
                color = "#10b981"
                recommendations = [
                    "Advanced enrichment projects, mentorship roles, and scholarship advisement.",
                    "Participation in extracurricular academic competitions."
                ]
            else:
                risk_level = "Low-Moderate Risk"
                archetype = "Steady Performers"
                color = "#3b82f6"
                recommendations = [
                    "Goal-setting exercises to transition from average to high academic tier.",
                    "Periodic formative assessments to prevent grade slippage in later terms."
                ]
                
            radar_profile = [
                {'metric': 'Academic Performance', 'value': round(float((mean_g3 / 20.0) * 100), 1)},
                {'metric': 'Study Discipline', 'value': round(float((mean_study / 4.0) * 100), 1)},
                {'metric': 'Attendance Rate', 'value': round(float(max(0, 100 - (mean_absences / 30.0) * 100)), 1)},
                {'metric': 'Past Mastery', 'value': round(float(max(0, 100 - (mean_failures / 3.0) * 100)), 1)},
                {'metric': 'Sobriety / Focus', 'value': round(float(max(0, 100 - (mean_total_alc / 10.0) * 100)), 1)},
                {'metric': 'Family Support', 'value': round(float((mean_famrel / 5.0) * 100), 1)}
            ]
            
            cohorts.append({
                'cluster_id': c,
                'cluster_name': f"Cohort {c + 1}",
                'archetype': archetype,
                'risk_level': risk_level,
                'risk_score': risk_score,
                'size': c_size,
                'percentage': c_pct,
                'color': color,
                'metrics': {
                    'avg_g3': round(mean_g3, 2),
                    'avg_g1': round(mean_g1, 2),
                    'avg_studytime': round(mean_study, 2),
                    'avg_failures': round(mean_failures, 2),
                    'avg_absences': round(mean_absences, 2),
                    'avg_freetime': round(mean_freetime, 2),
                    'avg_goout': round(mean_goout, 2),
                    'avg_alcohol': round(mean_total_alc, 2),
                    'higher_asp_pct': higher_pct
                },
                'radar_profile': radar_profile,
                'recommendations': recommendations
            })
            
        global_baselines = {
            'avg_g3': round(global_g3, 2),
            'avg_studytime': round(global_study, 2),
            'avg_failures': round(global_failures, 2),
            'avg_absences': round(global_absences, 2),
            'avg_alcohol': round(global_alc, 2)
        }

    cohorts.sort(key=lambda x: x['risk_score'], reverse=True)
    
    return {
        'algorithm': algorithm_name,
        'is_learning_platform': is_kul,
        'total_students': len(df),
        'cohorts': cohorts,
        'global_baselines': global_baselines
    }
