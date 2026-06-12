import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function CelebrityMatches({ matches }) {
  const { t } = useLanguage();

  if (!matches || matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-tantrik-stone">{t('celebrity.no_match')}</p>
      </div>
    );
  }

  const topMatch = matches[0];

  const CLONE_THRESHOLD = 0.80;
  const isClone = topMatch.similarity >= CLONE_THRESHOLD;

  const shareText = t('share.text.celebrity', { pct: topMatch.similarityPct, name: topMatch.name });
  const shareUrl = window.location.href;

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl + '?celebrity=' + topMatch.id);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <h2 className="font-display text-3xl text-tantrik-gold mb-2">
          {t('celebrity.headline')}
        </h2>
        <p className="text-tantrik-stone">{t('celebrity.subtitle')}</p>
      </motion.div>

      {/* Clone Found Banner */}
      {isClone && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mystic-card p-6 text-center mb-6 border-2 border-tantrik-fire"
        >
          <div className="text-4xl mb-2">🔥</div>
          <h3 className="font-display text-2xl text-tantrik-fire mb-2">
            {t('celebrity.clone_found')}
          </h3>
          <p className="text-tantrik-parchment text-lg mb-2">
            {t('celebrity.clone_message').replace('{name}', topMatch.name)}
          </p>
          <p className="text-tantrik-gold text-sm">
            {t('celebrity.clone_note')}
          </p>
        </motion.div>
      )}

      {/* Top Match Highlight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`mystic-card p-8 text-center mb-8 ${isClone ? 'border-tantrik-fire' : ''}`}
      >
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-tantrik-gold mb-4 glow-border">
          {topMatch.imageUrl ? (
            <img
              src={topMatch.imageUrl}
              alt={topMatch.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-tantrik-stone/20 flex items-center justify-center text-4xl">
              🌟
            </div>
          )}
        </div>
        <h3 className="font-display text-2xl text-tantrik-parchment mb-2">
          {topMatch.name}
        </h3>
        <div className="text-5xl font-mono text-tantrik-fire mb-2">
          {topMatch.similarityPct}%
        </div>
        <p className="text-tantrik-stone mb-2">{topMatch.label}</p>
        <p className="text-tantrik-parchment italic">
          "{t('celebrity.mirrors').replace('{name}', topMatch.name)}"
        </p>
      </motion.div>

      {/* All Matches Grid */}
      {matches.length > 1 && (
        <div className="grid grid-cols-2 gap-4 mb-8">
          {matches.slice(1).map((match, i) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="mystic-card p-4 text-center"
            >
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-tantrik-gold/50 mb-2">
                {match.imageUrl ? (
                  <img src={match.imageUrl} alt={match.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-tantrik-stone/20 flex items-center justify-center">🌟</div>
                )}
              </div>
              <p className="text-sm font-body text-tantrik-parchment">{match.name}</p>
              <p className="text-lg font-mono text-tantrik-fire">{match.similarityPct}%</p>
              <p className="text-xs text-tantrik-stone">{match.label}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Share Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={shareToWhatsApp} className="golden-button text-sm">
          {t('share.whatsapp')}
        </button>
        <button onClick={copyLink} className="mystic-card px-6 py-3 text-sm text-tantrik-parchment hover:border-tantrik-gold/50 transition-colors">
          {t('share.copy')}
        </button>
      </div>
    </div>
  );
}
