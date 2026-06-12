import { useState, useCallback } from 'react';
import { captureAndEmbed } from '../lib/embedService';

export function useEmbedCapture() {
  const [status, setStatus] = useState('idle');
  const [embedding, setEmbedding] = useState(null);
  const [error, setError] = useState(null);

  const capture = useCallback(async (videoRef) => {
    try {
      setStatus('capturing');
      setError(null);
      const result = await captureAndEmbed(videoRef.current);
      setEmbedding(result.embedding);
      setStatus('done');
      return result;
    } catch (err) {
      setError(err.message);
      setStatus('error');
      throw err;
    }
  }, []);

  return { capture, status, embedding, error };
}
