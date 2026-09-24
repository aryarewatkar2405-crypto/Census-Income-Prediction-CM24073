import React from 'react';
import { Award, RotateCcw, ShieldCheck } from 'lucide-react';

export default function PredictionResult({ result, onReset }) {
  if (!result) return null;

  const isHighIncome = result.prediction === '>50K';
  const probHigh = (result.probabilities?.['>50K'] ?? 0) * 100;
  const probLow = (result.probabilities?.['<=50K'] ?? 0) * 100;

  return (
    <div className="white-card result-card highlight">
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563EB', fontSize: '0.82rem', fontWeight: 700, background: '#EFF6FF', padding: '0.25rem 0.75rem', borderRadius: '9999px' }}>
        <ShieldCheck size={16} />
        <span>ML Classification Result</span>
      </div>

      <h3 style={{ marginTop: '0.75rem', color: '#475569', fontSize: '0.95rem', fontWeight: 600 }}>
        Predicted Annual Income Class
      </h3>

      <div className={`result-badge ${isHighIncome ? 'high-income' : 'low-income'}`}>
        <Award size={26} />
        <span>{result.prediction}</span>
      </div>

      <p style={{ color: '#64748B', fontSize: '0.88rem', maxWidth: '420px', margin: '0 auto' }}>
        {isHighIncome
          ? 'The model predicts this individual earns greater than $50,000 per year based on educational attainment, occupation, and capital gains.'
          : 'The model predicts this individual earns $50,000 or less per year based on the provided demographic and employment attributes.'}
      </p>

      {/* Confidence Probability Meters */}
      <div className="probability-bar-container">
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ color: '#2563EB' }}>Low Income (&le; $50K)</span>
            <span style={{ color: '#0F172A' }}>{probLow.toFixed(1)}%</span>
          </div>
          <div className="prob-track">
            <div className="prob-fill low" style={{ width: `${probLow}%` }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600 }}>
            <span style={{ color: '#059669' }}>High Income (&gt; $50K)</span>
            <span style={{ color: '#0F172A' }}>{probHigh.toFixed(1)}%</span>
          </div>
          <div className="prob-track">
            <div className="prob-fill high" style={{ width: `${probHigh}%` }} />
          </div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1.25rem', marginTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
          Model: <strong>{result.model_name || 'Random Forest'}</strong>
        </span>
        <button
          onClick={onReset}
          className="btn-secondary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <RotateCcw size={14} />
          <span>New Prediction</span>
        </button>
      </div>
    </div>
  );
}
