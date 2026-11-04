import React from 'react';
import { 
  LayoutDashboard, 
  Database, 
  Binary, 
  GitMerge, 
  Scale, 
  Lightbulb, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle,
  Sun,
  Moon,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ activeTab, setActiveTab, selectedDataset, setSelectedDataset, isOnline }) {
  const { isDark, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explorer', label: 'Dataset Explorer', icon: Database },
    { id: 'kmeans', label: 'K-Means Lab', icon: Binary },
    { id: 'gmm', label: 'GMM & EM Lab', icon: GitMerge },
    { id: 'comparison', label: 'Model Comparison', icon: Scale },
    { id: 'insights', label: 'Cohort Insights', icon: Lightbulb },
    { id: 'theory', label: 'Math & Theory', icon: BookOpen },
  ];

  const datasets = [
    { id: 'kul-acc', label: 'KU Leuven: Accountancy (N=756)', badge: 'Platform Telemetry' },
    { id: 'kul-eco', label: 'KU Leuven: Economics (N=743)', badge: 'Platform Telemetry' },
    { id: 'mat', label: 'UCI: Math Course (N=395)', badge: 'Survey Data' },
    { id: 'por', label: 'UCI: Portuguese Course (N=649)', badge: 'Survey Data' },
  ];

  return (
    <header className="sticky top-0 z-50 dark:bg-slate-900/90 bg-white/90 backdrop-blur-md dark:border-slate-800 border-slate-200 border-b transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="text-xl font-black text-white tracking-wider">EL</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight dark:text-white text-slate-900">EduLens</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium dark:bg-indigo-950 bg-indigo-50 dark:text-indigo-300 text-indigo-700 dark:border-indigo-800/60 border-indigo-200 border">
                  Unit III ML
                </span>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-500 hidden md:block">
                Student Behavioural Cohort Discovery & Risk Profiling
              </p>
            </div>
          </div>

          {/* Right Controls: Dataset Switcher Dropdown + Dark/Light Toggle + Health */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Dark / Light Mode Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg dark:bg-slate-950 bg-slate-100 hover:dark:bg-slate-800 hover:bg-slate-200 dark:border-slate-800 border-slate-300 border text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline text-xs font-medium">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-indigo-600" />
                  <span className="hidden sm:inline text-xs font-medium">Dark</span>
                </>
              )}
            </button>

            {/* Dataset Selector Dropdown */}
            <div className="relative">
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="appearance-none dark:bg-slate-950 bg-slate-100 dark:border-slate-800 border-slate-300 border text-xs font-semibold dark:text-slate-200 text-slate-800 pl-3 pr-8 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer transition-all"
                title="Select benchmark student dataset"
              >
                <optgroup label="KU Leuven (LMS Telemetry)">
                  <option value="kul-acc" className="dark:bg-slate-900 bg-white">KU Leuven: Accountancy (N=756)</option>
                  <option value="kul-eco" className="dark:bg-slate-900 bg-white">KU Leuven: Economics (N=743)</option>
                </optgroup>
                <optgroup label="UCI Benchmark (Survey / Demographics)">
                  <option value="mat" className="dark:bg-slate-900 bg-white">UCI: Mathematics (N=395)</option>
                  <option value="por" className="dark:bg-slate-900 bg-white">UCI: Portuguese (N=649)</option>
                </optgroup>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Health status badge */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-lg dark:bg-slate-950 bg-slate-100 dark:border-slate-800 border-slate-300 border text-xs">
              {isOnline ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Backend Live</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-rose-600 dark:text-rose-400 font-medium">Connecting...</span>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 overflow-x-auto pb-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'dark:bg-indigo-600/20 bg-indigo-50 dark:text-indigo-300 text-indigo-700 dark:border-indigo-500/30 border-indigo-200 border shadow-sm'
                    : 'dark:text-slate-400 text-slate-600 hover:dark:text-slate-200 hover:text-slate-900 hover:dark:bg-slate-800/50 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'dark:text-indigo-400 text-indigo-600' : 'dark:text-slate-400 text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
