import numpy as np
from scipy.special import logsumexp
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score

class EMTracker:
    r"""
    Mathematical Step-by-Step Expectation-Maximization (EM) Tracker for GMM.
    
    1. E-Step (Expectation):
       Calculate posterior responsibilities:
       \gamma_{nk} = P(z_n = k | x_n) = \frac{\pi_k \mathcal{N}(x_n | \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x_n | \mu_j, \Sigma_j)}
       
    2. M-Step (Maximization):
       Update mixture parameters:
       N_k = \sum_{n=1}^N \gamma_{nk}
       \pi_k = \frac{N_k}{N}
       \mu_k = \frac{1}{N_k} \sum_{n=1}^N \gamma_{nk} x_n
       \Sigma_k = \frac{1}{N_k} \sum_{n=1}^N \gamma_{nk} (x_n - \mu_k)(x_n - \mu_k)^T + \epsilon I
       
    3. Log-Likelihood:
       \ln p(X | \pi, \mu, \Sigma) = \sum_{n=1}^N \ln \left( \sum_{k=1}^K \pi_k \mathcal{N}(x_n | \mu_k, \Sigma_k) \right)
    """
    def __init__(self, n_components=3, max_iter=50, tol=1e-4, reg_covar=1e-5, random_state=42):
        self.n_components = n_components
        self.max_iter = max_iter
        self.tol = tol
        self.reg_covar = reg_covar
        self.random_state = random_state
        
    def _log_gaussian_pdf(self, X, mean, cov):
        """
        Computes log multivariate normal density:
        log N(x | mean, cov)
        """
        n_samples, n_features = X.shape
        diff = X - mean
        
        # Regularize covariance to guarantee positive definiteness
        cov_reg = cov + np.eye(n_features) * self.reg_covar
        
        try:
            sign, logdet = np.linalg.slogdet(cov_reg)
            inv_cov = np.linalg.inv(cov_reg)
        except np.linalg.LinAlgError:
            # Fallback to diagonal if singular
            diag = np.diag(cov_reg)
            logdet = np.sum(np.log(diag))
            inv_cov = np.diag(1.0 / diag)
            
        maha = np.sum(np.dot(diff, inv_cov) * diff, axis=1)
        log_prob = -0.5 * (n_features * np.log(2 * np.pi) + logdet + maha)
        return log_prob

    def fit_and_track(self, X):
        X = np.asarray(X, dtype=float)
        n_samples, n_features = X.shape
        rng = np.random.RandomState(self.random_state)
        
        # Initialize parameters: random points as initial means
        init_indices = rng.choice(n_samples, size=self.n_components, replace=False)
        means = X[init_indices].copy()
        weights = np.ones(self.n_components) / self.n_components
        
        # Initialize covariances to empirical data covariance
        emp_cov = np.cov(X, rowvar=False) + np.eye(n_features) * self.reg_covar
        covs = [emp_cov.copy() for _ in range(self.n_components)]
        
        iteration_history = []
        prev_ll = -np.inf
        
        responsibilities = np.zeros((n_samples, self.n_components))
        
        for it in range(self.max_iter):
            # ===== E-STEP: Calculate Responsibilities =====
            log_prob = np.zeros((n_samples, self.n_components))
            for k in range(self.n_components):
                log_prob[:, k] = np.log(weights[k] + 1e-12) + self._log_gaussian_pdf(X, means[k], covs[k])
                
            log_norm = logsumexp(log_prob, axis=1)
            # gamma_{nk} = exp(log_prob - log_norm)
            responsibilities = np.exp(log_prob - log_norm[:, np.newaxis])
            
            # Log-Likelihood for convergence check
            current_ll = float(np.sum(log_norm))
            ll_change = current_ll - prev_ll if it > 0 else 0.0
            
            iteration_history.append({
                'iteration': it + 1,
                'log_likelihood': round(current_ll, 4),
                'll_change': round(ll_change, 4),
                'weights': [round(float(w), 4) for w in weights],
                'cluster_counts': [round(float(np.sum(responsibilities[:, k])), 2) for k in range(self.n_components)]
            })
            
            if it > 0 and abs(ll_change) < self.tol:
                break
            prev_ll = current_ll
            
            # ===== M-STEP: Update Parameters =====
            N_k = np.sum(responsibilities, axis=0)
            weights = N_k / n_samples
            
            for k in range(self.n_components):
                # Update mean
                means[k] = np.sum(responsibilities[:, k, np.newaxis] * X, axis=0) / (N_k[k] + 1e-12)
                
                # Update covariance
                diff = X - means[k]
                covs[k] = np.dot((responsibilities[:, k, np.newaxis] * diff).T, diff) / (N_k[k] + 1e-12)
                covs[k] += np.eye(n_features) * self.reg_covar

        return {
            'weights': weights,
            'means': means,
            'covs': covs,
            'responsibilities': responsibilities,
            'history': iteration_history,
            'final_log_likelihood': prev_ll,
            'total_iterations': len(iteration_history)
        }


