import React from 'react';
import { Layers, ShieldCheck, Cpu, Code2, Server, Globe } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="white-card">
      <h3 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#0F172A' }}>
        <Layers size={22} color="#2563EB" />
        <span>About Census Income Prediction System</span>
      </h3>
      <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
        A complete 3-phase Machine Learning architecture built with modern data science, high-performance API engineering, and responsive web technologies.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {/* Phase 1 */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.4rem', borderRadius: '6px' }}>
              <Cpu size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0F172A' }}>Phase 1: ML Model Training</h4>
              <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>85.76% ACCURACY</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
            Trained on 48,842 Adult Census records using an 80/20 stratified split. Preprocessing is encapsulated in a scikit-learn ColumnTransformer (StandardScaler + OneHotEncoder) inside a 50-tree Random Forest pipeline to eliminate data leakage.
          </p>
        </div>

        {/* Phase 2 */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.4rem', borderRadius: '6px' }}>
              <Server size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0F172A' }}>Phase 2: FastAPI Backend</h4>
              <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700 }}>REST API & SWAGGER</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
            High-performance asynchronous REST API running on Uvicorn. Loads the model once during lifespan startup, validates 14 input attributes via Pydantic, and returns classifications with real probability distributions.
          </p>
        </div>

        {/* Phase 3 */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ background: '#EFF6FF', color: '#2563EB', padding: '0.4rem', borderRadius: '6px' }}>
              <Globe size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '1rem', color: '#0F172A' }}>Phase 3: React Dashboard</h4>
              <span style={{ fontSize: '0.75rem', color: '#7C3AED', fontWeight: 700 }}>VITE & CLEAN UI</span>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
            A lightweight, responsive single-page application providing real-time model inference, 1-click test presets, confusion matrix visualizer, and dynamic dataset cataloging.
          </p>
        </div>
      </div>
    </div>
  );
}
