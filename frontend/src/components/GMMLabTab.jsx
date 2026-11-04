import React, { useState } from 'react';
import { 
  GitMerge, 
  Play, 
  RotateCw, 
  TrendingUp, 
  Eye, 
  Layers, 
  CheckCircle2, 
  Info, 
  Activity,
  UserCheck
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

const GMM_COLORS = [
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#ec4899', // Pink
];

export default function GMMLabTab({
  gmmData,
  loadingGMM,
  onRunGMM,
  gmmK,
  setGmmK,
  covType,
  setCovType,
  selectedDataset
}) {
  const { isDark } = useTheme();
  const isKul = selectedDataset === 'kul-acc' || selectedDataset === 'kul-eco';
  const [selectedStudentId, setSelectedStudentId] = useState(1);
  const [viewMode, setViewMode] = useState('hard'); // 'hard' or 'uncertainty'

  const points = gmmData?.points || [];
  const emHistory = gmmData?.em_history || [];
  const weights = gmmData?.weights || [];
  const pcaComponents = gmmData?.pca_components || [];
  const memberships = gmmData?.student_memberships || [];

  const inspectedStudent = memberships.find((s) => s.student_id === selectedStudentId) || memberships[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Control Bar */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-cyan-500" />
              Gaussian Mixture Models & Expectation-Maximization Lab
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
              Models student cohorts as overlapping multivariate Gaussian distributions with probabilistic soft memberships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Components K */}
            <div className="flex items-center gap-3 dark:bg-slate-950 bg-slate-100 px-3.5 py-2 rounded-xl dark:border-slate-800 border-slate-300 border">
              <span className="text-xs font-semibold dark:text-slate-300 text-slate-700 whitespace-nowrap">
                Mixtures (K = <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">{gmmK}</span>):
              </span>
              <input
                type="range"
                min="2"
                max="6"
                value={gmmK}
                onChange={(e) => setGmmK(Number(e.target.value))}
                className="w-28 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Covariance Structure */}
            <div className="flex items-center gap-2 dark:bg-slate-950 bg-slate-100 px-3.5 py-2 rounded-xl dark:border-slate-800 border-slate-300 border">
              <span className="text-xs font-semibold dark:text-slate-300 text-slate-700">Covariance:</span>
              <select
                value={covType}
                onChange={(e) => setCovType(e.target.value)}
                className="bg-transparent text-xs text-cyan-700 dark:text-cyan-300 font-medium focus:outline-none cursor-pointer"
              >
                <option value="full" className="dark:bg-slate-900 bg-white text-slate-900 dark:text-white">Full (Arbitrary Ellipsoids)</option>
                <option value="diag" className="dark:bg-slate-900 bg-white text-slate-900 dark:text-white">Diagonal (Axis-Aligned)</option>
              </select>
            </div>

            {/* Run Button */}
            <button
              onClick={onRunGMM}
              disabled={loadingGMM}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white shadow-lg shadow-cyan-600/25 transition-all cursor-pointer"
            >
              {loadingGMM ? (
                <>
                  <RotateCw className="w-4 h-4 animate-spin" />
                  Fitting EM...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Fit GMM via EM
                </>
              )}
            </button>
          </div>
        </div>

        {/* GMM Summary KPIs */}
        {gmmData && (
          <div className="mt-6 pt-6 border-t dark:border-slate-800 border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
              <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500">Log-Likelihood (ln L)</span>
              <p className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-300">{gmmData.log_likelihood}</p>
            </div>
            <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
              <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500">BIC (Bayesian Criterion)</span>
              <p className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-300">{gmmData.bic}</p>
            </div>
            <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
              <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500">AIC (Akaike Criterion)</span>
              <p className="text-lg font-bold font-mono text-amber-600 dark:text-amber-300">{gmmData.aic}</p>
            </div>
            <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
              <span className="text-[11px] font-medium dark:text-slate-400 text-slate-500">EM Convergence</span>
              <p className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {gmmData.converged ? `Converged (${gmmData.sklearn_iterations} iters)` : 'Max Iters Reached'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: 2D Soft/Hard Scatter + EM Log-Likelihood Ascent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 2D Scatter Chart (2 cols) */}
        <div className="lg:col-span-2 dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-500" />
                2D Projection: Probabilistic Gaussian Components
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">
                {viewMode === 'hard' 
                  ? 'Showing discrete assignment by highest posterior responsibility' 
                  : 'Colored by assignment uncertainty / boundary ambiguity'}
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex dark:bg-slate-950 bg-slate-100 rounded-lg p-0.5 dark:border-slate-800 border-slate-300 border text-xs">
              <button
                onClick={() => setViewMode('hard')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === 'hard' ? 'bg-cyan-600 text-white shadow-sm' : 'dark:text-slate-400 text-slate-600 hover:dark:text-slate-200 hover:text-slate-900'
                }`}
              >
                Hard Cohorts
              </button>
              <button
                onClick={() => setViewMode('uncertainty')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === 'uncertainty' ? 'bg-cyan-600 text-white shadow-sm' : 'dark:text-slate-400 text-slate-600 hover:dark:text-slate-200 hover:text-slate-900'
                }`}
              >
                Uncertainty Map
              </button>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                <XAxis type="number" dataKey="x" name="PCA 1" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <YAxis type="number" dataKey="y" name="PCA 2" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="dark:bg-slate-950 bg-white p-3 rounded-xl dark:border-slate-800 border-slate-200 border shadow-xl text-xs space-y-1">
                        <div className="font-bold dark:text-white text-slate-900 flex items-center justify-between gap-3">
                          <span>Student #{d.id}</span>
                          <span className="font-mono text-cyan-600 dark:text-cyan-400">
                            Confidence: {Math.round(d.confidence * 100)}%
                          </span>
                        </div>
                        <div className="dark:text-slate-300 text-slate-600 pt-1 border-t dark:border-slate-800 border-slate-200 space-y-0.5">
                          <p>Hard Assignment: <span className="font-bold">Component {d.cluster + 1}</span></p>
                          <p>Uncertainty (Entropy): <span className="font-mono text-amber-600 dark:text-amber-400">{d.uncertainty}</span></p>
                          {isKul ? (
                            <>
                              <p>Grade Equiv: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{d.grade}/20</span></p>
                              <p>Sessions: <span className="text-cyan-600 dark:text-cyan-400 font-bold">{d.sessions}</span></p>
                              <p>Status: <span className={`font-bold ${d.passed ? 'text-emerald-500' : 'text-rose-500'}`}>{d.score_category}</span></p>
                            </>
                          ) : (
                            <p>Final Grade: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{d.G3}/20</span></p>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
                <Scatter 
                  data={points}
                  onClick={(entry) => setSelectedStudentId(entry.id)}
                  cursor="pointer"
                >
                  {points.map((entry, index) => {
                    let color = GMM_COLORS[entry.cluster % GMM_COLORS.length];
                    let opacity = 0.8;
                    if (viewMode === 'uncertainty') {
                      color = entry.uncertainty > 0.5 ? '#ef4444' : '#06b6d4';
                      opacity = Math.max(0.3, entry.confidence);
                    }
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={color}
                        opacity={opacity}
                        stroke={entry.id === selectedStudentId ? (isDark ? '#ffffff' : '#0f172a') : 'transparent'}
                        strokeWidth={entry.id === selectedStudentId ? 2 : 0}
                      />
                    );
                  })}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] dark:text-slate-400 text-slate-500">
            <span>Tip: Click on any student point above to inspect their exact posterior probabilities below.</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">Selected: Student #{selectedStudentId}</span>
          </div>
        </div>

        {/* EM Log-Likelihood Monotonic Ascent Curve */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" />
              EM Log-Likelihood Ascent
            </h3>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
              Demonstrates guaranteed monotonic convergence: ln L(t+1) ≥ ln L(t).
            </p>

            <div className="h-56 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emHistory} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
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
                    dataKey="log_likelihood" 
                    name="Log-Likelihood" 
                    stroke="#06b6d4" 
                    strokeWidth={2}
                    dot={{ fill: '#06b6d4', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-3 dark:bg-slate-950/60 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200 text-[11px] dark:text-slate-400 text-slate-600 mt-4">
            <span className="font-semibold dark:text-slate-200 text-slate-900">Jensen's Inequality: </span>
            Because the expectation step optimizes a lower bound on the incomplete-data log likelihood, every step of the EM algorithm is mathematically proven never to decrease ln p(X | Θ).
          </div>
        </div>

      </div>

      {/* Probabilistic Responsibility Inspector & Mixture Weights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Inspected Student Responsibility Card */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-cyan-500" />
                Soft Membership Breakdown: Student #{inspectedStudent?.student_id || 1}
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">Posterior responsibilities γ_ik = P(Z_i = k | x_i)</p>
            </div>
          </div>

          {inspectedStudent ? (
            <div className="space-y-4">
              <div className="space-y-2">
                {inspectedStudent.soft_probs.map((prob, k) => {
                  const pct = Math.round(prob * 100);
                  const isMax = k === inspectedStudent.hard_label;
                  return (
                    <div key={k} className="p-3 rounded-xl dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-200">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-medium dark:text-slate-300 text-slate-700 flex items-center gap-2">
                          <span 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: GMM_COLORS[k % GMM_COLORS.length] }} 
                          />
                          Gaussian Component {k + 1}
                          {isMax && <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">(Hard Assigned)</span>}
                        </span>
                        <span className="font-mono font-bold dark:text-white text-slate-900">{pct}% ({prob})</span>
                      </div>
                      <div className="w-full dark:bg-slate-900 bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500" 
                          style={{ 
                            width: `${pct}%`, 
                            backgroundColor: GMM_COLORS[k % GMM_COLORS.length] 
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl dark:bg-slate-950/40 bg-slate-50 border dark:border-slate-800 border-slate-200 text-xs dark:text-slate-400 text-slate-600 space-y-1">
                <p>Assignment Entropy: <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">{inspectedStudent.uncertainty}</span></p>
                <p>Confidence Margin: <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">{Math.round((1 - inspectedStudent.margin) * 100)}%</span></p>
              </div>
            </div>
          ) : (
            <p className="text-xs dark:text-slate-400 text-slate-500">Loading student membership breakdown...</p>
          )}
        </div>

        {/* Mixture Parameters & Weights (2 cols) */}
        <div className="lg:col-span-2 dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
          <h3 className="text-sm font-bold dark:text-white text-slate-900 mb-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-500" />
            Estimated Gaussian Mixture Parameters (π_k, μ_k, Σ_k)
          </h3>
          <p className="text-xs dark:text-slate-400 text-slate-500 mb-4">
            Component prior weights (π_k) and 2D spatial centroids after EM convergence.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pcaComponents.map((comp) => {
              const color = GMM_COLORS[comp.component % GMM_COLORS.length];
              return (
                <div key={comp.component} className="p-4 rounded-xl dark:bg-slate-950/80 bg-slate-50 border dark:border-slate-800 border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold dark:text-white text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                      Component {comp.component + 1}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      π_{comp.component + 1} = {comp.weight}
                    </span>
                  </div>

                  <div className="text-xs dark:text-slate-400 text-slate-600 space-y-1 font-mono">
                    <p>Mean μ (PCA): [{comp.pca_x}, {comp.pca_y}]</p>
                    <p>Covariance Spread: {comp.ellipse.width} x {comp.ellipse.height}</p>
                    <p>Principal Orientation: {comp.ellipse.angle}&deg;</p>
                    <p className="font-sans dark:text-slate-300 text-slate-700 font-medium">Students Assigned: {comp.size}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl dark:bg-slate-950/40 bg-slate-50 border dark:border-slate-800/80 border-slate-200 text-xs dark:text-slate-300 text-slate-700 space-y-2">
            <h4 className="font-semibold dark:text-white text-slate-900">Why Soft Clustering Matters for Education:</h4>
            <p className="dark:text-slate-400 text-slate-600 leading-relaxed">
              Unlike K-Means which forces every student into a single bucket, GMM acknowledges that real students often exhibit hybrid behaviors (e.g. 60% high academic achievement, but 40% high absenteeism). This prevents misclassifying borderline students who need nuanced academic guidance.
            </p>
          </div>
        </div>

      </div>

      {/* Expectation-Maximization Mathematical Equations */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-sm font-bold dark:text-white text-slate-900 mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-500" />
          Expectation-Maximization Mathematical Equations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono dark:text-slate-300 text-slate-700">
          <div className="p-3 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200">
            <span className="text-cyan-600 dark:text-cyan-400 font-sans font-semibold block mb-1">1. E-Step: Responsibility</span>
            {"γ_ik = (π_k · N(x_i | μ_k, Σ_k)) / ∑_j π_j · N(x_i | μ_j, Σ_j)"}
          </div>
          <div className="p-3 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200">
            <span className="text-cyan-600 dark:text-cyan-400 font-sans font-semibold block mb-1">2. M-Step: Parameter Updates</span>
            {"μ_k = (∑_i γ_ik x_i) / (∑_i γ_ik),  π_k = N_k / N"}
          </div>
          <div className="p-3 dark:bg-slate-950 bg-slate-50 rounded-xl border dark:border-slate-800 border-slate-200">
            <span className="text-cyan-600 dark:text-cyan-400 font-sans font-semibold block mb-1">3. Incomplete Log-Likelihood</span>
            {"ln p(X | Θ) = ∑_i ln ( ∑_k π_k · N(x_i | μ_k, Σ_k) )"}
          </div>
        </div>
      </div>
    </div>
  );
}
