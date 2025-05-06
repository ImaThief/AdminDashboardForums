import { useEffect, useState } from 'react';

export function useActivityLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No JWT found – are you logged in?');
        setLogs([]);
        return;
      }

      try {
        const res = await fetch(
          'https://forum-gen-backend-production.up.railway.app/api/activity',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Activity fetch failed (${res.status})`);
        }

        const data = await res.json();
        setLogs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch activity logs:', err);
        setLogs([]);
      }
    }

    fetchLogs();
  }, []);

  return logs;
}
