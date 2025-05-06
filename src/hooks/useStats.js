import { useEffect, useState, useCallback } from 'react';

function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

export function useStats() {
  const [stats, setStats] = useState({
    users: null,
    projects: null,
    uptime: null,
    systemStatus: null,
  });

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const [usersRes, projectRes, statusRes] = await Promise.all([
        fetch('https://forum-gen-backend-production.up.railway.app/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('https://forum-gen-backend-production.up.railway.app/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('https://forum-gen-backend-production.up.railway.app/api/status', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!usersRes.ok || !projectRes.ok || !statusRes.ok) {
        throw new Error('One or more API calls failed');
      }

      const usersData = await usersRes.json();
      const projectsData = await projectRes.json();
      const statusData = await statusRes.json();

      const uptimeFormatted = formatUptime(statusData.uptime ?? 0);

      setStats({
        users: Array.isArray(usersData) ? usersData.length : '-',
        projects: Array.isArray(projectsData) ? projectsData.length : '-',
        uptime: uptimeFormatted,
        systemStatus: statusData.healthy ? 'Operational' : 'Down',
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStats({ users: '-', projects: '-', uptime: '-', systemStatus: 'Down' });
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { ...stats, refresh: fetchStats };
}