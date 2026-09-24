import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import { getHealth } from './services/api';

export default function App() {
  const [healthStatus, setHealthStatus] = useState(null);

  const checkHealth = async () => {
    try {
      const res = await getHealth();
      setHealthStatus(res);
    } catch (err) {
      setHealthStatus({ status: 'offline', model_loaded: false });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app">
      <Navbar healthStatus={healthStatus} />
      <Dashboard healthStatus={healthStatus} onRefreshHealth={checkHealth} />
    </div>
  );
}
