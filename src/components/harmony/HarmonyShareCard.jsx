import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { translateHarmonyMetric, translateHarmonyTier, translateHarmonyTierDesc } from '../../lib/i18nHelpers';

const CATEGORY_APPRECIATION_THRESHOLD = 85;
const GRAND_APPRECIATION_THRESHOLD = 90;
const SITE_URL = 'https://saptamukha.com';

function sortScores(scores, direction = 'desc') {
  if (!scores) return [];
  const entries = Object.entries(scores).map(([key, val]) => ({ key, val }));
  entries.sort((a, b) => (direction === 'desc' ? b.val - a.val : a.val - b.val));
  return entries;
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  words.forEach((word) => {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  });

  if (current) lines.push(current);
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return lines.length;
}

async function canvasToBlob(canvas) {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
}

async function generateAppreciationCardImage(payload) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1500;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#05030b');
  gradient.addColorStop(0.45, '#12071d');
  gradient.addColorStop(1, '#220812');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glowA = ctx.createRadialGradient(260, 300, 20, 260, 300, 420);
  glowA.addColorStop(0, 'rgba(127,90,240,0.30)');
  glowA.addColorStop(1, 'rgba(127,90,240,0)');
  ctx.fillStyle = glowA;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const glowB = ctx.createRadialGradient(950, 1080, 10, 950, 1080, 420);
  glowB.addColorStop(0, 'rgba(255,84,84,0.18)');
  glowB.addColorStop(1, 'rgba(255,84,84,0)');
  ctx.fillStyle = glowB;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.strokeStyle = 'rgba(127,90,240,0.18)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(600, 580, 320, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(600, 580, 250, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(600, 170);
  ctx.lineTo(900, 900);
  ctx.lineTo(300, 900);
  ctx.closePath();
  ctx.stroke();
  ctx.restore();

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.strokeRect(50, 50, 1100, 1400);
  ctx.strokeStyle = 'rgba(127,90,240,0.28)';
  ctx.strokeRect(70, 70, 1060, 1360);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#9d7fe3';
  ctx.font = '28px Arial';
  ctx.fillText('MUKHA DARSHAN', 600, 150);

  ctx.fillStyle = '#d4b8ff';
  ctx.font = 'bold 68px Arial';
  wrapText(ctx, payload.cardHeadline.toUpperCase(), 600, 250, 860, 76);

  ctx.fillStyle = '#7f5af0';
  ctx.font = '24px Arial';
  ctx.fillText('THE MIRROR HAS SPOKEN', 600, 430);

  ctx.fillStyle = payload.scoreColor;
  ctx.font = 'bold 190px Arial';
  ctx.fillText(payload.primaryValue, 600, 690);

  ctx.fillStyle = '#5a3fcf';
  ctx.font = '42px Arial';
  ctx.fillText(payload.primarySuffix, 600, 748);

  ctx.fillStyle = '#f4df9b';
  ctx.font = 'bold 40px Arial';
  wrapText(ctx, payload.badgeLabel.toUpperCase(), 600, 845, 780, 48);

  ctx.fillStyle = '#d4b8ff';
  ctx.font = '32px Arial';
  wrapText(ctx, payload.cardSubline, 600, 940, 800, 42);

  ctx.fillStyle = '#ffcc66';
  ctx.font = 'bold 26px Arial';
  wrapText(ctx, payload.metricLine.toUpperCase(), 600, 1080, 860, 34);

  ctx.fillStyle = '#9d7fe3';
  ctx.font = '24px Arial';
  wrapText(ctx, payload.shareBody, 600, 1180, 860, 34);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('ENTER THE MIRROR', 600, 1330);

  ctx.fillStyle = '#f4df9b';
  ctx.font = 'bold 34px Arial';
  ctx.fillText(SITE_URL, 600, 1380);

  return canvasToBlob(canvas);
}

