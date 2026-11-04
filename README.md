# EduLens – Student Behavioural Cohort Discovery & Academic Risk Analysis

An interactive web-based Machine Learning application that discovers hidden student behavioural cohorts and identifies latent academic vulnerability patterns without relying on predefined labels, using authentic data from the **UCI Machine Learning Repository**.

---

## 🎓 Unit III Machine Learning Concepts Implemented

1. **K-Means Clustering**
   - **From-Scratch Implementation:** Mathematical implementation of Lloyd's heuristic with Euclidean distance computation, assignment step, and cluster mean centroid update.
   - **Objective Function (WCSS):** Real-time monitoring of Within-Cluster Sum of Squares ($J$) across iterations.
   - **Convergence Tracking:** Stops when $\max_k \|\mu_k^{(t+1)} - \mu_k^{(t)}\| < \varepsilon$.
   - **Elbow Method:** Automatic calculation of Inertia and Silhouette Score across $K = 2 \dots 8$.
   - **Scikit-learn Parity:** Benchmark comparing custom routine with `sklearn.cluster.KMeans` (inertia, iterations, execution time, and Adjusted Rand Index).

2. **Gaussian Mixture Models (GMM)**
   - Linear combination of $K$ multivariate Gaussian distributions: $p(x) = \sum_{k=1}^K \pi_k \mathcal{N}(x \mid \mu_k, \Sigma_k)$.
   - Mixture weights ($\pi_k$), cluster means ($\mu_k$), and covariance structures (`full` and `diag`).
   - Probabilistic soft cluster assignments with student entropy/uncertainty scoring.
   - Identification of borderline/ambiguous students who lie on decision boundaries.

3. **Expectation-Maximization (EM) Algorithm**
   - **E-step:** Computes posterior responsibilities $\gamma_{ik} = P(Z_i = k \mid x_i)$ using Bayes' theorem.
   - **M-step:** Analytically re-estimates mixture weights $\pi_k$, centroids $\mu_k$, and covariance matrices $\Sigma_k$.
   - **Log-Likelihood Ascent:** Step-by-step convergence curve demonstrating the monotonic ascent guaranteed by Jensen's inequality: $\ln L^{(t+1)} \ge \ln L^{(t)}$.

4. **Clustering Evaluation & Comparison**
   - **Silhouette Score:** Intra-cluster compactness vs. nearest-cluster separation (range $[-1, 1]$).
   - **Davies-Bouldin Index (DBI):** Ratio of within-cluster scatter to between-cluster separation.
   - **BIC & AIC Curves:** Penalized model selection criteria across $K=2 \dots 8$.
   - **Cross-Algorithm Contingency Matrix:** Confusion heatmap mapping K-Means partitions to GMM Gaussian components.

5. **Cohort Discovery & Academic Risk Profiling**
   - Discovers distinct student archetypes (e.g., *Struggling Learners with High Attrition Risk*, *Consistent High-Achievers*, *Socially Active / Potential Underachievers*).
   - Computes an unsupervised **Academic Vulnerability Score (0-100)** based on standardized deviations in past failures, absences, alcohol consumption, and study hours.
   - Generates actionable pedagogical recommendations for academic intervention.

---

## 📊 Dataset: UCI Student Performance

- **Source:** [UCI Machine Learning Repository – Student Performance Dataset](https://archive.ics.uci.edu/dataset/320/student+performance)
- **Citation:** P. Cortez and A. Silva. *Using Data Mining to Predict Secondary School Student Performance*. EUROSIS, 2008.
- **Authenticity:** Genuine CSV files stored locally in `backend/data/`:
  - `student-mat.csv`: 395 student instances (Mathematics course)
  - `student-por.csv`: 649 student instances (Portuguese course)
- **Attributes:** 33 features covering academic grades ($G_1, G_2, G_3$), study time, prior failures, absences, free time, alcohol consumption, family relationships, and aspirations.
- **No synthetic data:** Zero fabricated or simulated records.

---

## 🛠️ Technology Stack

- **Frontend:** React 19 + Vite + Tailwind CSS + Lucide Icons + Recharts
- **Backend:** Python 3 + Flask + Flask-CORS
- **Machine Learning:** Scikit-learn + NumPy + SciPy
- **Data Processing:** Pandas
- **Dimensionality Reduction:** 2D PCA coordinate projection for universal cluster comparison

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Quick Start (Windows)
Double-click `start.bat` in the root folder, or run:
```bat
start.bat
```

### Manual Execution

#### 1. Backend (Flask)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
*Backend runs on `http://localhost:5000`.*

#### 2. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`.*

---

## 🖥️ Application Modules

1. **Dashboard:** Project overview, Unit III ML concept summary, dataset statistics, and quick-start links.
2. **Dataset Explorer:** Dynamic feature selection (academic, behavioral, social, demographic), scaling methods (`StandardScaler` vs `MinMaxScaler`), distribution histograms, and raw CSV table preview.
3. **K-Means Lab:** Dynamic $K$ slider, 2D PCA cluster scatter plot with centroids, step-by-step WCSS convergence curve, Scratch vs Sklearn validation table, and interactive Elbow Method.
4. **GMM & EM Lab:** Probabilistic soft memberships, uncertainty map, EM log-likelihood ascent curve, mixture weights and parameter breakdown, and individual student responsibility inspector.
5. **Model Comparison:** Silhouette and Davies-Bouldin scorecards, BIC/AIC curve, cluster contingency heatmap, and hard vs soft clustering tradeoff analysis.
6. **Cohort Insights:** Unsupervised academic risk profiling, cohort comparison bar charts, and pedagogical intervention recommendations.
7. **Math & Theory:** Complete Viva/College review reference with formulas, derivations, and algorithmic steps.

