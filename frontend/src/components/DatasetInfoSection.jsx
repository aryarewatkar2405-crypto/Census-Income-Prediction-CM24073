import React from 'react';
import { Database } from 'lucide-react';

export default function DatasetInfoSection({ datasetInfo }) {
  if (!datasetInfo) return null;

  const numFeatures = datasetInfo.numerical_features || [];
  const featuresDetail = datasetInfo.features_detail || {};

  return (
    <div className="white-card">
      <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#0F172A' }}>
        <Database size={22} color="#2563EB" />
        <span>{datasetInfo.dataset_name || 'Adult / Census Income Dataset'}</span>
      </h3>
      <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        {datasetInfo.description || 'Predict whether an individual\'s annual income exceeds $50K/year based on demographic and census data.'}
      </p>

      {/* Overview Badges */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <div style={{ background: '#F8FAFC', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Total Samples</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>{(datasetInfo.total_samples || 48842).toLocaleString()}</div>
        </div>
        <div style={{ background: '#F8FAFC', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Features</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#2563EB' }}>{datasetInfo.total_features || 14} (6 Num + 8 Cat)</div>
        </div>
        <div style={{ background: '#F8FAFC', padding: '0.75rem 1.25rem', borderRadius: 'var(--radius-sm)', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>Target Column</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669' }}>{datasetInfo.target_column || 'class'} (&le;50K vs &gt;50K)</div>
        </div>
      </div>

      {/* Feature List Table */}
      <div style={{ marginTop: '1rem' }}>
        <h4 style={{ fontSize: '0.95rem', color: '#1E293B', marginBottom: '0.75rem', fontWeight: 700 }}>
          Input Features Catalog (14 Columns)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {Object.entries(featuresDetail).map(([feature, desc]) => {
            const isNumeric = numFeatures.includes(feature);
            return (
              <div
                key={feature}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  padding: '0.75rem 0.9rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#0F172A' }}>{feature}</span>
                  <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.1rem' }}>{desc}</div>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    background: isNumeric ? '#EFF6FF' : '#F1F5F9',
                    color: isNumeric ? '#2563EB' : '#475569',
                    border: `1px solid ${isNumeric ? '#BFDBFE' : '#E2E8F0'}`
                  }}
                >
                  {isNumeric ? 'NUMERIC' : 'CATEGORICAL'}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
