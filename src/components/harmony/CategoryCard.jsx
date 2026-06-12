import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translateHarmonyMetric } from '../../lib/i18nHelpers';

export default function CategoryCard({ name, score, index }) {
  const { t } = useLanguage();

  const getScoreColor = (value) => {
    if (value >= 85) return '#00ff88';
    if (value >= 75) return '#a0ff00';
    if (value >= 65) return '#d4ff00';
    if (value >= 55) return '#ffd700';
    if (value >= 45) return '#ffaa33';
    return '#ff5454';
  };

  const getScoreLabel = (value) => {
    if (value >= 85) return t('harmony.scoreLabel.exceptional');
    if (value >= 75) return t('harmony.scoreLabel.excellent');
    if (value >= 65) return t('harmony.scoreLabel.good');
    if (value >= 55) return t('harmony.scoreLabel.average');
    if (value >= 45) return t('harmony.scoreLabel.below_average');
    return t('harmony.scoreLabel.developing');
  };

  const percentage = Math.min(100, Math.max(0, score));
  const scoreColor = getScoreColor(score);
  const scoreLabel = getScoreLabel(score);
  const metricName = translateHarmonyMetric(t, name);
  const metricSignificance = t(`harmony.metric.${name}.significance`);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03 }}
      className="bg-[#0a0a0f] border border-[#1f1f25] rounded-lg p-4 hover:border-[#7f5af0]/30 transition-all duration-300 group"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="text-[13px] font-mono text-[#d4b8ff] uppercase tracking-wider mb-1">
            {metricName}
          </h3>
          <p className="text-[10px] text-[#9d7fe3] leading-tight">
            {metricSignificance}
          </p>
        </div>
        <div className="text-right ml-4 shrink-0">
          <span
            className="text-[20px] font-display font-bold tabular-nums"
            style={{ color: scoreColor, textShadow: `0 0 10px ${scoreColor}30` }}
          >
            {score.toFixed(1)}
          </span>
          <span className="text-[11px] text-[#5a3fcf] ml-1">/100</span>
        </div>
      </div>

      <div className="w-full h-1.5 bg-[#1a1a1f] rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: index * 0.05 }}
          className="h-full rounded-full"
          style={{
            backgroundColor: scoreColor,
            boxShadow: `0 0 5px ${scoreColor}`,
          }}
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <span className="text-[9px] font-mono uppercase tracking-wider" style={{ color: scoreColor }}>
          {scoreLabel}
        </span>
      </div>
    </motion.div>
  );
}
