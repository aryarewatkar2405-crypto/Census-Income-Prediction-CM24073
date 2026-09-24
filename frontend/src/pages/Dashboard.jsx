import React, { useState, useEffect } from 'react';
import {
  getHealth,
  getMetrics,
  getDatasetInfo,
  predictIncome
} from '../services/api';

import MetricCard from '../components/MetricCard';
import PredictionForm from '../components/PredictionForm';
import PredictionResult from '../components/PredictionResult';
import ModelPerformance from '../components/ModelPerformance';
import DatasetInfoSection from '../components/DatasetInfoSection';
import AboutSection from '../components/AboutSection';

import {
  CheckCircle,
  Target,
  BarChart2,
  Percent,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  PlayCircle,
  Activity,
  Database,
  Info
} from 'lucide-react';

export default function Dashboard({ healthStatus, onRefreshHealth }) {
  const [activeTab, setActiveTab] = useState('predict'); // 'predict' | 'performance' | 'dataset' | 'about'
  const [metrics, setMetrics] = useState(null);
  const [datasetInfo, setDatasetInfo] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Prediction State
  const [predictionResult, setPredictionResult] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoadingInitial(true);
    setFetchError(null);
    try {
      const [metricsData, infoData] = await Promise.all([
        getMetrics().catch(err => {
          console.warn('Metrics fetch warning:', err);
          return null;
        }),
        getDatasetInfo().catch(err => {
          console.warn('Dataset info warning:', err);
          return null;
        })
      ]);

      if (metricsData) setMetrics(metricsData);
      if (infoData) setDatasetInfo(infoData);

      if (!metricsData && !infoData) {
        setFetchError('Unable to connect to the prediction server. Please ensure the FastAPI backend is running.');
      }
    } catch (err) {
      setFetchError(err.message || 'Error loading dashboard metrics.');
    } finally {
      setLoadingInitial(false);
    }
  };

  const handlePredictionSubmit = async (formData) => {
    setPredictionLoading(true);
    setPredictionError(null);
    try {
      const result = await predictIncome(formData);
      setPredictionResult(result);
    } catch (err) {
      setPredictionError(err.message || 'Failed to generate prediction from backend.');
    } finally {
      setPredictionLoading(false);
    }
  };

  const handleResetPrediction = () => {
    setPredictionResult(null);
    setPredictionError(null);
  };

  return (
    <main className="container" style={{ paddingBottom: '4rem' }}>
      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-tag">
          <Sparkles size={15} />
          <span>Machine Learning Intelligence</span>
        </div>
        <h1 className="hero-title">Census Income Prediction</h1>
        <p className="hero-subtitle">
          Predict whether an individual earns more than <strong>$50,000/year</strong> using census demographics powered by Random Forest and FastAPI.
        </p>
      </section>

      {/* Backend Offline Warning Banner */}
      {healthStatus?.status !== 'healthy' && (
        <div style={{
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1.75rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          color: '#991B1B',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={24} color="#DC2626" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>FastAPI Backend Offline</div>
              <div style={{ fontSize: '0.85rem', color: '#B91C1C' }}>
                Start the backend server in terminal with: <code style={{ background: '#FEE2E2', padding: '0.2rem 0.4rem', borderRadius: '4px', fontWeight: 600 }}>python -m uvicorn backend.main:app --port 8000</code>
              </div>
            </div>
          </div>
          <button
            onClick={() => { onRefreshHealth(); loadDashboardData(); }}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', borderColor: '#FCA5A5', color: '#991B1B' }}
          >
            <RefreshCw size={14} />
            <span>Retry Connection</span>
          </button>
        </div>
      )}

      {/* Overview KPI Cards */}
      <section className="grid-4">
        <MetricCard
          title="Model Accuracy"
          value={metrics ? `${(metrics.accuracy * 100).toFixed(2)}%` : '85.76%'}
          subtext="Random Forest (50 Trees)"
          icon={Target}
          iconBg="#EFF6FF"
          iconColor="#2563EB"
        />
        <MetricCard
          title="Macro Precision"
          value={metrics ? `${(metrics.precision_macro * 100).toFixed(1)}%` : '81.3%'}
          subtext="Balanced Class Precision"
          icon={CheckCircle}
          iconBg="#ECFDF5"
          iconColor="#059669"
        />
        <MetricCard
          title="Macro Recall"
          value={metrics ? `${(metrics.recall_macro * 100).toFixed(1)}%` : '78.0%'}
          subtext="True Positive Capture Rate"
          icon={Percent}
          iconBg="#F5F3FF"
          iconColor="#7C3AED"
        />
        <MetricCard
          title="Macro F1-Score"
          value={metrics ? `${(metrics.f1_macro * 100).toFixed(1)}%` : '79.4%'}
          subtext="Harmonic Mean Score"
          icon={BarChart2}
          iconBg="#FFFBEB"
          iconColor="#D97706"
        />
      </section>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'predict' ? 'active' : ''}`}
          onClick={() => setActiveTab('predict')}
        >
          <PlayCircle size={17} />
          <span>Income Prediction</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <Activity size={17} />
          <span>Model Performance</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'dataset' ? 'active' : ''}`}
          onClick={() => setActiveTab('dataset')}
        >
          <Database size={17} />
          <span>Dataset Catalog</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          <Info size={17} />
          <span>Architecture & About</span>
        </button>
      </div>

      {/* Tab 1: Income Prediction */}
      {activeTab === 'predict' && (
        <div className="grid-main">
          <PredictionForm
            onSubmit={handlePredictionSubmit}
            loading={predictionLoading}
            error={predictionError}
          />
          <div>
            {predictionResult ? (
              <PredictionResult
                result={predictionResult}
                onReset={handleResetPrediction}
              />
            ) : (
              <div className="white-card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto', color: '#2563EB' }}>
                  <Sparkles size={28} />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#0F172A' }}>Ready for Prediction</h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', maxWidth: '320px', margin: '0 auto' }}>
                  Select one of the quick presets on the left or enter attributes to see live AI classification.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Model Performance */}
      {activeTab === 'performance' && (
        <ModelPerformance metrics={metrics} />
      )}

      {/* Tab 3: Dataset Explorer */}
      {activeTab === 'dataset' && (
        <DatasetInfoSection datasetInfo={datasetInfo} />
      )}

      {/* Tab 4: About & Architecture */}
      {activeTab === 'about' && (
        <AboutSection />
      )}

      {/* Footer */}
      <footer className="footer">
        <div>Census Income Prediction ML Project • Phase 1 (Model) + Phase 2 (FastAPI) + Phase 3 (React)</div>
        <div style={{ marginTop: '0.35rem', color: '#94A3B8', fontSize: '0.8rem' }}>
          Built with Scikit-Learn Random Forest Pipeline, FastAPI & Vite React
        </div>
      </footer>
    </main>
  );
}
