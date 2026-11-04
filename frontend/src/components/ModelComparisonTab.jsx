import React from 'react';
import { 
  Scale, 
  Play, 
  RotateCw, 
  Award, 
  Grid, 
  AlertTriangle, 
  Layers, 
  CheckCircle2, 
  TrendingDown, 
  HelpCircle 
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function ModelComparisonTab({
  comparisonData,
  loadingComparison,
  onRunComparison,
  bicAicData,
  loadingBicAic,
  onFetchBicAic,
  compareK,
  setCompareK
}) {
  const { isDark } = useTheme();
  const metrics = comparisonData?.metrics || null;
  const kmSummary = comparisonData?.kmeans_summary || null;
  const gmmSummary = comparisonData?.gmm_summary || null;
  const contingency = metrics?.contingency_matrix || [];
  const contingencyRaw = metrics?.contingency_raw || [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Control Header */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-500" />
              Rigorous Model Comparison: K-Means vs GMM
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
              Side-by-side clustering evaluation using Silhouette Score, Davies-Bouldin Index, BIC/AIC, and contingency mapping.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 dark:bg-slate-950 bg-slate-100 px-3.5 py-2 rounded-xl dark:border-slate-800 border-slate-300 border">
              <span className="text-xs font-semibold dark:text-slate-300 text-slate-700 whitespace-nowrap">
                Evaluate at K = <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{compareK}</span>:
              </span>
              <input
                type="range"
                min="2"
                max="6"
                value={compareK}
                onChange={(e) => setCompareK(Number(e.target.value))}
                className="w-28 accent-indigo-500 cursor-pointer"
              />
            </div>

            <button
              onClick={onRunComparison}
              disabled={loadingComparison}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {loadingComparison ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Evaluating Both Models...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Run Model Benchmark
                </>
              )}
            </button>
          </div>
        </div>

        {/* Top Metric Scorecards */}
        {metrics && (
          <div className="mt-6 pt-6 border-t dark:border-slate-800 border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Silhouette Score */}
            <div className="p-4 rounded-xl dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium dark:text-slate-400 text-slate-500">Silhouette Score</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 font-medium">Higher is better</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold block">K-Means: {metrics.silhouette.kmeans}</span>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold block">GMM: {metrics.silhouette.gmm}</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full dark:bg-emerald-950 bg-emerald-50 text-emerald-700 dark:text-emerald-400 dark:border-emerald-800 border-emerald-200 border">
                  {metrics.silhouette.winner} Wins
                </span>
              </div>
            </div>

            {/* Davies-Bouldin Index */}
            <div className="p-4 rounded-xl dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium dark:text-slate-400 text-slate-500">Davies-Bouldin Index</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 font-medium">Lower is better</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold block">K-Means: {metrics.davies_bouldin.kmeans}</span>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold block">GMM: {metrics.davies_bouldin.gmm}</span>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full dark:bg-emerald-950 bg-emerald-50 text-emerald-700 dark:text-emerald-400 dark:border-emerald-800 border-emerald-200 border">
                  {metrics.davies_bouldin.winner} Wins
                </span>
              </div>
            </div>

            {/* Adjusted Rand Index */}
            <div className="p-4 rounded-xl dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium dark:text-slate-400 text-slate-500">Partition Agreement (ARI)</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded dark:bg-slate-800 bg-slate-200 dark:text-slate-300 text-slate-700 font-medium">Range [0, 1]</span>
              </div>
              <p className="text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
                {metrics.agreement.adjusted_rand_index}
              </p>
              <p className="text-[11px] dark:text-slate-400 text-slate-500">
                Normalized Mutual Info: <span className="font-mono dark:text-slate-200 text-slate-800 font-bold">{metrics.agreement.normalized_mutual_info}</span>
              </p>
            </div>

            {/* Borderline Students */}
            <div className="p-4 rounded-xl dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium dark:text-slate-400 text-slate-500">Borderline / Ambiguous Students</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded dark:bg-amber-950 bg-amber-50 text-amber-700 dark:text-amber-400 font-medium">Soft Clustering</span>
              </div>
              <p className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
                {metrics.borderline_analysis.borderline_percentage}%
              </p>
              <p className="text-[11px] dark:text-slate-400 text-slate-500">
                {metrics.borderline_analysis.borderline_students_count} of {metrics.borderline_analysis.total_students} students have max confidence &lt; 65%
              </p>
            </div>

          </div>
        )}
      </div>

      {/* Contingency Matrix Heatmap & BIC/AIC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Contingency Matrix (K-Means vs GMM Overlap) */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <Grid className="w-4 h-4 text-indigo-500" />
                Cluster Contingency Matrix (K-Means vs GMM)
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                Displays how student cohort assignments overlap across both algorithms.
              </p>
            </div>
          </div>

          {contingencyRaw.length > 0 ? (
            <div className="overflow-x-auto border dark:border-slate-800 border-slate-200 rounded-xl">
              <table className="w-full text-center text-xs">
                <thead className="dark:bg-slate-950 bg-slate-100 dark:text-slate-400 text-slate-700 font-semibold border-b dark:border-slate-800 border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left">K-Means \ GMM</th>
                    {contingencyRaw[0].map((_, j) => (
                      <th key={j} className="px-4 py-3 text-cyan-600 dark:text-cyan-400">GMM C{j + 1}</th>
                    ))}
                    <th className="px-4 py-3 dark:text-slate-300 text-slate-700 font-bold">K-Means Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200 dark:text-slate-300 text-slate-700">
                  {contingencyRaw.map((row, i) => {
                    const rowSum = row.reduce((a, b) => a + b, 0);
                    return (
                      <tr key={i} className="dark:hover:bg-slate-800/40 hover:bg-slate-50">
                        <td className="px-4 py-3 font-semibold text-left text-indigo-600 dark:text-indigo-400">K-Means C{i + 1}</td>
                        {row.map((val, j) => {
                          const intensity = rowSum > 0 ? val / rowSum : 0;
                          return (
                            <td 
                              key={j} 
                              className="px-4 py-3 font-mono font-bold"
                              style={{
                                backgroundColor: intensity > 0.5 
                                  ? (isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(99, 102, 241, 0.15)') 
                                  : 'transparent',
                                color: intensity > 0.5 ? '#6366f1' : (isDark ? '#94a3b8' : '#64748b')
                              }}
                            >
                              {val}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 font-mono font-bold dark:text-white text-slate-900 dark:bg-slate-950/40 bg-slate-100">{rowSum}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs dark:text-slate-400 text-slate-500">Run model comparison to generate contingency matrix.</p>
          )}

          <p className="mt-4 text-xs dark:text-slate-400 text-slate-500">
            A diagonal concentration indicates high structural agreement between spherical Euclidean partitioning and elliptical Gaussian density estimation.
          </p>
        </div>

        {/* BIC & AIC Model Selection Curve */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-amber-500" />
                  Model Selection: BIC & AIC Curves
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                  Bayesian Information Criterion (BIC) & Akaike Criterion (AIC) across K = 2 to 8.
                </p>
              </div>

              <button
                onClick={onFetchBicAic}
                disabled={loadingBicAic}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-700 border dark:border-amber-500/30 border-amber-200 transition-all cursor-pointer"
              >
                {loadingBicAic ? 'Computing...' : 'Compute Curves'}
              </button>
            </div>

            {bicAicData && bicAicData.length > 0 ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={bicAicData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
                    <XAxis dataKey="k" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                    <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} domain={['auto', 'auto']} />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: isDark ? '#0f172a' : '#ffffff', 
                        borderColor: isDark ? '#334155' : '#cbd5e1', 
                        color: isDark ? '#ffffff' : '#0f172a',
                        borderRadius: '0.5rem', 
                        fontSize: '12px' 
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                    <Line 
                      type="monotone" 
                      dataKey="bic" 
                      name="BIC (Penalizes Complexity)" 
                      stroke="#f59e0b" 
                      strokeWidth={2}
                      dot={{ fill: '#f59e0b', r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="aic" 
                      name="AIC (Akaike Criterion)" 
                      stroke="#06b6d4" 
                      strokeWidth={2}
                      dot={{ fill: '#06b6d4', r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center border border-dashed dark:border-slate-800 border-slate-300 rounded-xl dark:text-slate-500 text-slate-400 text-xs">
                Click "Compute Curves" to evaluate GMM penalization across K
              </div>
            )}
          </div>

          <div className="mt-4 p-3 dark:bg-slate-950/60 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 text-[11px] dark:text-slate-400 text-slate-600">
            <span className="font-semibold dark:text-slate-200 text-slate-900">Model Selection Principle: </span>
            Unlike simple log-likelihood which always increases with more components, BIC incorporates a penalty term p · ln(N) for the number of free parameters. The optimal K minimizes BIC.
          </div>
        </div>

      </div>

      {/* Conceptual Differences Matrix: When to Use Which */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-sm font-bold dark:text-white text-slate-900 mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-500" />
          Unit III Algorithm Comparison: K-Means vs Gaussian Mixture Models
        </h3>

        <div className="overflow-x-auto border dark:border-slate-800 border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="dark:bg-slate-950 bg-slate-100 dark:text-slate-400 text-slate-700 font-semibold border-b dark:border-slate-800 border-slate-200">
              <tr>
                <th className="px-4 py-3">Theoretical Dimension</th>
                <th className="px-4 py-3 text-indigo-600 dark:text-indigo-400">K-Means Clustering</th>
                <th className="px-4 py-3 text-cyan-600 dark:text-cyan-400">Gaussian Mixture Models (GMM)</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200 dark:text-slate-300 text-slate-700">
              <tr>
                <td className="px-4 py-2.5 font-medium">Underlying Model Assumption</td>
                <td className="px-4 py-2.5">Spherical clusters with equal variance (Voronoi cells)</td>
                <td className="px-4 py-2.5">Linear mixture of multivariate Gaussians with arbitrary covariances</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Assignment Type</td>
                <td className="px-4 py-2.5 font-semibold text-amber-600 dark:text-amber-400">Hard Clustering (Each student strictly in 1 cluster)</td>
                <td className="px-4 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">Soft Clustering (Probabilistic posterior responsibilities γ_ik)</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Optimization Algorithm</td>
                <td className="px-4 py-2.5">Lloyd's Heuristic (Assign closest centroid → update mean)</td>
                <td className="px-4 py-2.5">Expectation-Maximization (EM) Algorithm</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Objective Function</td>
                <td className="px-4 py-2.5 font-mono">{"WCSS = ∑_k ∑_i ||x_i - μ_k||²"}</td>
                <td className="px-4 py-2.5 font-mono">{"ln p(X | Θ) = ∑_i ln ∑_k π_k · N(x_i | μ_k, Σ_k)"}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Computational Complexity</td>
                <td className="px-4 py-2.5 text-emerald-600 dark:text-emerald-400 font-mono">{"O(K · N · d · iters) — Fast"}</td>
                <td className="px-4 py-2.5 text-amber-600 dark:text-amber-400 font-mono">{"O(K · N · d³ · iters) — Matrix Inversion"}</td>
              </tr>
              <tr>
                <td className="px-4 py-2.5 font-medium">Handling Ambiguous Students</td>
                <td className="px-4 py-2.5 dark:text-slate-400 text-slate-500">Forces borderline students across sharp boundaries</td>
                <td className="px-4 py-2.5 text-cyan-600 dark:text-cyan-300">Quantifies uncertainty via entropy and confidence scores</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
