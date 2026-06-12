import React from 'react';
import { motion } from 'framer-motion';
import ScoreReveal from './ScoreReveal';
import CategoryCard from './CategoryCard';
import HarmonyShareCard from './HarmonyShareCard';
import PhotoTips from './PhotoTips';

export default function HarmonyResults({ results, stats }) {
  if (!results) return null;

  const { scores, normalized_overall, tier, view_scores } = results;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mt-8"
    >
      <ScoreReveal normalized={normalized_overall} tier={tier} />
      
      <PhotoTips viewScores={view_scores} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
        {Object.entries(scores || {}).map(([key, val], i) => (
          <CategoryCard key={key} name={key} score={val} index={i} />
        ))}
      </div>

      <HarmonyShareCard scores={scores} normalized={normalized_overall} tier={tier} stats={stats} />
    </motion.div>
  );
}
