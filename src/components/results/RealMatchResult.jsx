import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translateRarityTier } from '../../lib/i18nHelpers';

function maskEmail(email) {
  if (!email || !email.includes('@')) return '****';
  const [local, domain] = email.split('@');
  return local[0] + '****@' + domain;
}

function daysAgo(dateStr) {
  const d = new Date(dateStr);
  const diff = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'today';
  if (diff === 1) return '1 day ago';
  return `${diff} days ago`;
}

export default function RealMatchResult({ soul, matchedSoul, matchedSouls = [], similarity, onReset }) {
  const { t } = useLanguage();
  const matchList = matchedSouls.length
    ? matchedSouls
    : matchedSoul
      ? [{ ...matchedSoul, similarity_pct: similarity }]
      : [];
  const primaryMatch = matchList[0];
  const highestSimilarity = Math.max(
    similarity || 0,
    ...matchList.map((match) => Number(match.similarity_pct) || 0)
  );

  const card = "bg-[#1a0a2e] border border-[#3d2a6e] rounded-xl";

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-block bg-[#7f5af0]/20 text-[#7f5af0] text-[11px] uppercase tracking-wider px-3 py-1 rounded-full mb-4">
          {t('result.match.badge')}
        </div>
        <h2 className="font-display text-[22px] text-[#d4b8ff] mb-2">
          {t('result.match.title')}
        </h2>
      </motion.div>

      {/* Match cards */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', damping: 20 }}
        className={`${matchList.length > 1 ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : ''} mb-6`}
      >
        {matchList.map((match, index) => (
          <div
            key={match.soul_id || match.id || index}
            className={`${card} p-8 text-center border-2 ${index === 0 ? 'border-[#7f5af0]/40' : 'border-[#3d2a6e]'}`}
          >
            <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-[#7f5af0] mb-4 shadow-lg shadow-[#7f5af0]/20">
              {match.image_url ? (
                <img src={match.image_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#0d0821] flex items-center justify-center text-4xl">🔱</div>
              )}
            </div>

            <h3 className="font-display text-[18px] text-[#d4b8ff] mb-1">{match.name}</h3>

            {match.similarity_pct ? (
              <>
                <div className="text-5xl font-mono text-[#7f5af0] mb-2" style={{ textShadow: '0 0 30px rgba(127,90,240,0.5)' }}>
                  {match.similarity_pct}%
                </div>
                <p className="text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-4">{t('result.match.percentage_label')}</p>
              </>
            ) : (
              <p className="text-[11px] text-[#9d7fe3] uppercase tracking-wider mb-4">Connected through the twin circle</p>
            )}

            <div className="space-y-2 text-[13px] text-[#9d7fe3]">
              <p>
                <span className="text-[#d4b8ff]">{match.country}</span> · {match.age} {t('result.match.years')}
              </p>
              <p>{t('result.match.joined')} {daysAgo(match.created_at)}</p>
              {match.instagram && (
                <p className="text-[#d4b8ff]">📷 {match.instagram}</p>
              )}
              {match.other_social && (
                <p className="text-[#d4b8ff]">🔗 {match.other_social}</p>
              )}
              <p className="text-[11px] mt-2">✉️ {maskEmail(match.email)}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Rarity score */}
      {soul && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
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
      )}

      {/* Why this match is real */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`${card} p-6 mb-6`}
      >
        <h3 className="font-display text-[15px] text-[#d4b8ff] mb-3">
          {t('result.match.why_title')}
        </h3>
        <p className="text-[13px] text-[#9d7fe3] leading-relaxed">
          {t('result.match.why_body').replace('{pct}', String(highestSimilarity))}
        </p>
      </motion.div>

      {/* Share actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-3 mb-8"
      >
        <button
          onClick={() => {
            const text = t('share.text.match', {
              similarity: highestSimilarity,
              name: primaryMatch?.name || 'my twin',
            });
            window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`, '_blank');
          }}
          className="flex-1 bg-[#1a0a2e] border border-[#7f5af0] text-[#d4b8ff] rounded-lg py-3 text-[13px] font-display hover:bg-[#7f5af0]/10 transition-colors"
        >
          {t('share.whatsapp')}
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(window.location.href)}
          className="flex-1 bg-[#1a0a2e] border border-[#3d2a6e] text-[#d4b8ff] rounded-lg py-3 text-[13px] hover:border-[#7f5af0]/50 transition-colors"
        >
          {t('share.copy')}
        </button>
      </motion.div>

      {/* Scan again */}
      <div className="text-center">
        <button onClick={onReset} className="text-[13px] text-[#9d7fe3] hover:text-[#d4b8ff] transition-colors">
          ← {t('result.scan_again')}
        </button>
      </div>
    </div>
  );
}
