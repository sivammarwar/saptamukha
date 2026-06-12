/** Map backend harmony tier names to translation keys */
const HARMONY_TIER_KEYS = {
  'ETHEREAL HARMONY': 'harmony.tier.ethereal',
  'EXCEPTIONAL': 'harmony.tier.exceptional',
  'DISTINGUISHED': 'harmony.tier.distinguished',
  'HARMONIOUS': 'harmony.tier.harmonious',
  'BALANCED': 'harmony.tier.balanced',
  'NATURAL': 'harmony.tier.natural',
  'DEVELOPING': 'harmony.tier.developing',
  'UNIQUE CHARACTER': 'harmony.tier.unique',
};

const HARMONY_TIER_DESC_KEYS = {
  'ETHEREAL HARMONY': 'harmony.tier.desc.ethereal',
  'EXCEPTIONAL': 'harmony.tier.desc.exceptional',
  'DISTINGUISHED': 'harmony.tier.desc.distinguished',
  'HARMONIOUS': 'harmony.tier.desc.harmonious',
  'BALANCED': 'harmony.tier.desc.balanced',
  'NATURAL': 'harmony.tier.desc.natural',
  'DEVELOPING': 'harmony.tier.desc.developing',
  'UNIQUE CHARACTER': 'harmony.tier.desc.unique',
};

const RARITY_TIER_KEYS = {
  'The Common Soul': 'rarity.tier.common',
  'The Familiar Face': 'rarity.tier.familiar',
  'The Rare Soul': 'rarity.tier.rare',
  'The Ancient Geometry': 'rarity.tier.ancient',
  'The Unrepeated': 'rarity.tier.unrepeated',
};

const HARMONY_METRIC_KEYS = [
  'symmetry', 'facialThirds', 'eyeSpacing', 'canthalTilt',
  'jawline', 'noseHarmony', 'lipRatio', 'fwhr',
  'profileHarmony', 'structuralHarmony',
];

export function translateHarmonyTier(t, tier) {
  const key = HARMONY_TIER_KEYS[tier];
  return key ? t(key) : tier;
}

export function translateHarmonyTierDesc(t, tier) {
  const key = HARMONY_TIER_DESC_KEYS[tier];
  return key ? t(key) : t('harmony.tier.desc.default');
}

export function translateRarityTier(t, tier) {
  const key = RARITY_TIER_KEYS[tier];
  return key ? t(key) : tier;
}

export function translateHarmonyMetric(t, metricKey) {
  const key = `harmony.metric.${metricKey}`;
  const translated = t(key);
  return translated !== key ? translated : metricKey;
}

export function translateViewLabel(t, viewType) {
  return t(`harmony.view.${viewType}.label`);
}

/** Convert {gold}highlighted{/gold} markup to HTML for dangerouslySetInnerHTML */
export function goldMarkupToHtml(text, className = 'text-tantrik-gold') {
  return text.replace(
    /\{gold\}(.*?)\{\/gold\}/g,
    `<span class="${className}">$1</span>`
  );
}

export function getOverlayLabels(t) {
  return {
    locked: t('overlay.locked'),
    tracking: t('overlay.tracking'),
    align: t('overlay.align'),
    biometricScan: t('overlay.biometric_scan'),
    landmarks: t('overlay.landmarks'),
    symmetry: t('overlay.symmetry'),
    confidence: t('overlay.confidence'),
    trackingLabel: t('overlay.tracking_label'),
    faceArea: t('overlay.face_area'),
    depth: t('overlay.depth'),
    lockAcquired: t('overlay.lock_acquired'),
    scanningHold: t('overlay.scanning_hold'),
    aligning: t('overlay.aligning'),
  };
}
