import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

export default function PhotoTips({ viewScores }) {
  const { t } = useLanguage();

  const analyzePose = (pose) => {
    const tips = [];
    const { yaw, pitch, roll } = pose || { yaw: 0, pitch: 0, roll: 0 };

    // Check yaw (left/right turn)
    if (Math.abs(yaw) > 15) {
      tips.push(
        yaw > 0 
          ? t('harmony.retake.pose.yaw_low') 
          : t('harmony.retake.pose.yaw_high')
      );
    }

    // Check pitch (up/down)
    if (Math.abs(pitch) > 10) {
      tips.push(
        pitch > 0 
          ? t('harmony.retake.pose.pitch_low') 
          : t('harmony.retake.pose.pitch_high')
      );
    }

    // Check roll (tilt)
    if (Math.abs(roll) > 8) {
      tips.push(
        roll > 0 
          ? t('harmony.retake.pose.roll_low') 
          : t('harmony.retake.pose.roll_high')
      );
    }

    return tips;
  };

  const allTips = [];
  
  // Get tips from front view first (most important)
  if (viewScores?.front?.pose) {
    allTips.push(...analyzePose(viewScores.front.pose));
  }
  
  // Add general tips if no specific pose tips
  if (allTips.length === 0) {
    allTips.push(t('harmony.retake.lighting'));
    allTips.push(t('harmony.retake.straight'));
    allTips.push(t('harmony.retake.face_camera'));
    allTips.push(t('harmony.retake.natural'));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8 mb-6"
    >
      <div className="text-center mb-4">
        <h3 className="text-[#a0ff00] text-lg font-mono uppercase tracking-wider">
          {t('harmony.retake.title')}
        </h3>
        <p className="text-[#9d7fe3] text-sm">
          {t('harmony.retake.subtitle')}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {allTips.slice(0, 4).map((tip, idx) => (
          <div
            key={idx}
            className="bg-[#0d0821] border border-[#2a2a2a] rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <span className="text-[#ffd700] text-lg">💡</span>
            <p className="text-[#e0d6ff] text-sm">{tip}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
