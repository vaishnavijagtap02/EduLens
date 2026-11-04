import React from 'react';
import { 
  BookOpen, 
  Binary, 
  GitMerge, 
  TrendingUp, 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function MathTheoryTab() {
  const { isDark } = useTheme();

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Title */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 transition-colors">
        <h2 className="text-2xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-500" />
          Unit III Machine Learning Mathematical Foundations & Viva Reference
        </h2>
        <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
          Complete analytical derivations, mathematical formulas, and algorithmic breakdowns for K-Means, GMM, and EM.
        </p>
      </div>

      {/* Section 1: K-Means Clustering */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg dark:bg-indigo-950 bg-indigo-50 text-indigo-600 dark:text-indigo-400 dark:border-indigo-800 border-indigo-200 border flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-lg font-bold dark:text-white text-slate-900">K-Means Clustering & Lloyd's Algorithm</h3>
        </div>

        <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
          K-Means is a centroid-based partitioning algorithm that divides an unlabeled student feature space X = &#123;x_1, ..., x_N&#125; in R^D into K disjoint clusters S = &#123;S_1, ..., S_K&#125;.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Objective Function (WCSS / Inertia)
            </span>
            <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-indigo-700 dark:text-indigo-200 border dark:border-slate-800 border-slate-200">
              {"J = ∑_{k=1}^K ∑_{x_i ∈ S_k} ||x_i - μ_k||²"}
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              Where μ_k is the centroid of points in cluster S_k. The algorithm guarantees monotonic reduction of J at each step.
            </p>
          </div>

          <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              Assignment & Centroid Update Rules
            </span>
            <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-indigo-700 dark:text-indigo-200 border dark:border-slate-800 border-slate-200 space-y-1">
              <div>{"c_i = argmin_k ||x_i - μ_k||²"}</div>
              <div>{"μ_k = (1 / |S_k|) ∑_{x_i ∈ S_k} x_i"}</div>
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              Alternating between the assignment step and the update step converges when max ||μ_k(t+1) - μ_k(t)|| &lt; ε.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl dark:bg-indigo-950/30 bg-indigo-50 border dark:border-indigo-500/20 border-indigo-200 text-xs dark:text-slate-300 text-slate-700">
          <span className="font-semibold text-indigo-700 dark:text-indigo-300">College Review Note: </span>
          K-Means assumes clusters are spherical, isotropic, and similarly sized. When student groups exhibit non-spherical spread or differing variances, Gaussian Mixture Models are required.
        </div>
      </div>

      {/* Section 2: Gaussian Mixture Models */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg dark:bg-cyan-950 bg-cyan-50 text-cyan-600 dark:text-cyan-400 dark:border-cyan-800 border-cyan-200 border flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-lg font-bold dark:text-white text-slate-900">Gaussian Mixture Models (GMM)</h3>
        </div>

        <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
          GMM is a generative probabilistic model assuming each student x_i is drawn from a mixture of K multivariate normal distributions with mixture weights π_k.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
              Multivariate Gaussian Density
            </span>
            <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-cyan-700 dark:text-cyan-200 border dark:border-slate-800 border-slate-200">
              {"N(x | μ_k, Σ_k) = (1 / ((2π)^(D/2) |Σ_k|^(1/2))) · exp(-1/2 (x - μ_k)^T Σ_k^(-1) (x - μ_k))"}
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              Where μ_k in R^D is the mean vector and Σ_k in R^(D×D) is the positive semi-definite covariance matrix.
            </p>
          </div>

          <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
              Mixture Distribution & Marginal Density
            </span>
            <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-cyan-700 dark:text-cyan-200 border dark:border-slate-800 border-slate-200">
              {"p(x) = ∑_{k=1}^K π_k · N(x | μ_k, Σ_k),  where ∑ π_k = 1, π_k ≥ 0"}
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              π_k = P(Z = k) represents the prior probability that an unobserved student belongs to cohort k.
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Expectation-Maximization Algorithm */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg dark:bg-amber-950 bg-amber-50 text-amber-600 dark:text-amber-400 dark:border-amber-800 border-amber-200 border flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-lg font-bold dark:text-white text-slate-900">The Expectation-Maximization (EM) Algorithm</h3>
        </div>

        <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
          Because the latent indicator variables Z_i (student true cohort) are unobserved, direct maximum likelihood estimation has no closed form. EM iteratively maximizes the lower bound of the log likelihood.
        </p>

        <div className="space-y-4 pt-2">
          {/* Incomplete log likelihood */}
          <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              Incomplete Data Log-Likelihood
            </span>
            <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-amber-700 dark:text-amber-200 border dark:border-slate-800 border-slate-200">
              {"ln p(X | Θ) = ∑_{i=1}^N ln ( ∑_{k=1}^K π_k · N(x_i | μ_k, Σ_k) )"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* E Step */}
            <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
                E-Step: Posterior Responsibilities (γ_ik)
              </span>
              <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-cyan-700 dark:text-cyan-200 border dark:border-slate-800 border-slate-200">
                {"γ_ik = P(Z_i = k | x_i) = (π_k · N(x_i | μ_k, Σ_k)) / ∑_j π_j · N(x_i | μ_j, Σ_j)"}
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-500">
                Calculates the probability that student x_i was generated by component k using Bayes' Theorem.
              </p>
            </div>

            {/* M Step */}
            <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                M-Step: Analytical Parameter Re-estimation
              </span>
              <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-emerald-700 dark:text-emerald-200 border dark:border-slate-800 border-slate-200 space-y-1">
                <div>{"N_k = ∑_i γ_ik,   π_k = N_k / N"}</div>
                <div>{"μ_k = (1 / N_k) ∑_i γ_ik x_i"}</div>
                <div>{"Σ_k = (1 / N_k) ∑_i γ_ik (x_i - μ_k)(x_i - μ_k)^T"}</div>
              </div>
              <p className="text-[11px] dark:text-slate-400 text-slate-500">
                Updates weights, means, and covariances by maximizing the expected complete-data log-likelihood.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Evaluation Metrics */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg dark:bg-purple-950 bg-purple-50 text-purple-600 dark:text-purple-400 dark:border-purple-800 border-purple-200 border flex items-center justify-center font-bold text-sm">
            4
          </div>
          <h3 className="text-lg font-bold dark:text-white text-slate-900">Clustering Evaluation Metrics</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">
              1. Silhouette Coefficient
            </span>
            <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-indigo-700 dark:text-indigo-200 border dark:border-slate-800 border-slate-200">
              {"s(i) = (b(i) - a(i)) / max(a(i), b(i)),   s(i) ∈ [-1, 1]"}
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              a(i) is the mean intra-cluster distance; b(i) is the mean nearest-cluster distance. Higher values indicate tight, well-separated clusters.
            </p>
          </div>

          <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider block">
              2. Davies-Bouldin Index (DBI)
            </span>
            <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-cyan-700 dark:text-cyan-200 border dark:border-slate-800 border-slate-200">
              {"DB = (1 / K) ∑_{i=1}^K max_{j ≠ i} ( (s_i + s_j) / d(c_i, c_j) )"}
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              Measures the ratio of within-cluster scatter to between-cluster separation. Lower DBI values indicate superior clustering.
            </p>
          </div>

          <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
              3. Bayesian Information Criterion (BIC)
            </span>
            <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-amber-700 dark:text-amber-200 border dark:border-slate-800 border-slate-200">
              {"BIC = -2 ln(L_hat) + p · ln(N)"}
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              Penalizes model complexity by p · ln(N) where p is the number of free parameters. Minimum BIC denotes optimal balance.
            </p>
          </div>

          <div className="p-4 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 space-y-2">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
              4. Akaike Information Criterion (AIC)
            </span>
            <div className="p-3 dark:bg-slate-900/80 bg-white rounded-lg text-xs font-mono text-rose-700 dark:text-rose-200 border dark:border-slate-800 border-slate-200">
              {"AIC = -2 ln(L_hat) + 2p"}
            </div>
            <p className="text-[11px] dark:text-slate-400 text-slate-500">
              Penalizes complexity by 2p. Slightly favors richer models than BIC in large sample regimes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
