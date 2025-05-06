import { useEffect, useState } from 'react';

export function useMockStats() {
  const [data, setData] = useState({
    users: null,
    forums: null,
    uptime: null,
    systemStatus: 'checking...',
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      setData({
        users: 87,
        forums: 14,
        uptime: '4 days 6 hrs',
        systemStatus: 'Operational',
      });
    }, 1000); // simulate 1s delay

    return () => clearTimeout(timeout);
  }, []);

  return data;
}
