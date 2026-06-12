import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translateHarmonyTier, translateHarmonyTierDesc } from '../../lib/i18nHelpers';

export default function ScoreReveal({ normalized, tier }) {
  const { t } = useLanguage();
  const [displayScore, setDisplayScore] = useState(0);
  const [showTier, setShowTier] = useState(false);
  const [showSubtext, setShowSubtext] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    setShowTier(false);
    setShowSubtext(false);
    setDisplayScore(0);
    startRef.current = null;

    const duration = 1800;
    const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);

    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setDisplayScore(Math.round(eased * normalized * 10) / 10);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setTimeout(() => setShowTier(true), 300);
        setTimeout(() => setShowSubtext(true), 600);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [normalized]);

  const getScoreColor = (score) => {
    if (score >= 85) return '#00ff88';
    if (score >= 75) return '#a0ff00';
    if (score >= 65) return '#d4ff00';
    if (score >= 55) return '#ffd700';
    if (score >= 45) return '#ffaa33';
    return '#ff5454';
  };

  const scoreColor = getScoreColor(displayScore);
  const translatedTier = translateHarmonyTier(t, tier);

  return (
    <div className="text-center py-10 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
        <svg width="280" height="320" viewBox="0 0 280 320" fill="none">
          <path
            d="M140 20 C80 20 30 80 30 160 C30 260 90 300 140 300 C190 300 250 260 250 160 C250 80 200 20 140 20Z"
            stroke="#7f5af0"
            strokeWidth="2"
          />
          <circle cx="140" cy="110" r="35" stroke="#7f5af0" strokeWidth="1.5" />
          <line x1="105" y1="160" x2="175" y2="160" stroke="#7f5af0" strokeWidth="1" />
          <path d="M110 210 Q140 240 170 210" stroke="#7f5af0" strokeWidth="1.5" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-[11px] text-[#9d7fe3] uppercase tracking-[0.2em] mb-3 font-mono">
          {t('harmony.score.label')}
        </div>
        <div className="relative inline-block">
          <div
            className="text-[80px] md:text-[96px] font-display leading-none tabular-nums"
            style={{
              color: scoreColor,
              textShadow: `0 0 30px ${scoreColor}60`,
            }}
          >
            {displayScore.toFixed(1)}
          </div>
          <div className="text-[16px] text-[#5a3fcf] absolute -top-1 -right-8">/100</div>
        </div>
      </motion.div>

      {showTier && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: [0.8, 1.05, 1] }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="inline-block mt-4"
        >
          <div
            className="px-6 py-2 rounded-full border border-[#7f5af0]/40 bg-[#7f5af0]/10 text-[#d4b8ff] text-[14px] font-display tracking-wide"
            style={{ textShadow: '0 0 12px rgba(127, 90, 240, 0.5)' }}
          >
            {translatedTier}
          </div>
        </motion.div>
      )}

      {showSubtext && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 max-w-md mx-auto"
        >
          <p className="text-[11px] text-[#7a5fcf] font-mono leading-relaxed">
            {translateHarmonyTierDesc(t, tier)}
          </p>
        </motion.div>
      )}
    </div>
  );
}
