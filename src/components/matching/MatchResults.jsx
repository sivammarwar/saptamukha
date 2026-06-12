import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { supabase } from '../../lib/supabase';

export default function MatchResults({ embedding }) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [waitingCount, setWaitingCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!embedding) return;
    searchMatches();
  }, [embedding]);

  async function searchMatches() {
    setLoading(true);
    setError(null);
    try {
      // For demo / MVP: simulate a call to the Supabase Edge Function
      // In production, this calls: supabase.functions.invoke('match-faces', { body: { descriptor: embedding } })

      // Try real RPC if available
      const { data, error: rpcError } = await supabase.rpc('find_matching_faces', {
        query_descriptor: embedding,
        match_threshold: 0.30,
        max_results: 10,
      });

      if (!rpcError && data && data.length > 0) {
        setMatches(data);
      } else {
        // No real matches yet (cold start) - show waiting state
        setMatches([]);
      }

      // Get waiting count
      const { count } = await supabase
        .from('waiting_list')
        .select('*', { count: 'exact', head: true })
        .eq('opted_in', true);
      setWaitingCount(count || 0);
    } catch (err) {
      console.error('Match search error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          className="w-24 h-24 mx-auto mb-6 opacity-30"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <g fill="none" stroke="#c8960c" strokeWidth="0.5">
              <polygon points="50,5 95,85 5,85" />
              <polygon points="50,95 5,15 95,15" />
              <circle cx="50" cy="50" r="45" />
            </g>
          </svg>
        </motion.div>
        <p className="font-display text-xl text-tantrik-gold mb-2">{t('embed.processing')}</p>
        <p className="text-tantrik-stone text-sm animate-pulse">
          Searching across 8 billion souls...
        </p>
      </div>
    );
  }

  if (matches.length > 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h2 className="font-display text-3xl text-tantrik-gold text-center mb-8">
          {t('match.found')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, i) => (
            <motion.div
              key={match.face_id || i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="mystic-card p-6"
            >
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-tantrik-gold mb-3">
                {match.image_url ? (
                  <img src={match.image_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-tantrik-stone/20 flex items-center justify-center text-2xl">🔱</div>
                )}
              </div>
              <div className="text-center">
                <div className="text-3xl font-mono text-tantrik-fire mb-1">
                  {match.similarity_pct || 0}%
                </div>
                <p className="text-xs text-tantrik-stone mb-3">
                  {match.cosine_distance < 0.15 ? 'Almost Identical Twin' :
                   match.cosine_distance < 0.30 ? 'Soul Twin Detected' :
                   'Faint Soul Echo'}
                </p>
                <div className="space-y-1">
                  <p className="text-sm text-tantrik-parchment">{match.profile?.full_name || 'Unknown Soul'}</p>
                  <p className="text-xs text-tantrik-stone">{match.profile?.location || 'Somewhere on Earth'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // No match found
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mystic-card p-10"
      >
        <div className="text-5xl mb-4">🌑</div>
        <h2 className="font-display text-2xl text-tantrik-parchment mb-4">
          {t('match.not_found')}
        </h2>
        <p className="text-tantrik-stone mb-6">
          {t('match.waiting_count', { count: waitingCount })}
        </p>
        <p className="text-sm text-tantrik-stone/70 mb-8">
          Your face has been sealed in the Akashic record.
        </p>
        <button className="golden-button text-sm">
          {t('waiting_list.join')}
        </button>
      </motion.div>
    </div>
  );
}
