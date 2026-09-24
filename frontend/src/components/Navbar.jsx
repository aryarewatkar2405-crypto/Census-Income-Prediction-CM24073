import React from 'react';
import { BrainCircuit, ExternalLink } from 'lucide-react';

export default function Navbar({ healthStatus }) {
  const isOnline = healthStatus?.status === 'healthy';

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="brand">
          <div className="brand-icon">
            <BrainCircuit size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span className="brand-title">Census Income AI</span>
              <span className="brand-badge">ML Dashboard</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="nav-status">
            <div className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
            <span style={{ color: isOnline ? '#059669' : '#DC2626', fontWeight: 600, fontSize: '0.82rem' }}>
              {isOnline ? 'Backend Online' : 'Backend Offline'}
            </span>
          </div>

          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', textDecoration: 'none' }}
            title="Open FastAPI Swagger Documentation"
          >
            <span>Swagger API</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </header>
  );
}
