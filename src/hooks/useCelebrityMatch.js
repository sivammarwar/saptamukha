import { useState, useCallback } from 'react';
import { findCelebrityMatches, loadCelebrityData } from '../lib/celebrityMatcher';

export function useCelebrityMatch() {
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (embedding, topN = 3) => {
    setLoading(true);
    await loadCelebrityData();
    const results = findCelebrityMatches(embedding, topN);
    setMatches(results);
    setLoading(false);
    return results;
  }, []);

  return { matches, loading, search };
}