def run_gmm_analysis(X_scaled, pca_coords, n_components=3, covariance_type='full', max_iter=100, random_state=42):
    """
    Executes GMM with both custom EM tracking and Scikit-learn GaussianMixture.
    Returns soft responsibilities, hard labels, mixture parameters, BIC/AIC,
    and 2D projection metrics.
    """
    # 1. Custom Step-by-Step EM Tracker for educational insights
    tracker = EMTracker(n_components=n_components, max_iter=30, random_state=random_state)
    em_results = tracker.fit_and_track(X_scaled)
    
    # 2. Scikit-learn Gaussian Mixture Model for production guarantees
    gmm = GaussianMixture(
        n_components=n_components,
        covariance_type=covariance_type,
        max_iter=max_iter,
        random_state=random_state,
        n_init=3
    )
    gmm.fit(X_scaled)
    
    # Soft cluster assignments (posterior probabilities gamma_ik)
    soft_probs = gmm.predict_proba(X_scaled)
    hard_labels = gmm.predict(X_scaled)
    
    # Student uncertainty / entropy: H(x) = -sum p_k * log(p_k)
    epsilon = 1e-12
    uncertainty = -np.sum(soft_probs * np.log(soft_probs + epsilon), axis=1)
    # Highest uncertainty margin: 1 - max probability
    assignment_margin = 1.0 - np.max(soft_probs, axis=1)
    
    # Model selection criteria
    bic_score = float(gmm.bic(X_scaled))
    aic_score = float(gmm.aic(X_scaled))
    log_likelihood = float(gmm.score(X_scaled) * X_scaled.shape[0])
    
    # Silhouette score on hard assignments
    try:
        sil_score = float(silhouette_score(X_scaled, hard_labels))
    except Exception:
        sil_score = 0.0
        
    # Calculate 2D PCA cluster centers and component covariance ellipses
    pca_components = []
    for k in range(n_components):
        mask = (hard_labels == k)
        size = int(np.sum(mask))
        
        # Center in 2D PCA space (weighted or empirical)
        if size > 0:
            center_2d = np.mean(pca_coords[mask], axis=0)
            cov_2d = np.cov(pca_coords[mask], rowvar=False) if size > 2 else np.eye(2)
        else:
            center_2d = np.zeros(2)
            cov_2d = np.eye(2)
            
        # Eigenvalues and eigenvectors for drawing 95% confidence ellipse in 2D
        try:
            vals, vecs = np.linalg.eigh(cov_2d)
            # Sort eigenvalues
            order = vals.argsort()[::-1]
            vals, vecs = vals[order], vecs[:, order]
            theta = np.degrees(np.arctan2(*vecs[:, 0][::-1]))
            # 2 standard deviations (~95% coverage)
            width = 2.0 * 2.0 * np.sqrt(max(vals[0], 0.001))
            height = 2.0 * 2.0 * np.sqrt(max(vals[1], 0.001))
        except Exception:
            theta = 0.0
            width = 1.0
            height = 1.0
            
        pca_components.append({
            'component': k,
            'weight': round(float(gmm.weights_[k]), 4),
            'pca_x': round(float(center_2d[0]), 4),
            'pca_y': round(float(center_2d[1]), 4),
            'size': size,
            'ellipse': {
                'width': round(float(width), 3),
                'height': round(float(height), 3),
                'angle': round(float(theta), 2)
            }
        })
        
    # Sample soft probabilities for preview table (first 20 students)
    student_memberships = []
    for i in range(len(X_scaled)):
        student_memberships.append({
            'student_id': i + 1,
            'pca_x': round(float(pca_coords[i, 0]), 3),
            'pca_y': round(float(pca_coords[i, 1]), 3),
            'hard_label': int(hard_labels[i]),
            'soft_probs': [round(float(p), 4) for p in soft_probs[i]],
            'max_confidence': round(float(np.max(soft_probs[i])), 4),
            'uncertainty': round(float(uncertainty[i]), 4),
            'margin': round(float(assignment_margin[i]), 4)
        })
        
    return {
        'n_components': n_components,
        'covariance_type': covariance_type,
        'weights': [round(float(w), 4) for w in gmm.weights_],
        'hard_labels': [int(l) for l in hard_labels],
        'bic': round(bic_score, 2),
        'aic': round(aic_score, 2),
        'log_likelihood': round(log_likelihood, 2),
        'silhouette': round(sil_score, 4),
        'converged': bool(gmm.converged_),
        'sklearn_iterations': int(gmm.n_iter_),
        'em_history': em_results['history'],
        'pca_components': pca_components,
        'student_memberships': student_memberships
    }
