import React, { useState } from 'react';
import { 
  Database, 
  Sliders, 
  CheckSquare, 
  Square, 
  RotateCcw, 
  BarChart2, 
  Table, 
  HelpCircle,
  TrendingUp,
  Activity,
  Layers
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export default function DatasetExplorerTab({
  metadata,
  selectedFeatures,
  setSelectedFeatures,
  scalingMode,
  setScalingMode,
  selectedDataset,
  setSelectedDataset
}) {
  const { isDark } = useTheme();
  const isKul = metadata?.is_learning_platform || selectedDataset.startsWith('kul');
  const [activeDistCol, setActiveDistCol] = useState(isKul ? 'total_clicks' : 'G3');

  // KU Leuven Feature Taxonomy
  const kulFeatureGroups = {
    'LMS Platform Activity Volume': [
      { id: 'total_clicks', name: 'total_clicks (Overall Interactions)' },
      { id: 'total_sessions', name: 'total_sessions (Login Blocks)' },
      { id: 'active_days', name: 'active_days (Distinct Active Days)' },
      { id: 'active_weeks', name: 'active_weeks (Weeks with Activity)' },
      { id: 'materials_viewed', name: 'materials_viewed (Unique Documents)' },
      { id: 'actions_per_session', name: 'actions_per_session (Engagement Depth)' },
    ],
    'Self-Regulated Learning & Pacing': [
      { id: 'study_regularity', name: 'study_regularity (Weekly Entropy)' },
      { id: 'cramming_ratio', name: 'cramming_ratio (Exam Week Surge)' },
      { id: 'procrastination_latency', name: 'procrastination_latency (Days to 1st Login)' },
    ],
    'Forum & Digital Interaction': [
      { id: 'total_posts_read', name: 'total_posts_read (Discussions Read)' },
      { id: 'threads_read_count', name: 'threads_read_count (Unique Topics)' },
      { id: 'forum_posts_written', name: 'forum_posts_written (Active Posts)' },
      { id: 'grade_equivalent', name: 'grade_equivalent (Exam Score 0-20)' },
    ],
  };

  // UCI Benchmark Feature Taxonomy
  const uciFeatureGroups = {
    'Academic Performance & Effort': [
      { id: 'G3', name: 'G3 (Final Grade, 0-20)' },
      { id: 'G1', name: 'G1 (First Period Grade)' },
      { id: 'G2', name: 'G2 (Second Period Grade)' },
      { id: 'failures', name: 'failures (Past Class Failures)' },
      { id: 'studytime', name: 'studytime (Weekly Study Hours)' },
      { id: 'absences', name: 'absences (Total Absences)' },
    ],
    'Behavioral & Lifestyle': [
      { id: 'Dalc', name: 'Dalc (Workday Alcohol, 1-5)' },
      { id: 'Walc', name: 'Walc (Weekend Alcohol, 1-5)' },
      { id: 'freetime', name: 'freetime (Free Time After School)' },
      { id: 'goout', name: 'goout (Going Out with Friends)' },
      { id: 'health', name: 'health (Current Health Status)' },
      { id: 'traveltime', name: 'traveltime (Home to School Travel)' },
    ],
    'Family & Demographics': [
      { id: 'famrel', name: 'famrel (Family Relationship Quality)' },
      { id: 'Medu', name: 'Medu (Mother Education Level)' },
      { id: 'Fedu', name: 'Fedu (Father Education Level)' },
      { id: 'age', name: 'age (Student Age, 15-22)' },
      { id: 'higher', name: 'higher (Aims for Higher Education)' },
      { id: 'schoolsup', name: 'schoolsup (Extra Educational Support)' },
    ],
  };

  const featureGroups = isKul ? kulFeatureGroups : uciFeatureGroups;

  const toggleFeature = (id) => {
    if (selectedFeatures.includes(id)) {
      if (selectedFeatures.length > 2) {
        setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
      }
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const setPreset = (preset) => {
    if (isKul) {
      if (preset === 'behavioral') {
        setSelectedFeatures(['total_clicks', 'total_sessions', 'active_days', 'active_weeks', 'materials_viewed', 'actions_per_session', 'study_regularity', 'cramming_ratio', 'procrastination_latency', 'total_posts_read', 'grade_equivalent']);
      } else if (preset === 'activity') {
        setSelectedFeatures(['total_clicks', 'total_sessions', 'active_days', 'materials_viewed', 'actions_per_session']);
      } else if (preset === 'pacing') {
        setSelectedFeatures(['study_regularity', 'cramming_ratio', 'procrastination_latency', 'active_weeks']);
      } else if (preset === 'all') {
        const all = Object.values(kulFeatureGroups).flatMap((g) => g.map((f) => f.id));
        setSelectedFeatures(all);
      }
    } else {
      if (preset === 'behavioral') {
        setSelectedFeatures(['studytime', 'failures', 'absences', 'freetime', 'goout', 'Dalc', 'Walc', 'health', 'G1', 'G2', 'G3']);
      } else if (preset === 'academic') {
        setSelectedFeatures(['studytime', 'failures', 'absences', 'G1', 'G2', 'G3']);
      } else if (preset === 'social') {
        setSelectedFeatures(['freetime', 'goout', 'Dalc', 'Walc', 'famrel', 'health', 'absences']);
      } else if (preset === 'all') {
        const all = Object.values(uciFeatureGroups).flatMap((g) => g.map((f) => f.id));
        setSelectedFeatures(all);
      }
    }
  };

  const previewData = metadata?.preview || [];
  const numSummary = metadata?.numeric_summary || {};

  // Build chart data based on active distribution column
  let distChartData = [];
  if (numSummary[activeDistCol]) {
    const minVal = Math.floor(numSummary[activeDistCol].min);
    const maxVal = Math.ceil(numSummary[activeDistCol].max);
    const step = Math.max(1, Math.round((maxVal - minVal) / 8));
    
    const bins = {};
    previewData.forEach((row) => {
      const val = row[activeDistCol];
      if (val !== undefined) {
        const binKey = Math.floor(val / step) * step;
        bins[binKey] = (bins[binKey] || 0) + 1;
      }
    });

    distChartData = Object.keys(bins).sort((a,b) => Number(a)-Number(b)).map(k => ({
      range: `${k}-${Number(k)+step}`,
      count: bins[k]
    }));
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Controls: Dataset switcher & Preset Quick Actions */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b dark:border-slate-800 border-slate-200">
          <div>
            <h2 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-500" />
              {metadata?.name || 'Dataset Configuration & Preprocessing'}
            </h2>
            <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">
              Source: <span className="font-semibold dark:text-slate-300 text-slate-700">{metadata?.source}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs dark:text-slate-400 text-slate-500 font-medium">Feature Presets:</span>
            {isKul ? (
              <>
                <button
                  onClick={() => setPreset('behavioral')}
                  className="px-2.5 py-1 text-xs rounded-lg font-medium dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border dark:border-indigo-500/20 border-indigo-200 cursor-pointer transition-all"
                >
                  Full Telemetry
                </button>
                <button
                  onClick={() => setPreset('activity')}
                  className="px-2.5 py-1 text-xs rounded-lg font-medium dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 border dark:border-slate-700 border-slate-300 cursor-pointer transition-all"
                >
                  Activity Volume
                </button>
                <button
                  onClick={() => setPreset('pacing')}
                  className="px-2.5 py-1 text-xs rounded-lg font-medium dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 border dark:border-slate-700 border-slate-300 cursor-pointer transition-all"
                >
                  Pacing & Regularity
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setPreset('behavioral')}
                  className="px-2.5 py-1 text-xs rounded-lg font-medium dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border dark:border-indigo-500/20 border-indigo-200 cursor-pointer transition-all"
                >
                  Default Behavioral
                </button>
                <button
                  onClick={() => setPreset('academic')}
                  className="px-2.5 py-1 text-xs rounded-lg font-medium dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 border dark:border-slate-700 border-slate-300 cursor-pointer transition-all"
                >
                  Academic Only
                </button>
              </>
            )}
            <button
              onClick={() => setPreset('all')}
              className="px-2.5 py-1 text-xs rounded-lg font-medium dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-700 border dark:border-slate-700 border-slate-300 cursor-pointer transition-all"
            >
              Select All
            </button>
          </div>
        </div>

        {/* Feature Checkboxes by Group */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          {Object.entries(featureGroups).map(([groupTitle, features]) => (
            <div key={groupTitle} className="dark:bg-slate-950/60 bg-slate-50 rounded-xl p-4 border dark:border-slate-800/80 border-slate-200">
              <h3 className="text-xs font-semibold dark:text-slate-300 text-slate-700 uppercase tracking-wider mb-3">
                {groupTitle}
              </h3>
              <div className="space-y-2">
                {features.map((feat) => {
                  const isChecked = selectedFeatures.includes(feat.id);
                  return (
                    <button
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                        isChecked
                          ? 'dark:bg-indigo-950/80 bg-indigo-50 dark:text-indigo-200 text-indigo-800 dark:border-indigo-500/30 border-indigo-200 border'
                          : 'dark:bg-slate-900/40 bg-white dark:text-slate-400 text-slate-600 hover:dark:text-slate-200 hover:text-slate-900 border dark:border-transparent border-slate-200'
                      }`}
                    >
                      <span>{feat.name}</span>
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-indigo-500 shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 dark:text-slate-600 text-slate-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Scaling Mode & Active Feature Summary */}
        <div className="mt-6 pt-6 border-t dark:border-slate-800 border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold dark:text-slate-300 text-slate-700">Feature Scaling:</span>
            <div className="flex dark:bg-slate-950 bg-slate-100 rounded-lg p-0.5 border dark:border-slate-800 border-slate-300 text-xs">
              <button
                onClick={() => setScalingMode('standard')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  scalingMode === 'standard' ? 'bg-indigo-600 text-white shadow-sm' : 'dark:text-slate-400 text-slate-600 hover:dark:text-slate-200 hover:text-slate-900'
                }`}
              >
                StandardScaler (Z-Score)
              </button>
              <button
                onClick={() => setScalingMode('minmax')}
                className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer ${
                  scalingMode === 'minmax' ? 'bg-indigo-600 text-white shadow-sm' : 'dark:text-slate-400 text-slate-600 hover:dark:text-slate-200 hover:text-slate-900'
                }`}
              >
                MinMaxScaler ([0, 1])
              </button>
            </div>
          </div>

          <div className="text-xs dark:text-slate-400 text-slate-600">
            Active Features for Clustering: <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedFeatures.length}</span>
          </div>
        </div>
      </div>

      {/* Feature Distributions & Statistical Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Statistical KPI Column */}
        <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Dataset Global Averages
          </h3>
          <p className="text-xs dark:text-slate-400 text-slate-500">
            Baseline telemetry computed directly across all {metadata?.total_records} students.
          </p>

          <div className="space-y-3 pt-2">
            {(isKul ? [
              { label: 'Total LMS Clicks', col: 'total_clicks', unit: 'actions', color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Login Sessions', col: 'total_sessions', unit: 'sessions', color: 'text-cyan-600 dark:text-cyan-400' },
              { label: 'Study Regularity', col: 'study_regularity', unit: 'entropy 0-1', color: 'text-emerald-600 dark:text-emerald-400' },
              { label: 'Cramming Ratio', col: 'cramming_ratio', unit: 'exam surge %', color: 'text-amber-600 dark:text-amber-400' },
              { label: 'First Login Latency', col: 'procrastination_latency', unit: 'days', color: 'text-rose-600 dark:text-rose-400' },
            ] : [
              { label: 'Final Grade (G3)', col: 'G3', unit: '/ 20', color: 'text-indigo-600 dark:text-indigo-400' },
              { label: 'Past Failures', col: 'failures', unit: 'classes', color: 'text-rose-600 dark:text-rose-400' },
              { label: 'Weekly Study Time', col: 'studytime', unit: 'scale 1-4', color: 'text-cyan-600 dark:text-cyan-400' },
              { label: 'Absences', col: 'absences', unit: 'days', color: 'text-amber-600 dark:text-amber-400' },
              { label: 'Weekend Alcohol', col: 'Walc', unit: 'scale 1-5', color: 'text-purple-600 dark:text-purple-400' },
            ]).map((item) => {
              const stat = numSummary[item.col];
              return (
                <div 
                  key={item.col}
                  onClick={() => setActiveDistCol(item.col)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    activeDistCol === item.col
                      ? 'dark:bg-slate-800/80 bg-indigo-50/80 dark:border-indigo-500/50 border-indigo-300'
                      : 'dark:bg-slate-950/40 bg-slate-50 dark:border-slate-800/60 border-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="dark:text-slate-300 text-slate-700 font-medium">{item.label}</span>
                    <span className={`font-mono font-bold ${item.color}`}>
                      {stat ? stat.mean : '—'} <span className="text-[10px] text-slate-500 font-normal">{item.unit}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] dark:text-slate-400 text-slate-500 mt-1">
                    <span>Min: {stat ? stat.min : 0} | Max: {stat ? stat.max : 0}</span>
                    <span>Std: {stat ? stat.std : 0}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Distribution Histogram */}
        <div className="lg:col-span-2 dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-indigo-500" />
                Distribution of Column: <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{activeDistCol}</span>
              </h3>
              <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5">Click any metric on the left to inspect its frequency</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
                <XAxis dataKey="range" stroke={isDark ? '#64748b' : '#94a3b8'} fontSize={11} tickLine={false} />
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
                <Bar dataKey="count" name="Student Count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Real Dataset Preview Table */}
      <div className="dark:bg-slate-900/60 bg-white border dark:border-slate-800 border-slate-200 shadow-sm rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold dark:text-white text-slate-900 flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-500" />
              Raw {isKul ? 'KU Leuven LMS Telemetry' : 'UCI Student Records'} Preview (First 10 Observations)
            </h3>
            <p className="text-xs dark:text-slate-400 text-slate-500">
              {isKul ? 'Genuine LMS interaction telemetry and course performance records' : 'Authentic secondary education survey records'}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border dark:border-slate-800 border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs dark:text-slate-300 text-slate-700">
            <thead className="dark:bg-slate-950 bg-slate-100 dark:text-slate-400 text-slate-700 uppercase font-semibold border-b dark:border-slate-800 border-slate-200">
              {isKul ? (
                <tr>
                  <th className="px-3 py-2.5">User ID</th>
                  <th className="px-3 py-2.5">Course</th>
                  <th className="px-3 py-2.5">Score Category</th>
                  <th className="px-3 py-2.5 font-bold text-emerald-600 dark:text-emerald-400">Passed</th>
                  <th className="px-3 py-2.5">Grade (0-20)</th>
                  <th className="px-3 py-2.5 font-mono text-indigo-600 dark:text-indigo-400">Total Clicks</th>
                  <th className="px-3 py-2.5">Sessions</th>
                  <th className="px-3 py-2.5">Active Days</th>
                  <th className="px-3 py-2.5">Materials</th>
                  <th className="px-3 py-2.5">Regularity</th>
                  <th className="px-3 py-2.5 text-amber-600 dark:text-amber-400">Cramming %</th>
                  <th className="px-3 py-2.5 text-rose-600 dark:text-rose-400">Latency (Days)</th>
                </tr>
              ) : (
                <tr>
                  <th className="px-3 py-2.5">#</th>
                  <th className="px-3 py-2.5">School</th>
                  <th className="px-3 py-2.5">Sex</th>
                  <th className="px-3 py-2.5">Age</th>
                  <th className="px-3 py-2.5">StudyTime</th>
                  <th className="px-3 py-2.5">Failures</th>
                  <th className="px-3 py-2.5">Absences</th>
                  <th className="px-3 py-2.5">Dalc</th>
                  <th className="px-3 py-2.5">Walc</th>
                  <th className="px-3 py-2.5">G1</th>
                  <th className="px-3 py-2.5">G2</th>
                  <th className="px-3 py-2.5 font-bold text-indigo-600 dark:text-indigo-400">G3 (Final)</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y dark:divide-slate-800/60 divide-slate-200">
              {previewData.map((row, idx) => (
                <tr key={idx} className="dark:hover:bg-slate-800/40 hover:bg-slate-50 transition-colors">
                  {isKul ? (
                    <>
                      <td className="px-3 py-2 text-slate-500 font-mono">{row.user_id}</td>
                      <td className="px-3 py-2 font-medium">{row.course}</td>
                      <td className="px-3 py-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {row.score_category}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {row.passed === 1 ? 'Yes' : 'No'}
                      </td>
                      <td className="px-3 py-2 font-mono font-bold">{row.grade_equivalent}</td>
                      <td className="px-3 py-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.total_clicks}</td>
                      <td className="px-3 py-2 font-mono">{row.total_sessions}</td>
                      <td className="px-3 py-2 font-mono">{row.active_days}</td>
                      <td className="px-3 py-2 font-mono">{row.materials_viewed}</td>
                      <td className="px-3 py-2 font-mono">{row.study_regularity}</td>
                      <td className="px-3 py-2 font-mono text-amber-600 dark:text-amber-400">{row.cramming_ratio}</td>
                      <td className="px-3 py-2 font-mono text-rose-600 dark:text-rose-400">{row.procrastination_latency}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-2 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="px-3 py-2">{row.school}</td>
                      <td className="px-3 py-2">{row.sex}</td>
                      <td className="px-3 py-2">{row.age}</td>
                      <td className="px-3 py-2 font-mono">{row.studytime}</td>
                      <td className="px-3 py-2 font-mono text-rose-600 dark:text-rose-400">{row.failures}</td>
                      <td className="px-3 py-2 font-mono">{row.absences}</td>
                      <td className="px-3 py-2 font-mono">{row.Dalc}</td>
                      <td className="px-3 py-2 font-mono">{row.Walc}</td>
                      <td className="px-3 py-2 font-mono">{row.G1}</td>
                      <td className="px-3 py-2 font-mono">{row.G2}</td>
                      <td className="px-3 py-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.G3}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
