import { supabase } from './supabase';

/** Marketing baselines — real user counts are added on top */
export const FAKE_BASELINES = {
  soulsInMirror: 107981,
  waitingForTwin: 107108,
  matchedPairs: 436, // You can control this fake baseline too!
  soulScansToday: 4532,
  soulScansOverall: 109727,
};

const EMPTY_REAL = {
  real_souls: 0,
  real_waiting: 0,
  real_matched_pairs: 0,
  soul_scans_today: 0,
  soul_scans_total: 0,
  harmony_scans_today: 0,
  harmony_scans_total: 0,
  harmony_highest_overall: 0,
  harmony_highest_by_metric: {},
};

export function applyFakeBaselines(real = EMPTY_REAL) {
  return {
    soulsInMirror: FAKE_BASELINES.soulsInMirror + (real.real_souls || 0),
    waitingForTwin: FAKE_BASELINES.waitingForTwin + (real.real_waiting || 0),
    matchedPairs: FAKE_BASELINES.matchedPairs + (real.real_matched_pairs || 0),
    soulScansToday: FAKE_BASELINES.soulScansToday + (real.soul_scans_today || 0),
    soulScansOverall: FAKE_BASELINES.soulScansOverall + (real.soul_scans_total || 0),
    harmonyScansToday: real.harmony_scans_today || 0,
    harmonyScansTotal: real.harmony_scans_total || 0,
    harmonyHighestOverall: real.harmony_highest_overall || 0,
    harmonyHighestByMetric: real.harmony_highest_by_metric || {},
  };
}

export async function fetchPlatformStats() {
  try {
    const { data, error } = await supabase.rpc('get_platform_stats');
    if (error) throw error;
    return applyFakeBaselines(data || EMPTY_REAL);
  } catch (err) {
    console.warn('Platform stats unavailable, using baselines only:', err?.message);
    return applyFakeBaselines(EMPTY_REAL);
  }
}

export async function recordSoulScan() {
  try {
    const { error } = await supabase.rpc('record_soul_scan');
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Failed to record soul scan:', err?.message);
    return false;
  }
}

export async function recordHarmonyScan({ normalized_overall, tier, scores }) {
  try {
    const { error } = await supabase.rpc('record_harmony_scan', {
      p_overall: normalized_overall,
      p_tier: tier || null,
      p_scores: scores || {},
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.warn('Failed to record harmony scan:', err?.message);
    return false;
  }
}

export async function getTopHarmonyScorers() {
  try {
    const { data, error } = await supabase
      .from('top_harmony_scorers')
      .select('*')
      .order('score', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.warn('Failed to get top harmony scorers:', err?.message);
    return [];
  }
}

export async function submitTopHarmonyScorer({ name, username, country, avatar, score }) {
  try {
    // Upload avatar to Cloudinary if available
    let avatarUrl = null;
    if (avatar) {
      const { uploadImage } = await import('./cloudinary');
      const uploadResult = await uploadImage(avatar, 'saptamukha/top-scorers');
      avatarUrl = uploadResult.url;
    }

    const { data, error } = await supabase
      .from('top_harmony_scorers')
      .insert({
        name,
        username,
        country,
        avatar_url: avatarUrl,
        score,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Failed to submit top harmony scorer:', err?.message);
    throw err;
  }
}
