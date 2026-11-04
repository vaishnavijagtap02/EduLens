import React, { useState } from 'react';
import { 
  Lightbulb, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Clock, 
  HeartHandshake,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function InsightsTab({
  insightsData,
  loadingInsights,
  onRefreshInsights,
  algorithmChoice,
  setAlgorithmChoice
}) {
  const { isDark } = useTheme();
  const cohorts = insightsData?.cohorts || [];
  const baselines = insightsData?.global_baselines || {};

  const chartData = cohorts.map((c) => ({
    name: c.cluster_name,
    g3: c.metrics.avg_g3,
    studytime: c.metrics.avg_studytime * 4,
    failures: c.metrics.avg_failures * 5,
    absences: c.metrics.avg_absences,
    alcohol: c.metrics.avg_alcohol * 2,
    risk: c.risk_score
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Algorithm Switcher */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 transition-colors">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              Student Behavioural Cohort Discovery & Risk Profiling
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
              Unsupervised identification of academic difficulty patterns without predefined student labels.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs dark:text-slate-400 text-slate-500 font-medium">Source Algorithm:</span>
            <div className="flex dark:bg-slate-950 bg-slate-100 rounded-lg p-0.5 dark:border-slate-800 border-slate-300 border text-xs">
              <button
                onClick={() => setAlgorithmChoice('kmeans')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  algorithmChoice === 'kmeans' ? 'bg-indigo-600 text-white shadow-sm' : 'dark:text-slate-400 text-slate-600 hover:dark:text-slate-200 hover:text-slate-900'
                }`}
              >
                K-Means Cohorts
              </button>
              <button
                onClick={() => setAlgorithmChoice('gmm')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  algorithmChoice === 'gmm' ? 'bg-indigo-600 text-white shadow-sm' : 'dark:text-slate-400 text-slate-600 hover:dark:text-slate-200 hover:text-slate-900'
                }`}
              >
                GMM Cohorts
              </button>
            </div>

            <button
              onClick={onRefreshInsights}
              disabled={loadingInsights}
              className="p-2 rounded-lg dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 dark:border-slate-700 border-slate-300 border transition-all cursor-pointer"
              title="Refresh Insights"
            >
              <RefreshCw className={`w-4 h-4 ${loadingInsights ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Global Dataset Baselines */}
        <div className="mt-6 pt-6 border-t dark:border-slate-800 border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
            <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase font-semibold">Population Mean G3</span>
            <p className="text-base font-bold text-indigo-600 dark:text-indigo-400 font-mono">{baselines.avg_g3 || '—'} / 20</p>
          </div>
          <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
            <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase font-semibold">Population Failures</span>
            <p className="text-base font-bold text-rose-600 dark:text-rose-400 font-mono">{baselines.avg_failures || '—'}</p>
          </div>
          <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
            <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase font-semibold">Mean Weekly Study</span>
            <p className="text-base font-bold text-cyan-600 dark:text-cyan-400 font-mono">{baselines.avg_studytime || '—'}</p>
          </div>
          <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
            <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase font-semibold">Mean Absences</span>
            <p className="text-base font-bold text-amber-600 dark:text-amber-400 font-mono">{baselines.avg_absences || '—'}</p>
          </div>
          <div className="p-3 rounded-xl dark:bg-slate-950/60 bg-slate-50 border dark:border-slate-800 border-slate-200">
            <span className="text-[10px] dark:text-slate-400 text-slate-500 uppercase font-semibold">Alcohol Scale (D+W)</span>
            <p className="text-base font-bold text-purple-600 dark:text-purple-400 font-mono">{baselines.avg_alcohol || '—'} / 10</p>
          </div>
        </div>
      </div>

      {/* Cohort Comparative Bar Chart */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
        <h3 className="text-sm font-bold dark:text-white text-slate-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          Multidimensional Comparison Across Discovered Cohorts
        </h3>
        <p className="text-xs dark:text-slate-400 text-slate-500 mb-6">
          Comparing Final Grade, Study Effort, Failures, and Absences between student clusters.
        </p>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
              <XAxis dataKey="name" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
              <YAxis stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
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
              <Bar dataKey="g3" name="Final Grade (G3 / 20)" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="absences" name="Average Absences" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failures" name="Class Failures (x5)" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="risk" name="Vulnerability Score (%)" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Discovered Student Cohort Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-500" />
            Discovered Student Behavioral Cohorts ({cohorts.length} Profiles Identified)
          </h3>
          <span className="text-xs dark:text-slate-400 text-slate-500">Ranked by Academic Risk Index</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohorts.map((cohort) => {
            const isHighRisk = cohort.risk_level === 'High Risk';
            const isModRisk = cohort.risk_level === 'Moderate Risk';
            return (
              <div 
                key={cohort.cluster_id}
                className={`dark:bg-slate-900/80 bg-white rounded-2xl p-6 border flex flex-col justify-between transition-all shadow-sm ${
                  isHighRisk 
                    ? 'border-rose-500/50 dark:border-rose-500/40 shadow-rose-500/10' 
                    : isModRisk 
                      ? 'border-amber-500/50 dark:border-amber-500/40 shadow-amber-500/10' 
                      : 'border-emerald-500/40 dark:border-emerald-500/30'
                }`}
              >
                <div>
                  {/* Top Badge & Header */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold dark:text-slate-400 text-slate-500">
                      {cohort.cluster_name} ({cohort.size} students, {cohort.percentage}%)
                    </span>
                    <span 
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold border"
                      style={{ 
                        backgroundColor: `${cohort.color}15`, 
                        borderColor: `${cohort.color}40`, 
                        color: cohort.color 
                      }}
                    >
                      {cohort.risk_level}
                    </span>
                  </div>

                  <h4 className="text-base font-bold dark:text-white text-slate-900 mb-2 leading-snug">
                    {cohort.archetype}
                  </h4>

                  {/* Risk Score Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="dark:text-slate-400 text-slate-500">Academic Vulnerability Index</span>
                      <span className="font-mono font-bold dark:text-white text-slate-900">{cohort.risk_score} / 100</span>
                    </div>
                    <div className="w-full dark:bg-slate-950 bg-slate-100 h-2 rounded-full overflow-hidden border dark:border-slate-800 border-slate-200">
                      <div 
                        className="h-full rounded-full transition-all duration-700"
                        style={{ 
                          width: `${cohort.risk_score}%`, 
                          backgroundColor: cohort.color 
                        }}
                      />
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y dark:border-slate-800 border-slate-200">
                    <div>
                      <span className="dark:text-slate-400 text-slate-500 block">Avg Final Grade (G3)</span>
                      <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">{cohort.metrics.avg_g3} / 20</span>
                    </div>
                    <div>
                      <span className="dark:text-slate-400 text-slate-500 block">Past Failures</span>
                      <span className="font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">{cohort.metrics.avg_failures}</span>
                    </div>
                    <div>
                      <span className="dark:text-slate-400 text-slate-500 block">Weekly Study Time</span>
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400 text-sm">{cohort.metrics.avg_studytime}</span>
                    </div>
                    <div>
                      <span className="dark:text-slate-400 text-slate-500 block">Avg Absences</span>
                      <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">{cohort.metrics.avg_absences} days</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[11px] font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider block">
                      Targeted Action Recommendations:
                    </span>
                    <ul className="space-y-1.5 text-xs dark:text-slate-400 text-slate-600">
                      {cohort.recommendations.map((rec, rIdx) => (
                        <li key={rIdx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t dark:border-slate-800 border-slate-200 text-[11px] dark:text-slate-400 text-slate-500 flex items-center justify-between">
                  <span>Higher Ed Aspiration:</span>
                  <span className="font-mono font-bold dark:text-slate-200 text-slate-800">{cohort.metrics.higher_asp_pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unsupervised Methodology Explainer */}
      <div className="p-6 rounded-2xl dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-500" />
          How EduLens Identifies Academic Risk Without Predefined Labels
        </h3>
        <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
          Standard supervised learning requires historical "pass/fail" or "at-risk" training labels which are often unavailable, delayed, or biased. In EduLens, the clustering algorithm partitions the high-dimensional feature space purely by geometrical proximity (K-Means) and statistical density (GMM). Once natural clusters form, we calculate an unsupervised <span className="font-semibold dark:text-white text-slate-900">Academic Vulnerability Index</span> by standardizing each cluster centroid relative to population baselines across key predictive axes: past course failures (+2.5×), absences (+1.5×), alcohol consumption (+1.2×), weekly study effort (-1.5×), and final grade achievement (-2.0×).
        </p>
      </div>
    </div>
  );
}
