import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import DashboardTab from './components/DashboardTab';
import DatasetExplorerTab from './components/DatasetExplorerTab';
import KMeansLabTab from './components/KMeansLabTab';
import GMMLabTab from './components/GMMLabTab';
import ModelComparisonTab from './components/ModelComparisonTab';
import InsightsTab from './components/InsightsTab';
import MathTheoryTab from './components/MathTheoryTab';

import {
  fetchHealth,
  fetchDatasetMetadata,
  runKMeans,
  fetchElbow,
  runGMM,
  fetchBicAic,
  compareModels,
  fetchInsights
} from './services/api';

const UCI_FEATURES = [
  'studytime', 'failures', 'absences', 'freetime', 'goout', 
  'Dalc', 'Walc', 'health', 'G1', 'G2', 'G3'
];

const KUL_FEATURES = [
  'total_clicks', 'total_sessions', 'active_days', 'active_weeks', 
  'materials_viewed', 'actions_per_session', 'study_regularity', 
  'cramming_ratio', 'procrastination_latency', 'total_posts_read', 
  'grade_equivalent'
];

function getDefaultFeatures(dataset) {
  return (dataset === 'kul-acc' || dataset === 'kul-eco') ? KUL_FEATURES : UCI_FEATURES;
}

function isKuleuven(dataset) {
  return dataset === 'kul-acc' || dataset === 'kul-eco';
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDataset, setSelectedDataset] = useState('kul-acc');
  const [isOnline, setIsOnline] = useState(false);
  const [metadata, setMetadata] = useState(null);

  // Preprocessing config
  const [selectedFeatures, setSelectedFeatures] = useState(KUL_FEATURES);
  const [scalingMode, setScalingMode] = useState('standard');

  // K-Means state
  const [kValue, setKValue] = useState(3);
  const [initMethod, setInitMethod] = useState('k-means++');
  const [kmeansData, setKmeansData] = useState(null);
  const [loadingKMeans, setLoadingKMeans] = useState(false);
  const [elbowData, setElbowData] = useState(null);
  const [loadingElbow, setLoadingElbow] = useState(false);

  // GMM state
  const [gmmK, setGmmK] = useState(3);
  const [covType, setCovType] = useState('full');
  const [gmmData, setGmmData] = useState(null);
  const [loadingGMM, setLoadingGMM] = useState(false);
  const [bicAicData, setBicAicData] = useState(null);
  const [loadingBicAic, setLoadingBicAic] = useState(false);

  // Comparison state
  const [compareK, setCompareK] = useState(3);
  const [comparisonData, setComparisonData] = useState(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  // Insights state
  const [algorithmChoice, setAlgorithmChoice] = useState('kmeans');
  const [insightsData, setInsightsData] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Initial load: check health and fetch metadata
  useEffect(() => {
    async function init() {
      const health = await fetchHealth();
      if (health.status === 'healthy') {
        setIsOnline(true);
      }
      try {
        const metaRes = await fetchDatasetMetadata(selectedDataset);
        if (metaRes.success) {
          setMetadata(metaRes.data);
        }
      } catch (err) {
        console.error('Metadata error:', err);
      }
    }
    init();
  }, [selectedDataset]);

  // Sync features + clear stale results when dataset source changes
  useEffect(() => {
    setSelectedFeatures(getDefaultFeatures(selectedDataset));
    setKmeansData(null);
    setElbowData(null);
    setGmmData(null);
    setBicAicData(null);
    setComparisonData(null);
    setInsightsData(null);
  }, [selectedDataset]);

  // Handler: Run K-Means
  const handleRunKMeans = async () => {
    setLoadingKMeans(true);
    try {
      const res = await runKMeans({
        dataset: selectedDataset,
        features: selectedFeatures,
        scaling: scalingMode,
        k: kValue,
        init: initMethod
      });
      if (res.success) {
        setKmeansData(res.data);
      }
    } catch (err) {
      console.error('K-Means execution failed:', err);
    } finally {
      setLoadingKMeans(false);
    }
  };

  // Handler: Compute Elbow
  const handleComputeElbow = async () => {
    setLoadingElbow(true);
    try {
      const res = await fetchElbow({
        dataset: selectedDataset,
        features: selectedFeatures,
        scaling: scalingMode
      });
      if (res.success) {
        setElbowData(res.data);
      }
    } catch (err) {
      console.error('Elbow failed:', err);
    } finally {
      setLoadingElbow(false);
    }
  };

  // Handler: Run GMM
  const handleRunGMM = async () => {
    setLoadingGMM(true);
    try {
      const res = await runGMM({
        dataset: selectedDataset,
        features: selectedFeatures,
        scaling: scalingMode,
        k: gmmK,
        covariance_type: covType
      });
      if (res.success) {
        setGmmData(res.data);
      }
    } catch (err) {
      console.error('GMM failed:', err);
    } finally {
      setLoadingGMM(false);
    }
  };

  // Handler: BIC / AIC Curve
  const handleFetchBicAic = async () => {
    setLoadingBicAic(true);
    try {
      const res = await fetchBicAic({
        dataset: selectedDataset,
        features: selectedFeatures,
        scaling: scalingMode,
        covariance_type: covType
      });
      if (res.success) {
        setBicAicData(res.data);
      }
    } catch (err) {
      console.error('BIC/AIC failed:', err);
    } finally {
      setLoadingBicAic(false);
    }
  };

  // Handler: Run Comparison
  const handleRunComparison = async () => {
    setLoadingComparison(true);
    try {
      const res = await compareModels({
        dataset: selectedDataset,
        features: selectedFeatures,
        scaling: scalingMode,
        k: compareK,
        covariance_type: covType
      });
      if (res.success) {
        setComparisonData(res.data);
      }
    } catch (err) {
      console.error('Comparison failed:', err);
    } finally {
      setLoadingComparison(false);
    }
  };

  // Handler: Fetch Insights
  const handleFetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetchInsights({
        dataset: selectedDataset,
        features: selectedFeatures,
        scaling: scalingMode,
        k: algorithmChoice === 'gmm' ? gmmK : kValue,
        algorithm: algorithmChoice
      });
      if (res.success) {
        setInsightsData(res.data);
      }
    } catch (err) {
      console.error('Insights failed:', err);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Automatically execute initial runs once backend is online
  useEffect(() => {
    if (isOnline) {
      handleRunKMeans();
      handleRunGMM();
      handleRunComparison();
      handleFetchInsights();
    }
  }, [isOnline, selectedDataset, scalingMode]);

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-slate-50 dark:text-slate-100 text-slate-900 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedDataset={selectedDataset}
        setSelectedDataset={setSelectedDataset}
        isOnline={isOnline}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardTab
            metadata={metadata}
            selectedDataset={selectedDataset}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'explorer' && (
          <DatasetExplorerTab
            metadata={metadata}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
            scalingMode={scalingMode}
            setScalingMode={setScalingMode}
            selectedDataset={selectedDataset}
            setSelectedDataset={setSelectedDataset}
          />
        )}

        {activeTab === 'kmeans' && (
          <KMeansLabTab
            kmeansData={kmeansData}
            loadingKMeans={loadingKMeans}
            onRunKMeans={handleRunKMeans}
            kValue={kValue}
            setKValue={setKValue}
            initMethod={initMethod}
            setInitMethod={setInitMethod}
            elbowData={elbowData}
            loadingElbow={loadingElbow}
            onComputeElbow={handleComputeElbow}
            selectedDataset={selectedDataset}
          />
        )}

        {activeTab === 'gmm' && (
          <GMMLabTab
            gmmData={gmmData}
            loadingGMM={loadingGMM}
            onRunGMM={handleRunGMM}
            gmmK={gmmK}
            setGmmK={setGmmK}
            covType={covType}
            setCovType={setCovType}
            selectedDataset={selectedDataset}
          />
        )}

        {activeTab === 'comparison' && (
          <ModelComparisonTab
            comparisonData={comparisonData}
            loadingComparison={loadingComparison}
            onRunComparison={handleRunComparison}
            bicAicData={bicAicData}
            loadingBicAic={loadingBicAic}
            onFetchBicAic={handleFetchBicAic}
            compareK={compareK}
            setCompareK={setCompareK}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsTab
            insightsData={insightsData}
            loadingInsights={loadingInsights}
            onRefreshInsights={handleFetchInsights}
            algorithmChoice={algorithmChoice}
            setAlgorithmChoice={(algo) => {
              setAlgorithmChoice(algo);
            }}
          />
        )}

        {activeTab === 'theory' && <MathTheoryTab />}
      </main>

      {/* Footer */}
      <footer className="border-t dark:border-slate-800 border-slate-200 dark:bg-slate-950/80 bg-white/80 py-6 text-center text-xs dark:text-slate-500 text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>EduLens &bull; Student Behavioural Cohort Discovery & Academic Risk Analysis</span>
          <span>Machine Learning Unit III Project &bull; KU Leuven &amp; UCI Student Datasets</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