export default function HarmonyShareCard({ scores, normalized, tier, stats }) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [shareBusy, setShareBusy] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const topStrengths = useMemo(() => sortScores(scores, 'desc').slice(0, 3), [scores]);
  const growthAreas = useMemo(() => sortScores(scores, 'asc').slice(0, 3), [scores]);
  const standoutMetrics = useMemo(
    () => sortScores(scores, 'desc').filter((entry) => entry.val >= CATEGORY_APPRECIATION_THRESHOLD),
    [scores]
  );
  
  const personalBests = stats?.harmonyHighestByMetric || {};
  const personalBestOverall = stats?.harmonyHighestOverall || 0;
  
  const newPersonalBestMetrics = useMemo(
    () => sortScores(scores, 'desc').filter((entry) => entry.val > (personalBests[entry.key] || 0)),
    [scores, personalBests]
  );
  const isNewPersonalBestOverall = normalized > personalBestOverall;
  
  const translatedTier = translateHarmonyTier(t, tier);
  const translatedTierDesc = translateHarmonyTierDesc(t, tier);
  const topMetric = topStrengths[0];
  
  const grandAppreciation = normalized >= GRAND_APPRECIATION_THRESHOLD || tier === 'ETHEREAL HARMONY' || isNewPersonalBestOverall;
  const hasMetricAppreciation = !grandAppreciation && (standoutMetrics.length > 0 || newPersonalBestMetrics.length > 0);
  const appreciationEnabled = grandAppreciation || hasMetricAppreciation;

  const getScoreColor = (value) => {
    if (value >= 90) return '#00ff88';
    if (value >= 85) return '#d4ff00';
    if (value >= 75) return '#ffd700';
    return '#ff7b7b';
  };

  const appreciationPayload = useMemo(() => {
    if (!appreciationEnabled) return null;

    if (grandAppreciation) {
      let headline = 'Supreme Harmony Witnessed';
      let subline = `Your full facial harmony has crossed the highest gate with a ${normalized.toFixed(1)}/100 total.`;
      
      if (isNewPersonalBestOverall) {
        headline = 'New Personal Best: Total Harmony';
        subline = personalBestOverall > 0 
          ? `You've shattered your previous best of ${personalBestOverall.toFixed(1)}/100 with a new total of ${normalized.toFixed(1)}/100!`
          : `Your first Mukha Darshan sets a new personal record at ${normalized.toFixed(1)}/100!`;
      }
      
      return {
        cardHeadline: headline,
        cardSubline: subline,
        badgeLabel: translatedTier,
        primaryValue: normalized.toFixed(1),
        primarySuffix: '/100 OVERALL',
        metricLine: topMetric
          ? `Dominant signal: ${translateHarmonyMetric(t, topMetric.key)} ${topMetric.val.toFixed(1)}`
          : `Tier achieved: ${translatedTier}`,
        shareBody: translatedTierDesc,
        shareTitle: `Supreme Mukha Darshan ${normalized.toFixed(1)}/100`,
        fileName: `saptamukha-supreme-harmony-${Math.round(normalized)}.png`,
        scoreColor: '#00ff88',
        kind: 'grand',
      };
    }

    // Combine standout metrics (>=85) and new personal best metrics
    const allAppreciatedMetrics = [...newPersonalBestMetrics, ...standoutMetrics];
    // Remove duplicates
    const uniqueMetrics = [];
    const seenKeys = new Set();
    for (const metric of allAppreciatedMetrics) {
      if (!seenKeys.has(metric.key)) {
        seenKeys.add(metric.key);
        uniqueMetrics.push(metric);
      }
    }
    uniqueMetrics.sort((a, b) => b.val - a.val);
    
    const featuredMetric = uniqueMetrics[0];
    const featuredMetricLabel = translateHarmonyMetric(t, featuredMetric.key);
    
    const isFeaturedNewPB = newPersonalBestMetrics.some(m => m.key === featuredMetric.key);
    const previousBest = personalBests[featuredMetric.key] || 0;
    
    let headline, subline, badgeLabel;
    if (isFeaturedNewPB) {
      headline = `${featuredMetricLabel} Has Been Unleashed`;
      subline = previousBest > 0
        ? `You've crushed your old ${featuredMetricLabel.toLowerCase()} best (${previousBest.toFixed(1)}) with a new personal record of ${featuredMetric.val.toFixed(1)}/100!`
        : `Your first scan sets a new personal best for ${featuredMetricLabel.toLowerCase()} at ${featuredMetric.val.toFixed(1)}/100!`;
      badgeLabel = `Personal Best${uniqueMetrics.length > 1 ? ` +${uniqueMetrics.length - 1}` : ''}`;
    } else {
      headline = `${featuredMetricLabel} Breached The High Gate`;
      subline = `Your ${featuredMetricLabel.toLowerCase()} entered the rare appreciation band at ${featuredMetric.val.toFixed(1)}/100.`;
      badgeLabel = `Category Excellence${uniqueMetrics.length > 1 ? ` +${uniqueMetrics.length - 1}` : ''}`;
    }
    
    return {
      cardHeadline: headline,
      cardSubline: subline,
      badgeLabel: badgeLabel,
      primaryValue: featuredMetric.val.toFixed(1),
      primarySuffix: `/100 ${featuredMetricLabel.toUpperCase()}`,
      metricLine: uniqueMetrics.length > 1
        ? `Other highlights: ${uniqueMetrics.slice(1, 3).map((entry) => `${translateHarmonyMetric(t, entry.key)} ${entry.val.toFixed(1)}`).join(' • ')}`
        : `Overall harmony: ${normalized.toFixed(1)}/100`,
      shareBody: 'A rare category threshold has been crossed inside Mukha Darshan.',
      shareTitle: `${featuredMetricLabel} appreciation ${featuredMetric.val.toFixed(1)}/100`,
      fileName: `saptamukha-${featuredMetric.key}-${Math.round(featuredMetric.val)}.png`,
      scoreColor: getScoreColor(featuredMetric.val),
      kind: 'category',
    };
  }, [
    appreciationEnabled,
    grandAppreciation,
    normalized,
    translatedTier,
    translatedTierDesc,
    standoutMetrics,
    newPersonalBestMetrics,
    isNewPersonalBestOverall,
    personalBests,
    personalBestOverall,
    topMetric,
    t,
  ]);

  const generateShareText = () => {
    const strengths = topStrengths;
    const improvements = growthAreas;

    let text = `${t('harmony.share.text_title', { score: normalized })}\n`;
    text += `🏆 ${translatedTier}\n\n`;
    text += `${t('harmony.share.text_strengths')}\n`;
    strengths.forEach((s) => {
      text += `• ${translateHarmonyMetric(t, s.key)}: ${s.val.toFixed(1)}\n`;
    });
    text += `\n${t('harmony.share.text_focus')}\n`;
    improvements.forEach((s) => {
      text += `• ${translateHarmonyMetric(t, s.key)}: ${s.val.toFixed(1)}\n`;
    });
    text += `\n${t('harmony.share.text_cta')}`;
    return text;
  };

  const fallbackCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextShare = async () => {
    const shareText = generateShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: t('share.text.harmony_title'),
          text: shareText,
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          fallbackCopy(shareText);
        }
      }
    } else {
      fallbackCopy(shareText);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(SITE_URL);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const createShareFile = async () => {
    if (!appreciationPayload) return null;
    const blob = await generateAppreciationCardImage(appreciationPayload);
    if (!blob) return null;
    return new File([blob], appreciationPayload.fileName, { type: 'image/png' });
  };

  const handleShareCard = async () => {
    if (!appreciationPayload || shareBusy) return;
    setShareBusy(true);
    try {
      const file = await createShareFile();
      if (
        file &&
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          title: appreciationPayload.shareTitle,
          text: `${appreciationPayload.cardHeadline}\n${SITE_URL}`,
          files: [file],
        });
      } else {
        await handleDownloadCard();
      }
    } catch (err) {
      if (err?.name !== 'AbortError') {
        await handleDownloadCard();
      }
    } finally {
      setShareBusy(false);
    }
  };

  const handleDownloadCard = async () => {
    if (!appreciationPayload || downloadBusy) return;
    setDownloadBusy(true);
    try {
      const blob = await generateAppreciationCardImage(appreciationPayload);
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = appreciationPayload.fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloadBusy(false);
    }
  };

  if (!scores) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8 pt-6 border-t border-[#1f1f25]"
    >
      {appreciationPayload && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mb-6 rounded-[28px] border border-[#7f5af0]/30 overflow-hidden shadow-[0_0_60px_rgba(127,90,240,0.16)]"
        >
          <div className="relative bg-[radial-gradient(circle_at_top_left,_rgba(127,90,240,0.35),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,84,84,0.20),_transparent_28%),linear-gradient(135deg,_#05030b_0%,_#100814_45%,_#1c0812_100%)] px-6 py-8">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute inset-[20px] border border-[#7f5af0]/20 rounded-[24px]" />
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[65%] aspect-square rounded-full border border-[#7f5af0]/15" />
              <div className="absolute top-[21%] left-1/2 -translate-x-1/2 w-[50%] aspect-square rounded-full border border-[#7f5af0]/10" />
              <div className="absolute top-[13%] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[90px] border-l-transparent border-r-[90px] border-r-transparent border-b-[170px] border-b-[#7f5af0]/10" />
            </div>

            <div className="relative text-center max-w-2xl mx-auto">
              <div className="text-[11px] text-[#9d7fe3] uppercase tracking-[0.28em] font-mono mb-3">
                MUKHA DARSHAN APPRECIATION
              </div>
              <h3 className="text-[28px] md:text-[38px] font-display text-[#f3e7ff] leading-tight mb-3">
                {appreciationPayload.cardHeadline}
              </h3>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7f5af0]/35 bg-[#7f5af0]/10 text-[#f4df9b] text-[11px] uppercase tracking-[0.22em] font-mono mb-5">
                <span className="w-2 h-2 rounded-full bg-[#ff5454] shadow-[0_0_10px_#ff5454]" />
                <span>{appreciationPayload.badgeLabel}</span>
              </div>

              <div
                className="text-[60px] md:text-[86px] font-display leading-none tabular-nums"
                style={{
                  color: appreciationPayload.scoreColor,
                  textShadow: `0 0 35px ${appreciationPayload.scoreColor}66`,
                }}
              >
                {appreciationPayload.primaryValue}
              </div>
              <div className="text-[13px] text-[#7a5fcf] font-mono uppercase tracking-[0.24em] mt-2">
                {appreciationPayload.primarySuffix}
              </div>

              <p className="mt-5 text-[14px] text-[#d4b8ff] leading-relaxed max-w-xl mx-auto">
                {appreciationPayload.cardSubline}
              </p>
              <p className="mt-4 text-[12px] text-[#f4df9b] font-mono uppercase tracking-[0.14em] leading-relaxed">
                {appreciationPayload.metricLine}
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={handleShareCard}
                  className="px-5 py-2 rounded-lg text-[11px] font-mono uppercase tracking-[0.18em] bg-[#7f5af0] text-white hover:bg-[#6a48eb] transition-colors"
                >
                  {shareBusy ? 'PREPARING...' : 'SHARE CARD IMAGE'}
                </button>
                <button
                  onClick={handleDownloadCard}
                  className="px-5 py-2 rounded-lg text-[11px] font-mono uppercase tracking-[0.18em] border border-[#7f5af0]/35 text-[#d4b8ff] hover:bg-[#7f5af0]/12 transition-colors"
                >
                  {downloadBusy ? 'RENDERING...' : 'DOWNLOAD PNG'}
                </button>
                <button
                  onClick={handleCopyLink}
                  className="px-5 py-2 rounded-lg text-[11px] font-mono uppercase tracking-[0.18em] border border-[#ffcf66]/30 text-[#f4df9b] hover:bg-[#ffcf66]/10 transition-colors"
                >
                  {linkCopied ? 'LINK COPIED' : 'COPY WEBSITE LINK'}
                </button>
              </div>

              <div className="mt-6 text-[11px] text-[#f4df9b] font-mono uppercase tracking-[0.14em]">
                SHARE THE MIRROR: {SITE_URL}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-gradient-to-r from-[#0a0a0f] to-[#0d0d14] rounded-lg p-5 border border-[#1f1f25]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[13px] font-mono text-[#d4b8ff] uppercase tracking-wider">
            {t('harmony.share.title')}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleTextShare}
              className="px-4 py-1.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#7f5af0]/20 text-[#d4b8ff] hover:bg-[#7f5af0]/40 transition-all duration-300 border border-[#7f5af0]/30"
            >
              {copied ? t('harmony.share.copied') : t('harmony.share.button')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-[9px] text-[#5a3fcf] uppercase tracking-wider font-mono mb-1">
              {t('harmony.share.top_strength')}
            </div>
            <div className="text-[11px] text-[#d4b8ff] font-mono">
              {topStrengths[0] ? translateHarmonyMetric(t, topStrengths[0].key) : '—'}
            </div>
            <div className="text-[16px] font-display text-[#00ff88]">
              {topStrengths[0] ? topStrengths[0].val.toFixed(1) : '—'}
            </div>
          </div>
          <div>
            <div className="text-[9px] text-[#5a3fcf] uppercase tracking-wider font-mono mb-1">
              {t('harmony.share.growth_area')}
            </div>
            <div className="text-[11px] text-[#d4b8ff] font-mono">
              {growthAreas[0] ? translateHarmonyMetric(t, growthAreas[0].key) : '—'}
            </div>
            <div className="text-[16px] font-display text-[#ffaa33]">
              {growthAreas[0] ? growthAreas[0].val.toFixed(1) : '—'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-[#1f1f25]/50">
          <div>
            <div className="text-[8px] text-[#5a3fcf] uppercase tracking-wider font-mono mb-1">
              {t('harmony.share.second_strength')}
            </div>
            <div className="text-[10px] text-[#9d7fe3] font-mono">
              {topStrengths[1] ? translateHarmonyMetric(t, topStrengths[1].key) : '—'}
            </div>
            <div className="text-[12px] text-[#a0ff00]">
              {topStrengths[1] ? topStrengths[1].val.toFixed(1) : '—'}
            </div>
          </div>
          <div>
            <div className="text-[8px] text-[#5a3fcf] uppercase tracking-wider font-mono mb-1">
              {t('harmony.share.second_focus')}
            </div>
            <div className="text-[10px] text-[#9d7fe3] font-mono">
              {growthAreas[1] ? translateHarmonyMetric(t, growthAreas[1].key) : '—'}
            </div>
            <div className="text-[12px] text-[#ffaa66]">
              {growthAreas[1] ? growthAreas[1].val.toFixed(1) : '—'}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1f1f25]">
          <p className="text-[10px] text-[#7a5fcf] font-mono text-center leading-relaxed">
            {translateHarmonyTierDesc(t, tier)}
          </p>
        </div>

        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-2 text-[8px] text-[#5a3fcf] font-mono uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#ff5454]" />
            <span>{t('harmony.share.legend.developing')}</span>
            <span className="w-2 h-2 rounded-full bg-[#ffaa33]" />
            <span>{t('harmony.share.legend.natural')}</span>
            <span className="w-2 h-2 rounded-full bg-[#ffd700]" />
            <span>{t('harmony.share.legend.balanced')}</span>
            <span className="w-2 h-2 rounded-full bg-[#a0ff00]" />
            <span>{t('harmony.share.legend.harmonious')}</span>
            <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
            <span>{t('harmony.share.legend.exceptional')}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
