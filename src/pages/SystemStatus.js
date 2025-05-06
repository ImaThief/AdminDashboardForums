// src/pages/SystemStatus.js
import React, { useState, useEffect } from 'react';

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://forum-gen-backend-production.up.railway.app/api/status', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Status fetch failed (${res.status})`);
        return res.json();
      })
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load status:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-gray-500">Loading system status…</p>;
  }
  if (!status) {
    return <p className="text-red-500">Unable to retrieve system status.</p>;
  }

  // Format uptime if needed
  const formatUptime = (sec) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">System Status</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* API Uptime */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">API Uptime</p>
          <p className="text-xl font-semibold text-gray-800">
            {status.uptimeFormatted ?? formatUptime(status.uptime)}
          </p>
        </div>

        {/* Database Health */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Database</p>
          <p
            className={`text-xl font-semibold ${
              status.healthy ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status.healthy ? 'Connected' : 'Disconnected'}
          </p>
        </div>

        {/* Version */}
        <div className="bg-white shadow rounded-lg p-5">
          <p className="text-sm text-gray-500">Version</p>
          <p className="text-xl font-semibold text-gray-800">
            {status.version || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
