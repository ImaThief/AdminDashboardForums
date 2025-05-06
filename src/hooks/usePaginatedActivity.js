import { useEffect, useState, useCallback } from 'react';

export function usePaginatedActivity(page = 1, limit = 5) {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `https://forum-gen-backend-production.up.railway.app/api/activity?page=${page}&limit=${limit}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const { logs: fetchedLogs, total: fetchedTotal } = await res.json();
      setLogs(fetchedLogs);
      setTotal(fetchedTotal);
    } catch (err) {
      console.error('Failed to fetch activity logs:', err);
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { fetchPage(); }, [fetchPage]);

  return { logs, total, loading, refresh: fetchPage };
}