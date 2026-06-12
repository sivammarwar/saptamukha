import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { translateHarmonyMetric } from '../../lib/i18nHelpers';

const METRIC_ORDER = [
  'symmetry', 'facialThirds', 'eyeSpacing', 'canthalTilt',
  'jawline', 'noseHarmony', 'lipRatio', 'fwhr',
  'profileHarmony', 'structuralHarmony',
];

export default function HarmonyPlatformStats({ stats }) {
  const { t } = useLanguage();
  if (!stats) return null;

  const highs = stats.harmonyHighestByMetric || {};
  const metricsWithScores = METRIC_ORDER.filter((k) => highs[k] > 0);

  return (
    <div className="mb-8 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard label={t('harmony.stats.total')} value={stats.harmonyScansTotal} />
        <StatCard label={t('harmony.stats.today')} value={stats.harmonyScansToday} />
        <StatCard
          label={t('harmony.stats.highest_overall')}
          value={stats.harmonyHighestOverall > 0 ? stats.harmonyHighestOverall.toFixed(1) : '—'}
          accent
        />
      </div>

      {metricsWithScores.length > 0 && (
        <div className="bg-[#101017] border border-[#1f1f25] rounded-xl p-4">
          <div className="text-[10px] text-[#5a3fcf] uppercase tracking-[0.18em] font-mono mb-3 text-center">
            {t('harmony.stats.highest_category')}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {metricsWithScores.map((key) => (
              <div
                key={key}
                className="flex items-center justify-between gap-2 text-[11px] font-mono bg-[#0d0821] border border-[#2a2a2a] rounded-lg px-3 py-2"
              >
                <span className="text-[#9d7fe3] truncate">{translateHarmonyMetric(t, key)}</span>
                <span className="text-[#00ff88] shrink-0">{Number(highs[key]).toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent = false }) {
  return (
    <div className="bg-[#101017] border border-[#1f1f25] rounded-xl p-4 text-center">
      <div className="text-[10px] text-[#5a3fcf] uppercase tracking-[0.15em] font-mono mb-1">{label}</div>
      <div className={`text-xl font-mono ${accent ? 'text-[#00ff88]' : 'text-[#d4b8ff]'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
    </div>
  );
}
