import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { updateSoulSocials } from '../../lib/dedupService';
import { translateRarityTier } from '../../lib/i18nHelpers';

export default function NoMatchResult({ soul, onReset }) {
  const { t } = useLanguage();
  const [socials, setSocials] = useState({ instagram: '', otherSocial: '', twinMessage: '' });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSaveSocials(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSoulSocials(soul.id, {
        instagram: socials.instagram || null,
        otherSocial: socials.otherSocial || null,
        twinMessage: socials.twinMessage || null,
      });
      setSaved(true);
    } catch (err) {
      console.error('Failed to save socials:', err);
    } finally {
      setSaving(false);
    }
  }

  const card = "bg-[#1a0a2e] border border-[#3d2a6e] rounded-xl";
  const input = "w-full bg-[#0d0821] border border-[#3d2a6e] rounded-lg px-4 py-3 text-[#d4b8ff] placeholder-[#9d7fe3]/50 focus:outline-none focus:border-[#7f5af0] text-[15px]";
  const label = "block text-[13px] text-[#9d7fe3] mb-1.5";
  const btn = "w-full bg-[#1a0a2e] border border-[#7f5af0] text-[#d4b8ff] rounded-lg py-3 text-[15px] font-display hover:bg-[#7f5af0]/10 transition-colors";

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-block bg-[#7f5af0]/20 text-[#7f5af0] text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-4">
          {t('result.unique.badge')}
        </div>
        <h2 className="font-display text-[22px] text-[#d4b8ff] mb-2">
          {t('result.unique.title')}
        </h2>
      </motion.div>

      {/* Search begun card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={`${card} p-6 mb-6 border-l-4 border-l-emerald-500`}
      >
        <h3 className="font-display text-[18px] text-emerald-300 mb-3">
          {t('result.unique.search_title')}
        </h3>
        <p className="text-[15px] text-[#9d7fe3] leading-relaxed mb-4">
          {t('result.unique.search_body')}
        </p>
        <div className="flex items-center justify-between text-[11px] text-[#9d7fe3]/70 pt-3 border-t border-[#3d2a6e]">
          <span>{t('result.unique.last_searched')}</span>
          <span className="text-[#d4b8ff]">{t('result.unique.next_search')}</span>
        </div>
      </motion.div>

      {/* Rarity display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className={`${card} p-8 mb-6 text-center`}
      >
        <div className="text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-2">
          {t('rarity.your_tier')}
        </div>
        <div
          className="text-[28px] font-display text-[#d4b8ff] mb-2"
          style={{ textShadow: '0 0 20px rgba(127, 90, 240, 0.4)' }}
        >
          {translateRarityTier(t, soul.rarity_tier)}
        </div>
        <div className="text-3xl font-mono text-[#7f5af0]">{soul.rarity_score}%</div>
        <div className="text-[11px] text-[#9d7fe3] mt-1">{t('rarity.score_label')}</div>
      </motion.div>

      {/* Optional socials */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`${card} p-6 mb-6`}
      >
        <h3 className="font-display text-[15px] text-[#d4b8ff] mb-1">
          {t('result.social.title')}
        </h3>
        <p className="text-[11px] text-[#9d7fe3]/60 mb-5">
          {t('result.social.subtitle')}
        </p>

        {saved ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-[15px] text-emerald-300">{t('result.social.saved')}</p>
          </div>
        ) : (
          <form onSubmit={handleSaveSocials} className="space-y-4">
            <div>
              <label className={label}>{t('result.social.instagram')}</label>
              <input
                type="text"
                value={socials.instagram}
                onChange={e => setSocials(p => ({ ...p, instagram: e.target.value }))}
                placeholder={t('result.social.instagram_placeholder')}
                className={input}
              />
            </div>
            <div>
              <label className={label}>{t('result.social.other')}</label>
              <input
                type="text"
                value={socials.otherSocial}
                onChange={e => setSocials(p => ({ ...p, otherSocial: e.target.value }))}
                placeholder={t('result.social.other_placeholder')}
                className={input}
              />
            </div>
            <div>
              <label className={label}>{t('result.social.message_label')}</label>
              <textarea
                value={socials.twinMessage}
                onChange={e => setSocials(p => ({ ...p, twinMessage: e.target.value }))}
                placeholder={t('result.social.message_placeholder')}
                rows={3}
                className={`${input} resize-none`}
              />
              <p className="text-[11px] text-[#9d7fe3]/60 mt-1">{t('result.social.message_hint')}</p>
            </div>
            <button type="submit" disabled={saving} className={btn}>
              {saving ? t('result.social.sealing') : t('result.social.seal')}
            </button>
          </form>
        )}
      </motion.div>

      {/* WhatsApp share */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <button
          onClick={() => {
            const text = t('share.text.unique', {
              tier: translateRarityTier(t, soul.rarity_tier),
              score: soul.rarity_score,
            });
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
          }}
          className="text-[13px] text-[#9d7fe3] underline hover:text-[#d4b8ff] transition-colors"
        >
          {t('share.whatsapp')}
        </button>
      </motion.div>

      {/* Scan again */}
      <div className="text-center mt-8">
        <button onClick={onReset} className="text-[13px] text-[#9d7fe3] hover:text-[#d4b8ff] transition-colors">
          ← {t('result.scan_again')}
        </button>
      </div>
    </div>
  );
}
