import time
import numpy as np
from sklearn.cluster import KMeans as SklearnKMeans
from sklearn.metrics import silhouette_score, adjusted_rand_score

class ScratchKMeans:
    r"""
    Mathematical Implementation of K-Means Clustering from Scratch.
    
    Objective Function (WCSS / Inertia):
        J = \sum_{k=1}^K \sum_{x \in S_k} ||x - \mu_k||^2
    
    Key Steps:
        1. Initialization (K-Means++ or Random)
        2. Assignment Step: c^{(i)} = \arg\min_k ||x^{(i)} - \mu_k||^2
        3. Update Step: \mu_k = \frac{1}{|S_k|} \sum_{x \in S_k} x
        4. Convergence Check: \max_k ||\mu_k^{(t)} - \mu_k^{(t-1)}|| < tol
    """
    def __init__(self, n_clusters=3, max_iter=100, tol=1e-4, init='k-means++', random_state=42):
        self.n_clusters = n_clusters
        self.max_iter = max_iter
        self.tol = tol
        self.init = init
        self.random_state = random_state
        
        # Output properties
        self.centroids = None
        self.labels = None
        self.inertia_ = None
        self.n_iter_ = 0
        self.history = []  # Tracks centroid and inertia at each step
        
    def _init_centroids(self, X):
        rng = np.random.RandomState(self.random_state)
        n_samples, n_features = X.shape
        
        if self.init == 'random':
            indices = rng.choice(n_samples, size=self.n_clusters, replace=False)
            return X[indices].copy()
            
        # K-Means++ initialization
        centroids = np.empty((self.n_clusters, n_features))
        first_idx = rng.randint(0, n_samples)
        centroids[0] = X[first_idx]
        
        for k in range(1, self.n_clusters):
            # Compute distance squared from each point to nearest chosen centroid
            dists = np.min([np.sum((X - c)**2, axis=1) for c in centroids[:k]], axis=0)
            probs = dists / np.sum(dists)
            next_idx = rng.choice(n_samples, p=probs)
            centroids[k] = X[next_idx]
            
        return centroids

    def fit(self, X):
        X = np.asarray(X, dtype=float)
        n_samples = X.shape[0]
        
        centroids = self._init_centroids(X)
        self.history = []
        
        for iteration in range(self.max_iter):
            # 1. Assignment Step: Euclidean Distance
            # dist_matrix shape: (n_samples, n_clusters)
            dist_sq = np.sum((X[:, np.newaxis, :] - centroids[np.newaxis, :, :]) ** 2, axis=2)
            labels = np.argmin(dist_sq, axis=1)
            
            # Compute current inertia (WCSS)
            current_inertia = float(np.sum(np.min(dist_sq, axis=1)))
            
            self.history.append({
                'iteration': iteration + 1,
                'inertia': round(current_inertia, 4),
                'centroids': centroids.tolist()
            })
            
            # 2. Update Step: Recompute centroids as cluster mean
            new_centroids = np.zeros_like(centroids)
            for k in range(self.n_clusters):
                cluster_points = X[labels == k]
                if len(cluster_points) > 0:
                    new_centroids[k] = np.mean(cluster_points, axis=0)
                else:
                    # Handle empty cluster by reinitializing to a random point
                    new_centroids[k] = X[np.random.choice(n_samples)]
                    
            # 3. Check for convergence
            shift = np.max(np.linalg.norm(new_centroids - centroids, axis=1))
            centroids = new_centroids
            
            if shift < self.tol:
                self.n_iter_ = iteration + 1
                break
        else:
            self.n_iter_ = self.max_iter
            
        self.centroids = centroids
        self.labels = labels
        self.inertia_ = float(np.sum((X - centroids[labels]) ** 2))
        return self

    def predict(self, X):
        X = np.asarray(X, dtype=float)
        dist_sq = np.sum((X[:, np.newaxis, :] - self.centroids[np.newaxis, :, :]) ** 2, axis=2)
        return np.argmin(dist_sq, axis=1)


def run_kmeans_analysis(X_scaled, pca_coords, n_clusters=3, max_iter=100, init='k-means++', random_state=42):
    """
    Executes both Custom Scratch K-Means and Sklearn K-Means.
    Returns comparison metrics, iteration history, centroids, and student assignments.
    """
    # 1. Run Scratch Implementation
    t0 = time.time()
    scratch_km = ScratchKMeans(n_clusters=n_clusters, max_iter=max_iter, init=init, random_state=random_state)
    scratch_km.fit(X_scaled)
    scratch_time = (time.time() - t0) * 1000 # ms
    
    # 2. Run Scikit-learn Implementation
    t1 = time.time()
    sklearn_km = SklearnKMeans(n_clusters=n_clusters, max_iter=max_iter, init=init, random_state=random_state, n_init=1)
    sklearn_km.fit(X_scaled)
    sklearn_time = (time.time() - t1) * 1000 # ms
    
    # Compare cluster agreement using Adjusted Rand Index
    agreement_score = adjusted_rand_score(scratch_km.labels, sklearn_km.labels_)
    
    # Project centroids into 2D PCA space for visualization
    # We compute cluster centroid positions in the same 2D PCA coordinate frame
    pca_centroids = []
    for k in range(n_clusters):
        cluster_mask = (scratch_km.labels == k)
        if np.sum(cluster_mask) > 0:
            mean_2d = np.mean(pca_coords[cluster_mask], axis=0)
            pca_centroids.append({
                'cluster': k,
                'pca_x': round(float(mean_2d[0]), 4),
                'pca_y': round(float(mean_2d[1]), 4),
                'size': int(np.sum(cluster_mask))
            })
            
    # Silhouette score
    try:
        sil_score = float(silhouette_score(X_scaled, scratch_km.labels))
    except Exception:
        sil_score = 0.0
        
    return {
        'n_clusters': n_clusters,
        'labels': [int(l) for l in scratch_km.labels],
        'inertia': round(scratch_km.inertia_, 4),
        'iterations': scratch_km.n_iter_,
        'history': scratch_km.history,
        'silhouette': round(sil_score, 4),
        'pca_centroids': pca_centroids,
        'comparison': {
            'scratch': {
                'inertia': round(scratch_km.inertia_, 4),
                'iterations': scratch_km.n_iter_,
                'time_ms': round(scratch_time, 2)
            },
            'sklearn': {
                'inertia': round(float(sklearn_km.inertia_), 4),
                'iterations': int(sklearn_km.n_iter_),
                'time_ms': round(sklearn_time, 2)
            },
            'adjusted_rand_index': round(float(agreement_score), 4),
            'inertia_difference': round(abs(scratch_km.inertia_ - sklearn_km.inertia_), 6)
        }
    }


def compute_elbow_curve(X_scaled, k_min=2, k_max=8, random_state=42):
    """
    Computes Inertia and Silhouette scores across a range of K values for the Elbow Method.
    """
    elbow_points = []
    for k in range(k_min, k_max + 1):
        km = SklearnKMeans(n_clusters=k, random_state=random_state, n_init=10)
        km.fit(X_scaled)
        sil = float(silhouette_score(X_scaled, km.labels_))
        elbow_points.append({
            'k': k,
            'inertia': round(float(km.inertia_), 2),
            'silhouette': round(sil, 4)
        })
    return elbow_points
