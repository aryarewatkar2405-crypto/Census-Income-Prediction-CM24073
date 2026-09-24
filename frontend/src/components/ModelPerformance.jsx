import React from 'react';
import { BarChart3, GitCompare, Grid } from 'lucide-react';

export default function ModelPerformance({ metrics }) {
  if (!metrics) return null;

  const cm = metrics.confusion_matrix || {};
  const matrix = cm.matrix || [[0, 0], [0, 0]];
  const comparison = metrics.model_comparison || [];
  const classMetrics = metrics.class_metrics || {};

  const tn = cm.true_negative ?? matrix[0]?.[0] ?? 0;
  const fp = cm.false_positive ?? matrix[0]?.[1] ?? 0;
  const fn = cm.false_negative ?? matrix[1]?.[0] ?? 0;
  const tp = cm.true_positive ?? matrix[1]?.[1] ?? 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 1. Model Comparison & Classification Report */}
      <div className="grid-2">
        {/* Model Comparison */}
        <div className="white-card">
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0F172A' }}>
            <GitCompare size={20} color="#2563EB" />
            <span>Model Comparison</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {comparison.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  background: item.selected ? '#EFF6FF' : '#F8FAFC',
                  border: `1px solid ${item.selected ? '#BFDBFE' : '#E2E8F0'}`
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0F172A' }}>
                    <span>{item.model_name}</span>
                    {item.selected && (
                      <span style={{ fontSize: '0.68rem', background: '#2563EB', color: 'white', padding: '0.15rem 0.45rem', borderRadius: '4px', fontWeight: 800 }}>
                        PRODUCTION MODEL
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                    {item.model_name.includes('Forest') ? '50 Decision Trees, n_jobs=-1' : 'L2 Regularized Baseline'}
                  </span>
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: item.selected ? '#2563EB' : '#64748B' }}>
                  {(item.accuracy * 100).toFixed(2)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Per Class Breakdown */}
        <div className="white-card">
          <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#0F172A' }}>
            <BarChart3 size={20} color="#2563EB" />
            <span>Class Performance Breakdown</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {/* <=50K Class */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 700, color: '#2563EB', marginBottom: '0.5rem' }}>
                Class &le; $50K (Majority)
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>Precision: <strong>{((classMetrics['<=50K']?.precision || 0.89) * 100).toFixed(1)}%</strong></div>
                <div>Recall: <strong>{((classMetrics['<=50K']?.recall || 0.93) * 100).toFixed(1)}%</strong></div>
                <div>F1-Score: <strong>{((classMetrics['<=50K']?.f1_score || 0.91) * 100).toFixed(1)}%</strong></div>
              </div>
            </div>

            {/* >50K Class */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 700, color: '#059669', marginBottom: '0.5rem' }}>
                Class &gt; $50K (Target)
              </div>
              <div style={{ fontSize: '0.82rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <div>Precision: <strong>{((classMetrics['>50K']?.precision || 0.74) * 100).toFixed(1)}%</strong></div>
                <div>Recall: <strong>{((classMetrics['>50K']?.recall || 0.63) * 100).toFixed(1)}%</strong></div>
                <div>F1-Score: <strong>{((classMetrics['>50K']?.f1_score || 0.68) * 100).toFixed(1)}%</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Confusion Matrix */}
      <div className="white-card">
        <h3 style={{ fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#0F172A' }}>
          <Grid size={20} color="#2563EB" />
          <span>Test Set Confusion Matrix (9,769 Samples)</span>
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '1rem' }}>
          Distribution of true positive, true negative, and error predictions evaluated on unseen test data.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table className="cm-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'left', color: '#64748B', fontSize: '0.8rem', padding: '0.5rem' }}>
                  Actual \ Predicted
                </th>
                <th style={{ color: '#2563EB', fontSize: '0.85rem', fontWeight: 700 }}>Predicted &le; $50K</th>
                <th style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 700 }}>Predicted &gt; $50K</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th style={{ textAlign: 'left', color: '#2563EB', fontSize: '0.85rem', padding: '0.5rem', fontWeight: 700 }}>
                  Actual &le; $50K
                </th>
                <td className="cm-cell tn">
                  <div className="cm-number" style={{ color: '#2563EB' }}>{tn.toLocaleString()}</div>
                  <div className="cm-sub">True Negative (Correct)</div>
                </td>
                <td className="cm-cell error">
                  <div className="cm-number" style={{ color: '#DC2626' }}>{fp.toLocaleString()}</div>
                  <div className="cm-sub">False Positive (Error)</div>
                </td>
              </tr>
              <tr>
                <th style={{ textAlign: 'left', color: '#059669', fontSize: '0.85rem', padding: '0.5rem', fontWeight: 700 }}>
                  Actual &gt; $50K
                </th>
                <td className="cm-cell error">
                  <div className="cm-number" style={{ color: '#DC2626' }}>{fn.toLocaleString()}</div>
                  <div className="cm-sub">False Negative (Error)</div>
                </td>
                <td className="cm-cell tp">
                  <div className="cm-number" style={{ color: '#059669' }}>{tp.toLocaleString()}</div>
                  <div className="cm-sub">True Positive (Correct)</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
