import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { getTopHarmonyScorers } from '../../lib/statsService';

export default function TopScorersSection() {
  const { t } = useLanguage();
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchScorers() {
      try {
        const scorers = await getTopHarmonyScorers();
        setTopScorers(scorers);
      } catch (err) {
        console.error('Failed to fetch top scorers:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchScorers();
  }, []);

  if (loading || topScorers.length === 0) {
    return null;
  }

  return (
    <section id="top-scorers" className="py-12 sm:py-16 px-4 scroll-anchor">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-[28px] md:text-[36px] font-display text-[#d4b8ff] tracking-wide mb-2"
            style={{ textShadow: '0 0 20px rgba(127, 90, 240, 0.4)' }}
          >
            Our Top Harmony Models
          </h2>
          <p className="text-[11px] md:text-[13px] text-[#9d7fe3] uppercase tracking-[0.2em] font-mono">
            The most balanced faces on Saptamukha
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {topScorers.map((scorer, index) => (
            <motion.div
              key={scorer.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                type: 'spring',
                stiffness: 100,
              }}
              className="text-center"
            >
              <div className="relative mb-4 mx-auto w-20 h-20 sm:w-24 sm:h-24">
                <div
                  className="absolute inset-0 rounded-full blur-lg opacity-60"
                  style={{
                    background: index === 0
                      ? 'radial-gradient(circle, #ffd700, transparent)'
                      : index === 1
                        ? 'radial-gradient(circle, #c0c0c0, transparent)'
                        : index === 2
                          ? 'radial-gradient(circle, #cd7f32, transparent)'
                          : 'radial-gradient(circle, #7f5af0, transparent)',
                  }}
                />
                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/20 bg-[#1a1a1a]">
                  {scorer.avatar_url && (
                    <img
                      src={scorer.avatar_url}
                      alt={scorer.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: index === 0
                      ? '#ffd700'
                      : index === 1
                        ? '#c0c0c0'
                        : index === 2
                          ? '#cd7f32'
                          : '#7f5af0',
                    color: index < 3 ? '#000' : '#fff',
                  }}
                >
                  #{index + 1} • {scorer.score.toFixed(1)}
                </div>
              </div>
              <div className="text-[12px] font-mono text-[#d4b8ff] mb-1">
                {scorer.name}
              </div>
              <div className="text-[10px] text-[#5a3fcf] mb-0.5">
                @{scorer.username}
              </div>
              <div className="text-[9px] text-[#9d7fe3] uppercase tracking-wider">
                {scorer.country}
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-[10px] text-[#5a3fcf]">
            Wanna remove your profile from here?{" "}
            <a href="mailto:sksb51645@gmail.com?subject=Request to remove profile from top scorers" className="text-[#d4b8ff] hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
