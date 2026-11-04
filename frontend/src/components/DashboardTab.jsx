import React from 'react';
import { 
  Binary, 
  GitMerge, 
  Cpu, 
  Database, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  TrendingUp,
  Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DashboardTab({ metadata, selectedDataset, setActiveTab }) {
  const { isDark } = useTheme();
  const records = metadata?.total_records || (selectedDataset === 'mat' ? 395 : 649);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl border dark:border-indigo-500/20 border-indigo-200 dark:bg-gradient-to-br dark:from-indigo-950/60 dark:via-slate-900/80 dark:to-slate-950 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-8 shadow-sm dark:shadow-2xl transition-colors">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 dark:bg-indigo-500/10 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold dark:bg-indigo-500/10 bg-indigo-100 text-indigo-700 dark:text-indigo-400 border dark:border-indigo-500/30 border-indigo-200 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Unsupervised Machine Learning & Educational Data Mining
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold dark:text-white text-slate-900 tracking-tight leading-tight">
            Discovering Hidden Student Cohorts & Academic Vulnerabilities
          </h1>
          <p className="mt-3 dark:text-slate-300 text-slate-600 text-sm sm:text-base leading-relaxed">
            EduLens operates entirely without predefined labels to cluster real-world secondary school students based on learning discipline, attendance habits, social behaviors, and academic performance.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('kmeans')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              Launch K-Means Lab <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('gmm')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 text-slate-700 border-slate-300 border shadow-sm transition-all cursor-pointer"
            >
              Explore GMM & EM Algorithm <GitMerge className="w-4 h-4 text-cyan-500" />
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 dark:border-slate-700 bg-white hover:bg-slate-50 text-slate-700 border-slate-300 border shadow-sm transition-all cursor-pointer"
            >
              View At-Risk Cohorts <ShieldAlert className="w-4 h-4 text-amber-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-5 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Dataset Records</span>
            <Database className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-2xl font-bold dark:text-white text-slate-900">{records}</p>
          <p className="mt-1 text-xs dark:text-slate-400 text-slate-500">
            {selectedDataset === 'kul-acc' ? 'Accountancy (KU Leuven LMS)' :
             selectedDataset === 'kul-eco' ? 'Economics (KU Leuven LMS)' :
             selectedDataset === 'mat' ? 'Mathematics Course (UCI)' :
             'Portuguese Course (UCI)'}
          </p>
        </div>

        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-5 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Attributes</span>
            <Layers className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="mt-2 text-2xl font-bold dark:text-white text-slate-900">{metadata?.total_features || '—'} Features</p>
          <p className="mt-1 text-xs dark:text-slate-400 text-slate-500">
            {(selectedDataset === 'kul-acc' || selectedDataset === 'kul-eco')
              ? 'LMS clickstream & behavioural telemetry'
              : 'Academic, demographic & social dimensions'}
          </p>
        </div>

        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-5 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Learning Paradigm</span>
            <Cpu className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">Unsupervised</p>
          <p className="mt-1 text-xs dark:text-slate-400 text-slate-500">Centroid-based & Gaussian density models</p>
        </div>

        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-5 hover:border-slate-400 dark:hover:border-slate-700 shadow-sm transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wider">Mathematical Focus</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">Unit III</p>
          <p className="mt-1 text-xs dark:text-slate-400 text-slate-500">K-Means, GMM, EM, Silhouette, BIC/AIC</p>
        </div>
      </div>

      {/* Unit III ML Core Pillars */}
      <div>
        <h2 className="text-lg font-bold dark:text-white text-slate-900 tracking-tight mb-4 flex items-center gap-2">
          <span>Unit III Machine Learning Concepts Explored</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: K-Means */}
          <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-indigo-500/50 shadow-sm transition-all group">
            <div>
              <div className="w-10 h-10 rounded-lg dark:bg-indigo-950 bg-indigo-50 dark:border-indigo-800/60 border-indigo-200 border flex items-center justify-center text-indigo-500 mb-4 group-hover:scale-105 transition-transform">
                <Binary className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold dark:text-white text-slate-900 mb-2">1. K-Means Clustering</h3>
              <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
                Partitions students into <span className="font-mono text-indigo-600 dark:text-indigo-300 font-bold">K</span> disjoint spherical clusters by minimizing Within-Cluster Sum of Squares (WCSS).
              </p>
              <ul className="mt-4 space-y-1.5 text-xs dark:text-slate-400 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Mathematical implementation from scratch
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Euclidean distance & centroid updates
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Interactive Elbow Method curve
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Scikit-learn parity benchmark
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('kmeans')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 cursor-pointer"
            >
              Open K-Means Lab <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: GMM */}
          <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-cyan-500/50 shadow-sm transition-all group">
            <div>
              <div className="w-10 h-10 rounded-lg dark:bg-cyan-950 bg-cyan-50 dark:border-cyan-800/60 border-cyan-200 border flex items-center justify-center text-cyan-500 mb-4 group-hover:scale-105 transition-transform">
                <GitMerge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold dark:text-white text-slate-900 mb-2">2. Gaussian Mixture Models</h3>
              <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
                Represents the student population as a linear mixture of <span className="font-mono text-cyan-600 dark:text-cyan-300 font-bold">K</span> multivariate Gaussian distributions with probabilistic soft memberships.
              </p>
              <ul className="mt-4 space-y-1.5 text-xs dark:text-slate-400 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  Mixture weights, means & covariances
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  Soft posterior assignments vs hard boundaries
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  Student assignment uncertainty & entropy
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  Full vs diagonal covariance structures
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('gmm')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 cursor-pointer"
            >
              Open GMM & EM Lab <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: EM Algorithm */}
          <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:border-amber-500/50 shadow-sm transition-all group">
            <div>
              <div className="w-10 h-10 rounded-lg dark:bg-amber-950 bg-amber-50 dark:border-amber-800/60 border-amber-200 border flex items-center justify-center text-amber-500 mb-4 group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold dark:text-white text-slate-900 mb-2">3. Expectation-Maximization</h3>
              <p className="text-xs dark:text-slate-300 text-slate-600 leading-relaxed">
                Iteratively optimizes the incomplete-data log-likelihood when student cohort labels are latent (unobserved).
              </p>
              <ul className="mt-4 space-y-1.5 text-xs dark:text-slate-400 text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  E-Step: Compute responsibilities γ_ik
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  M-Step: Re-estimate π_k, μ_k, Σ_k
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Log-likelihood monotonic ascent curve
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Evaluation: BIC, AIC & Silhouette scores
                </li>
              </ul>
            </div>
            <button
              onClick={() => setActiveTab('comparison')}
              className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 cursor-pointer"
            >
              Compare Algorithms <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Dataset Authenticity Notice */}
      <div className="p-4 rounded-xl dark:bg-slate-900/40 bg-white border dark:border-slate-800/80 border-slate-200 shadow-sm flex items-start gap-3 transition-colors">
        <Database className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div className="text-xs dark:text-slate-400 text-slate-600 leading-relaxed">
          <span className="font-semibold dark:text-slate-200 text-slate-900">Public Dataset Verification: </span>
          This application loads genuine public datasets: the KU Leuven Learning Analytics dataset (Tiukhova et al., 2023, Nature Scientific Data, Zenodo DOI: 10.5281/zenodo.17087849) capturing real LMS platform activity, and the UCI Student Performance dataset (Cortez & Silva, 2008) from Portuguese secondary schools. No synthetic records are fabricated. All metrics, distances, cluster probabilities, and convergence histories are computed on real student observations.
        </div>
      </div>
    </div>
  );
}
