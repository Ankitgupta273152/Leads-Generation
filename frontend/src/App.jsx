import React, { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import api from './services/api';

export default function App() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        setStats(res.data.data);
      } catch (err) {
        console.error('Stats error:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return <Dashboard stats={stats} />;
}
