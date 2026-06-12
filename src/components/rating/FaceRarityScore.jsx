import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function FaceRarityScore({ embedding, celebrityMatches, userMatches, quality }) {
  const { t } = useLanguage();

  const rarity = useMemo(() => {
    if (!embedding || !embedding.length) return null;

    const clarityScore = Math.min(100, Math.round((quality || 0.7) * 100));

    // --- Celebrity pool ---
    let celebMaxSim = 0;
    let celebAvgSim = 0;
    let celebTopMatch = null;

    if (celebrityMatches && celebrityMatches.length > 0) {
      celebMaxSim = Math.max(...celebrityMatches.map(m => m.similarity));
      celebAvgSim = celebrityMatches.reduce((s, m) => s + m.similarity, 0) / celebrityMatches.length;
      celebTopMatch = celebrityMatches[0];
    }

    // --- Real user pool ---
    let userMaxSim = 0;
    let userAvgSim = 0;
    let userCount = 0;

    if (userMatches && userMatches.length > 0) {
      userMaxSim = Math.max(...userMatches.map(m => 1 - (m.cosine_distance || 0)));
      userAvgSim = userMatches.reduce((s, m) => s + (1 - (m.cosine_distance || 0)), 0) / userMatches.length;
      userCount = userMatches.length;
    }

    // Combined: closest match from either pool
    const globalMaxSim = Math.max(celebMaxSim, userMaxSim);

    // Uniqueness: how different from the closest known face across ALL pools
    const uniquenessScore = Math.min(100, Math.round((1 - globalMaxSim) * 100));

    // Distinctiveness: average distance from all known faces
    const allAvgSim = (celebAvgSim + userAvgSim) / (userCount > 0 ? 2 : 1);
    const distinctivenessScore = Math.min(100, Math.round((1 - allAvgSim) * 100));

    // Overall rarity weighted
    const overallScore = Math.round(
      uniquenessScore * 0.45 + distinctivenessScore * 0.30 + clarityScore * 0.25
    );

    const rarityLabel = overallScore > 85 ? 'Extremely Rare' :
      overallScore > 70 ? 'Very Rare' :
      overallScore > 50 ? 'Uncommon' :
      overallScore > 30 ? 'Common' : 'Very Common';

    return {
      overall: overallScore,
      uniqueness: uniquenessScore,
      distinctiveness: distinctivenessScore,
      clarity: clarityScore,
      celebMaxSim: Math.round(celebMaxSim * 1000) / 10,
      celebAvgSim: Math.round(celebAvgSim * 1000) / 10,
      userMaxSim: Math.round(userMaxSim * 1000) / 10,
      userCount,
      celebTopMatch,
      rarityLabel,
    };
  }, [embedding, celebrityMatches, userMatches, quality]);

  if (!rarity) return null;

  const totalKnown = (celebrityMatches?.length || 0) + rarity.userCount;
  const shareText = `My face is ${rarity.rarityLabel} on SAPTAMUKHA — compared to ${totalKnown} known faces, I'm ${rarity.overall}% unique!`;

  const shareToWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mb-8"
      >
        <h2 className="font-display text-3xl text-tantrik-gold mb-2">
          {t('rarity.headline')}
        </h2>
        <p className="text-tantrik-stone">
          Real metrics from {totalKnown} known faces ({celebrityMatches?.length || 0} celebrities + {rarity.userCount} real users) in the mirror.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mystic-card p-8"
      >
        {/* Main Score */}
        <div className="text-center mb-8">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(200,150,12,0.1)" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#c8960c"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${rarity.overall * 2.83} 283`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-mono text-tantrik-fire">{rarity.overall}%</span>
              <span className="text-xs text-tantrik-stone">Unique</span>
            </div>
          </div>
          <p className="font-display text-xl text-tantrik-parchment">
            {rarity.rarityLabel}
          </p>
          {rarity.celebTopMatch && (
            <p className="text-tantrik-stone text-sm mt-1">
              Closest celebrity: <span className="text-tantrik-gold">{rarity.celebTopMatch.name}</span> ({rarity.celebMaxSim}%)
            </p>
          )}
          {rarity.userCount > 0 && (
            <p className="text-tantrik-stone text-sm mt-1">
              Closest real user: <span className="text-tantrik-gold">{rarity.userMaxSim}%</span> similarity ({rarity.userCount} users scanned)
            </p>
          )}
        </div>

        {/* Real Metrics */}
        <div className="space-y-4 mb-8">
          {[
            { label: 'Uniqueness (vs closest known face)', value: rarity.uniqueness, desc: `Celeb: ${rarity.celebMaxSim}% | User: ${rarity.userMaxSim}%` },
            { label: 'Distinctiveness (vs all known faces)', value: rarity.distinctiveness, desc: `Avg celeb: ${rarity.celebAvgSim}%` },
            { label: 'Face Clarity (photo quality)', value: rarity.clarity, desc: 'From detection score' }
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-tantrik-parchment">{item.label}</span>
                <span className="font-mono text-tantrik-fire">{item.value}/100</span>
              </div>
              <div className="h-2 bg-tantrik-stone/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${item.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className="h-full rounded-full bg-gradient-to-r from-tantrik-gold to-tantrik-fire"
                />
              </div>
              <p className="text-tantrik-stone/60 text-xs mt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Share */}
        <button onClick={shareToWhatsApp} className="golden-button text-sm w-full">
          {t('share.whatsapp')}
        </button>
      </motion.div>
    </div>
  );
}
