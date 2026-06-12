const LOCAL_INDEX_ENABLED = import.meta.env.VITE_ENABLE_LOCAL_CELEBRITY_INDEX === 'true';
const LOCAL_INDEX_PATH = import.meta.env.VITE_LOCAL_REFERENCE_INDEX_PATH || '/reference-index.json';
let celebritiesData = null;

export function isCelebrityMatchingEnabled() {
  return LOCAL_INDEX_ENABLED;
}

export async function loadCelebrityData() {
  if (!LOCAL_INDEX_ENABLED) return;
  if (celebritiesData) return;
  const res = await fetch(LOCAL_INDEX_PATH);
  if (!res.ok) throw new Error('Failed to load local reference index');
  celebritiesData = await res.json();
}

/**
 * Find top N celebrity matches using cosine similarity.
 * @param {number[]} queryEmbedding - embedding float array
 * @param {number} topN - how many matches to return
 * @returns {Array} sorted matches with { name, imageUrl, similarity, label }
 */
export function findCelebrityMatches(queryEmbedding, topN = 3) {
  if (!LOCAL_INDEX_ENABLED) {
    return [];
  }
  if (!celebritiesData?.celebrities?.length) {
    return [];
  }
  const queryVec = new Float32Array(queryEmbedding);

  const scored = celebritiesData.celebrities.map(celeb => {
    const celebVec = new Float32Array(celeb.descriptor);
    const similarity = cosineSimilarity(queryVec, celebVec);
    let label = 'Faint Soul Echo';
    if (similarity > 0.85) label = 'Almost Identical Twin';
    else if (similarity > 0.70) label = 'Soul Twin Detected';
    else if (similarity > 0.55) label = 'Faint Soul Echo';

    return {
      ...celeb,
      similarity,
      similarityPct: Math.round(similarity * 100 * 10) / 10,
      label,
    };
  });

  return scored
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN)
    .filter(m => m.similarity > 0.55);
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}
