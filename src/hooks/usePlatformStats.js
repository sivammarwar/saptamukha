import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchPlatformStats } from '../lib/statsService';

const POLL_MS = 30000;

export function usePlatformStats({ poll = true } = {}) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    const next = await fetchPlatformStats();
    if (mounted.current) {
      setStats(next);
      setLoading(false);
    }
    return next;
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();

    if (!poll) {
      return () => { mounted.current = false; };
    }

    const id = setInterval(refresh, POLL_MS);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [refresh, poll]);

  return { stats, loading, refresh };
}
