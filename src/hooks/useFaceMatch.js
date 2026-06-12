import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useFaceMatch() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (embedding, scanType = 'live', profileId = null) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke('match-faces', {
        body: { descriptor: embedding, scanType, profileId },
      });

      if (fnError) throw fnError;
      setMatches(data?.matches || []);
      return data?.matches || [];
    } catch (err) {
      setError(err.message);
      setMatches([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return { matches, loading, error, search };
}
