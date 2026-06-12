import { supabase } from './supabase';
import { uploadImage } from './cloudinary';

const TWIN_MATCH_THRESHOLD = 90;

/**
 * Deduplication flow:
 * 1. Find all twin candidates at or above the 90% threshold
 * 2. If a candidate also matches parent names, treat it as a duplicate
 * 3. Otherwise save the new soul, link into the matched group, and notify everyone
 */
export async function runDedup({ embedding, intakeData, quality, image }) {
  // Step 1: Find all candidate twins by face
  const { data: candidates, error: rpcError } = await supabase.rpc('find_twin_candidates', {
    query_descriptor: embedding,
    min_similarity_pct: TWIN_MATCH_THRESHOLD,
    max_results: 25,
  });

  if (rpcError) {
    console.error('find_twin_candidates error:', rpcError);
  }

  const twinCandidates = (candidates || []).map((candidate) => ({
    ...candidate,
    parentMatch: hasParentOverlap(intakeData, candidate),
  }));

  const duplicateCandidate = twinCandidates.find((candidate) => candidate.parentMatch);
  const directMatches = twinCandidates.filter((candidate) => !candidate.parentMatch);

  // DUPLICATE: face match >= 90% AND parent names overlap
  if (duplicateCandidate) {
    // Fire duplicate email
    triggerEmail('duplicate', { soulId: duplicateCandidate.soul_id });
    return {
      type: 'duplicate',
      existingSoul: duplicateCandidate,
      similarity: duplicateCandidate.similarity_pct,
    };
  }

  // Calculate rarity before saving
  const { data: rarityData } = await supabase.rpc('calculate_rarity', {
    query_descriptor: embedding,
  });
  const rarityScore = rarityData?.[0]?.rarity_score ?? 50;
  const rarityTier = getRarityTier(rarityScore);

  // Upload image to Cloudinary if provided
  let imageUrl = null;
  if (image) {
    try {
      const uploadResult = await uploadImage(image, 'saptamukha/souls');
      imageUrl = uploadResult.url;
    } catch (err) {
      console.warn('Image upload failed, continuing without image:', err);
    }
  }

  // Save the new soul (needed for both real match and unique flows)
  const soul = await insertSoul({ intakeData, rarityScore, rarityTier, imageUrl });
  await insertEmbedding({ soulId: soul.id, embedding, quality });

  // REAL MATCH: one or more direct 90%+ matches with different parent names
  if (directMatches.length > 0) {
    await linkSoulGroup({
      newSoulId: soul.id,
      directMatches,
    });

    const matchGroup = await fetchMatchGroup(soul.id);
    const groupWithoutSelf = matchGroup
      .filter((member) => member.soul_id !== soul.id)
      .map((member) => ({
        ...member,
        similarity_pct: directMatches.find((candidate) => candidate.soul_id === member.soul_id)?.similarity_pct ?? null,
      }));

    await triggerEmail('twin_found', {
      soulIds: [soul.id, ...groupWithoutSelf.map((member) => member.soul_id)],
      newSoulId: soul.id,
      directMatches: directMatches.map(({ soul_id, similarity_pct }) => ({
        soulId: soul_id,
        similarityPct: similarity_pct,
      })),
    });

    const bestDirectMatch = directMatches[0];
    const legacyMatchedSoul = groupWithoutSelf.find((member) => member.soul_id === bestDirectMatch?.soul_id) || groupWithoutSelf[0];

    return {
      type: 'match',
      soul: { ...soul, rarity_score: rarityScore, rarity_tier: rarityTier },
      matchedSoul: legacyMatchedSoul,
      matchedSouls: groupWithoutSelf,
      similarity: bestDirectMatch?.similarity_pct ?? 0,
    };
  }

  // UNIQUE: no face match above 90%
  triggerEmail('sealed', { soulId: soul.id });
  return {
    type: 'unique',
    soul: { ...soul, rarity_score: rarityScore, rarity_tier: rarityTier },
    similarity: 0,
  };
}

async function triggerEmail(type, payload) {
  try {
    await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-notification`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ type, ...payload }),
      }
    );
  } catch (e) {
    console.error(`Email (${type}) failed:`, e);
  }
}

async function insertSoul({ intakeData, rarityScore, rarityTier, imageUrl }) {
  const { data, error } = await supabase
    .from('souls')
    .insert({
      name: intakeData.name,
      age: intakeData.age,
      country: intakeData.country,
      email: intakeData.email,
      father_name: intakeData.fatherName,
      mother_name: intakeData.motherName,
      rarity_score: rarityScore,
      rarity_tier: rarityTier,
      has_match: false,
      image_url: imageUrl,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Failed to save soul:', error);
    throw new Error('save_failed');
  }
  return data;
}

async function insertEmbedding({ soulId, embedding, quality }) {
  const { error } = await supabase
    .from('face_embeddings')
    .insert({
      soul_id: soulId,
      embedding: embedding,
      quality_score: quality,
    });
  if (error) console.error('Failed to save embedding:', error);
}

export function getRarityTier(score) {
  if (score <= 20) return 'The Common Soul';
  if (score <= 40) return 'The Familiar Face';
  if (score <= 60) return 'The Rare Soul';
  if (score <= 80) return 'The Ancient Geometry';
  return 'The Unrepeated';
}

function hasParentOverlap(intakeData, candidate) {
  const subFather = intakeData.fatherName.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const subMother = intakeData.motherName.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const exFather = (candidate.father_name || '').toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const exMother = (candidate.mother_name || '').toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  const fatherOverlap = subFather.some((w) => exFather.includes(w));
  const motherOverlap = subMother.some((w) => exMother.includes(w));
  return fatherOverlap && motherOverlap;
}

async function linkSoulGroup({ newSoulId, directMatches }) {
  const { error } = await supabase.rpc('link_soul_group', {
    p_new_soul_id: newSoulId,
    p_primary_match_id: directMatches[0]?.soul_id ?? null,
    p_direct_matches: directMatches.map(({ soul_id, similarity_pct }) => ({
      soul_id,
      similarity_pct,
    })),
  });

  if (error) {
    console.error('link_soul_group error:', error);
    throw new Error('match_link_failed');
  }
}

async function fetchMatchGroup(soulId) {
  const { data, error } = await supabase.rpc('get_match_group', {
    root_soul_id: soulId,
  });

  if (error) {
    console.error('get_match_group error:', error);
    throw new Error('match_group_failed');
  }

  return data || [];
}

export async function updateSoulEmail(soulId, newEmail) {
  const { data, error } = await supabase.rpc('update_soul_contact', {
    p_soul_id: soulId,
    p_email: newEmail,
  });
  if (error) throw error;
  return data?.[0];
}

export async function updateSoulSocials(soulId, { instagram, otherSocial, twinMessage }) {
  const { data, error } = await supabase.rpc('update_soul_social_links', {
    p_soul_id: soulId,
    p_instagram: instagram,
    p_other_social: otherSocial,
    p_twin_message: twinMessage,
  });
  if (error) throw error;
  return data?.[0];
}

export async function getSoulById(soulId) {
  const { data, error } = await supabase
    .from('souls')
    .select('*')
    .eq('id', soulId)
    .single();
  if (error) throw error;
  return data;
}
