import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { updateSoulEmail } from '../../lib/dedupService';

export default function DuplicateResult({ existingSoul, onReset }) {
  const { t } = useLanguage();
  const [newEmail, setNewEmail] = useState('');
  const [updated, setUpdated] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  async function handleUpdateEmail(e) {
    e.preventDefault();
    setError('');
    if (!newEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setError(t('intake.error.email'));
      return;
    }
    setUpdating(true);
    try {
      await updateSoulEmail(existingSoul.soul_id, newEmail.trim());
      setUpdated(true);
    } catch (err) {
      setError(t('result.duplicate.update_error'));
    } finally {
      setUpdating(false);
    }
  }

  const card = "bg-[#1a0a2e] border border-[#3d2a6e] rounded-xl";
  const input = "w-full bg-[#0d0821] border border-[#3d2a6e] rounded-lg px-4 py-3 text-[#d4b8ff] placeholder-[#9d7fe3]/50 focus:outline-none focus:border-[#7f5af0] text-[15px]";
  const btn = "w-full bg-[#1a0a2e] border border-[#7f5af0] text-[#d4b8ff] rounded-lg py-3 text-[15px] font-display hover:bg-[#7f5af0]/10 transition-colors";

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-block bg-amber-500/20 text-amber-300 text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-4">
          {t('result.duplicate.badge')}
        </div>
        <h2 className="font-display text-[22px] text-[#d4b8ff] mb-2">
          {t('result.duplicate.title')}
        </h2>
      </motion.div>

      {/* Recognition box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`${card} p-6 mb-6`}
      >
        <div className="text-3xl mb-3 text-center">🪞</div>
        <p className="text-[15px] text-[#9d7fe3] leading-relaxed text-center">
          {t('result.duplicate.body')}
        </p>
      </motion.div>

      {/* Warning box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${card} p-6 mb-6 border-l-4 border-l-amber-500`}
      >
        <h3 className="text-[13px] text-amber-300 font-display mb-2">{t('result.duplicate.not_you')}</h3>
        <p className="text-[13px] text-[#9d7fe3] leading-relaxed">
          {t('result.duplicate.not_you_body')}
        </p>
      </motion.div>

      {/* Update contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${card} p-6 mb-6`}
      >
        <h3 className="font-display text-[15px] text-[#d4b8ff] mb-1">
          {t('result.duplicate.update_title')}
        </h3>
        <p className="text-[11px] text-[#9d7fe3]/60 mb-4">
          {t('result.duplicate.update_subtitle')}
        </p>

        {updated ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-[15px] text-emerald-300">{t('result.duplicate.updated')}</p>
          </div>
        ) : (
          <form onSubmit={handleUpdateEmail} className="space-y-3">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder={t('result.duplicate.email_placeholder')}
              className={input}
            />
            {error && <p className="text-[11px] text-red-400">{error}</p>}
            <button type="submit" disabled={updating} className={btn}>
              {updating ? t('result.duplicate.updating') : t('result.duplicate.update_button')}
            </button>
          </form>
        )}
      </motion.div>

      {/* Scan again */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <button onClick={onReset} className="text-[13px] text-[#9d7fe3] hover:text-[#d4b8ff] transition-colors">
          ← {t('result.scan_again')}
        </button>
      </motion.div>
    </div>
  );
}
