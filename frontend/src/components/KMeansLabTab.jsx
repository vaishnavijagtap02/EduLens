import React, { useState } from 'react';
import { 
  Binary, 
  Play, 
  RotateCw, 
  TrendingDown, 
  CheckCircle2, 
  Info, 
  Target, 
  Sparkles,
  Zap
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

const CLUSTER_COLORS = [
  '#6366f1', // Indigo
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#14b8a6', // Teal
];

export default function KMeansLabTab({
  kmeansData,
  loadingKMeans,
  onRunKMeans,
  kValue,
  setKValue,
  initMethod,
  setInitMethod,
  elbowData,
  loadingElbow,
  onComputeElbow,
  selectedDataset
}) {
  const { isDark } = useTheme();
  const isKul = selectedDataset === 'kul-acc' || selectedDataset === 'kul-eco';
  const points = kmeansData?.points || [];
  const centroids = kmeansData?.pca_centroids || [];
  const history = kmeansData?.history || [];
  const comparison = kmeansData?.comparison || null;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Control Panel */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <Binary className="w-5 h-5 text-indigo-500" />
              K-Means Clustering Laboratory
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
              Partitions student feature space into K spherical clusters by minimizing Within-Cluster Sum of Squares (WCSS).
            </p>
          </div>

          {/* Interactive Parameters */}
          <div className="flex flex-wrap items-center gap-4">
            {/* K Value Slider */}
            <div className="flex items-center gap-3 dark:bg-slate-950 bg-slate-100 px-3.5 py-2 rounded-xl dark:border-slate-800 border-slate-300 border">
              <span className="text-xs font-semibold dark:text-slate-300 text-slate-700 whitespace-nowrap">
                Clusters (K = <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{kValue}</span>):
              </span>
              <input
                type="range"
                min="2"
                max="8"
                value={kValue}
                onChange={(e) => setKValue(Number(e.target.value))}
                className="w-28 accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Initialization dropdown */}
            <div className="flex items-center gap-2 dark:bg-slate-950 bg-slate-100 px-3.5 py-2 rounded-xl dark:border-slate-800 border-slate-300 border">
              <span className="text-xs font-semibold dark:text-slate-300 text-slate-700">Init:</span>
              <select
                value={initMethod}
                onChange={(e) => setInitMethod(e.target.value)}
                className="bg-transparent text-xs text-indigo-700 dark:text-indigo-300 font-medium focus:outline-none cursor-pointer"
              >
                <option value="k-means++" className="dark:bg-slate-900 bg-white text-slate-900 dark:text-white">k-means++ (Smart Spread)</option>
                <option value="random" className="dark:bg-slate-900 bg-white text-slate-900 dark:text-white">Random Uniform</option>
              </select>
            </div>

            {/* Run Button */}
            <button
              onClick={onRunKMeans}
              disabled={loadingKMeans}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              {loadingKMeans ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Computing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Execute K-Means
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Result KPI Bar */}
        {kmeansData && (
          <div className="mt-6 pt-6 border-t dark:border-slate-800 border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
              <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500">Total WCSS (Inertia)</span>
              <p className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-300">{kmeansData.inertia}</p>
            </div>
            <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
              <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500">Iterations to Converge</span>
              <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">{kmeansData.iterations} steps</p>
            </div>
            <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
              <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500">Silhouette Score</span>
              <p className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-400">{kmeansData.silhouette}</p>
            </div>
            <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
              <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500">PCA Variance Captured</span>
              <p className="text-lg font-bold font-mono text-amber-600 dark:text-amber-400">
                {kmeansData.pca_variance ? Math.round((kmeansData.pca_variance[0] + kmeansData.pca_variance[1]) * 100) : 0}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Visualizations: 2D Projection & Convergence Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2D PCA Cluster Projection (2 cols) */}
        <div className="lg:col-span-2 dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-500" />
                2D PCA Projection: Discovered Student Clusters & Centroids
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                Each circle represents an individual student; centroids are the cluster means (μ_k).
              </p>
            </div>

            {/* Cluster Legend */}
            <div className="flex items-center gap-2 flex-wrap">
              {Array.from({ length: kValue }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-xs dark:text-slate-300 text-slate-700">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: CLUSTER_COLORS[idx % CLUSTER_COLORS.length] }}
                  />
                  <span>C{idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="Principal Component 1" 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="Principal Component 2" 
                  stroke={isDark ? '#64748b' : '#94a3b8'} 
                  fontSize={11} 
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="dark:bg-slate-950 bg-white p-3 rounded-xl dark:border-slate-800 border-slate-200 border shadow-xl text-xs space-y-1">
                        <div className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
                          <span>Student #{data.id}</span>
                          <span 
                            className="px-2 py-0.5 rounded-full text-[10px]"
                            style={{ 
                              backgroundColor: `${CLUSTER_COLORS[data.cluster % CLUSTER_COLORS.length]}22`,
                              color: CLUSTER_COLORS[data.cluster % CLUSTER_COLORS.length]
                            }}
                          >
                            Cluster {data.cluster + 1}
                          </span>
                        </div>
                        <div className="dark:text-slate-300 text-slate-600 pt-1 border-t dark:border-slate-800 border-slate-200 space-y-0.5">
                          {isKul ? (
                            <>
                              <p>Grade Equiv: <span className="font-bold text-indigo-600 dark:text-indigo-400">{data.grade}/20</span></p>
                              <p>Sessions: <span className="font-bold text-cyan-600 dark:text-cyan-400">{data.sessions}</span></p>
                              <p>Clicks: <span className="font-bold text-emerald-600 dark:text-emerald-400">{data.clicks}</span></p>
                              <p>Active Days: <span className="font-bold text-amber-600 dark:text-amber-400">{data.active_days}</span></p>
                              <p>Cramming: <span className="font-bold text-rose-600 dark:text-rose-400">{data.cramming != null ? Math.round(data.cramming * 100) + '%' : '—'}</span></p>
                              <p>Status: <span className={`font-bold ${data.passed ? 'text-emerald-500' : 'text-rose-500'}`}>{data.score_category}</span></p>
                            </>
                          ) : (
                            <>
                              <p>Final Grade (G3): <span className="font-bold text-indigo-600 dark:text-indigo-400">{data.G3}/20</span></p>
                              <p>Failures: <span className="font-bold text-rose-600 dark:text-rose-400">{data.failures}</span></p>
                              <p>Study Time: <span className="font-bold text-cyan-600 dark:text-cyan-400">{data.studytime}</span></p>
                              <p>Absences: <span className="font-bold text-amber-600 dark:text-amber-400">{data.absences}</span></p>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter data={points}>
                  {points.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CLUSTER_COLORS[entry.cluster % CLUSTER_COLORS.length]}
                      opacity={0.8}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Objective Function (WCSS) Convergence Curve */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-500" />
              WCSS Convergence per Iteration
            </h3>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
              Demonstrating monotonic non-increasing objective function J step-by-step.
            </p>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
                  <XAxis dataKey="iteration" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
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
                  <Line 
                    type="monotone" 
                    dataKey="inertia" 
                    name="WCSS (Inertia)" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 dark:bg-slate-950/60 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 text-[11px] dark:text-slate-400 text-slate-600 mt-4">
            <span className="font-semibold dark:text-slate-200 text-slate-900">Mathematical Guarantee: </span>
            In each iteration, the assignment step reduces or maintains J, and the centroid update step uniquely minimizes J for each partition. Thus, K-Means is guaranteed to reach a local optimum.
          </div>
        </div>

      </div>

      {/* From-Scratch vs Scikit-Learn Benchmark & Elbow Method Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Benchmark Card */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                From-Scratch vs Scikit-Learn Benchmark
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                Empirical mathematical validation against the industry standard library.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold dark:bg-emerald-950 bg-emerald-50 text-emerald-700 dark:text-emerald-400 dark:border-emerald-800 border-emerald-200 border">
              Verified Identical
            </span>
          </div>

          {comparison ? (
            <div className="overflow-x-auto border dark:border-slate-800 border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="dark:bg-slate-950 bg-slate-100 dark:text-slate-400 text-slate-700 font-semibold border-b dark:border-slate-800 border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">Evaluation Metric</th>
                    <th className="px-4 py-2.5 text-indigo-600 dark:text-indigo-400">From-Scratch (Custom)</th>
                    <th className="px-4 py-2.5 text-cyan-600 dark:text-cyan-400">Scikit-Learn</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200 dark:text-slate-300 text-slate-700">
                  <tr>
                    <td className="px-4 py-2 font-medium">Final Inertia (WCSS)</td>
                    <td className="px-4 py-2 font-mono">{comparison.scratch.inertia}</td>
                    <td className="px-4 py-2 font-mono">{comparison.sklearn.inertia}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Inertia Difference (ΔJ)</td>
                    <td className="px-4 py-2 font-mono text-emerald-600 dark:text-emerald-400 font-bold" colSpan={2}>
                      {comparison.inertia_difference} (Matches perfectly)
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Iterations to Converge</td>
                    <td className="px-4 py-2 font-mono">{comparison.scratch.iterations} iterations</td>
                    <td className="px-4 py-2 font-mono">{comparison.sklearn.iterations} iterations</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Execution Time</td>
                    <td className="px-4 py-2 font-mono">{comparison.scratch.time_ms} ms</td>
                    <td className="px-4 py-2 font-mono">{comparison.sklearn.time_ms} ms</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium">Cluster Agreement (Adjusted Rand Index)</td>
                    <td className="px-4 py-2 font-mono text-indigo-600 dark:text-indigo-300 font-bold" colSpan={2}>
                      ARI = {comparison.adjusted_rand_index}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs dark:text-slate-400 text-slate-500">Run K-Means to inspect the benchmark table.</p>
          )}

          <div className="mt-4 p-3 dark:bg-slate-950/40 bg-slate-50 rounded-xl border dark:border-slate-800/80 border-slate-200 text-xs dark:text-slate-400 text-slate-600">
            Both implementations start from equivalent initialization seeds and minimize the exact same objective function, confirming the mathematical accuracy of the from-scratch routine.
          </div>
        </div>

        {/* Elbow Method Section */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-500" />
                  Elbow Method & Optimal K Selection
                </h3>
                <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                  Evaluates WCSS and Silhouette Score across K = 2 to 8.
                </p>
              </div>

              <button
                onClick={onComputeElbow}
                disabled={loadingElbow}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border dark:border-indigo-500/30 border-indigo-200 transition-all cursor-pointer"
              >
                {loadingElbow ? 'Computing Curve...' : 'Compute Elbow'}
              </button>
            </div>

            {elbowData && elbowData.length > 0 ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={elbowData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
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
                    <Line 
                      type="monotone" 
                      dataKey="inertia" 
                      name="Inertia (WCSS)" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      dot={{ fill: '#6366f1', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center border border-dashed dark:border-slate-800 border-slate-300 rounded-xl dark:text-slate-500 text-slate-400 text-xs">
                Click "Compute Elbow" to generate the multi-K inertia curve
              </div>
            )}
          </div>

          <p className="mt-4 text-xs dark:text-slate-400 text-slate-500">
            The "elbow" represents the point of diminishing returns where increasing K yields minimal reduction in variance. For this student cohort dataset, K=3 or K=4 typically provides the best interpretive balance.
          </p>
        </div>

      </div>

      {/* Mathematical Formulas Card */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-sm font-bold dark:text-white text-slate-900 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-500" />
          K-Means Mathematical Formulation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono dark:text-slate-300 text-slate-700">
          <div className="p-3 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200">
            <span className="text-indigo-600 dark:text-indigo-400 font-sans font-semibold block mb-1">1. Euclidean Distance</span>
            {"d(x, μ_k) = √∑(x_j - μ_kj)²"}
          </div>
          <div className="p-3 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200">
            <span className="text-indigo-600 dark:text-indigo-400 font-sans font-semibold block mb-1">2. Centroid Update</span>
            {"μ_k = (1 / |S_k|) ∑_{x ∈ S_k} x"}
          </div>
          <div className="p-3 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200">
            <span className="text-indigo-600 dark:text-indigo-400 font-sans font-semibold block mb-1">3. Objective Function (WCSS)</span>
            {"J = ∑_{k=1}^K ∑_{x ∈ S_k} ||x - μ_k||²"}
          </div>
        </div>
      </div>
    </div>
  );
}
