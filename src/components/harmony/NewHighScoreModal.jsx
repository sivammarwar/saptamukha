import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { submitTopHarmonyScorer } from '../../lib/statsService';

export default function NewHighScoreModal({ isOpen, onClose, score, rank, onSuccess }) {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitTopHarmonyScorer({ name, username, country, avatar, score });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to submit:', err);
      alert('Failed to submit. Please try again!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative max-w-lg w-full bg-[#13131a] border border-[#2a2a3a] rounded-2xl p-8 shadow-2xl overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#ffd700] via-[#ff6b00] to-[#ff1493]"
            />
            
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                className="mx-auto w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-[#ffd700] to-[#ff6b00] mb-4"
              >
                <span className="text-4xl">🏆</span>
              </motion.div>
              <h2 className="text-[28px] font-display text-[#ffd700] tracking-wide mb-2">
                {rank === 1 ? "YOU BROKE THE RECORD!" : `YOU'RE #${rank}!`}
              </h2>
              <p className="text-[14px] text-[#9d7fe3]">
                Your Harmony Score: <span className="text-[#00ff88] font-bold text-[20px]">{score.toFixed(1)}</span>/100
              </p>
              <p className="text-[11px] text-[#5a3fcf] mt-2">
                Want to be featured on our website?
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <label className="cursor-pointer">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed border-[#5a3fcf] flex items-center justify-center bg-[#1a1a1a]">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center text-[#5a3fcf]">
                        <div className="text-2xl mb-1">📷</div>
                        <div className="text-[10px]">Add Photo</div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              <div>
                <label className="block text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a3a] rounded-lg text-[#d4b8ff] text-[13px] outline-none focus:border-[#7f5af0] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-1">
                  Instagram Username
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-[#5a3fcf] text-[13px]">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="your.username"
                    className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#2a2a3a] rounded-lg text-[#d4b8ff] text-[13px] outline-none focus:border-[#7f5af0] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Your country"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#2a2a3a] rounded-lg text-[#d4b8ff] text-[13px] outline-none focus:border-[#7f5af0] transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-lg text-[12px] uppercase tracking-wider font-mono bg-[#1a1a1a] text-[#5a3fcf] border border-[#2a2a3a] hover:bg-[#2a2a3a] transition-all"
                >
                  Maybe Later
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 rounded-lg text-[12px] uppercase tracking-wider font-mono bg-gradient-to-r from-[#ffd700] to-[#ff6b00] text-[#000] font-bold hover:shadow-[0_0_30px_rgba(255,215,0,0.5) transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'SUBMITTING...' : 'YES, FEATURE ME!'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
