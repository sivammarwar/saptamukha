// services/analyzeService.js

const FACE_API_BASE_URL =
  import.meta.env.VITE_FACE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_EMBED_SERVICE_URL ||
  (import.meta.env.DEV ? 'http://localhost:8000' : '/api/vision');
const EMBED_API_KEY = import.meta.env.VITE_EMBED_API_KEY || '';

// ═══════════════════════════════════════════════════════════════════════════
// SCIENTIFIC HARMONY SCORE CALCULATION
// Uses raw scores from backend to ensure distinct results for different faces
// ═══════════════════════════════════════════════════════════════════════════

// Scientific weights based on peer-reviewed facial attractiveness research
const SCIENTIFIC_WEIGHTS = {
  symmetry: 0.18,        // 18% - Most important factor
  facialThirds: 0.12,    // 12% - Equal thirds ratio
  eyeSpacing: 0.10,      // 10% - Eye distance proportion
  canthalTilt: 0.08,     // 8%  - Eye angle (youth marker)
  jawline: 0.12,         // 12% - Lower face definition
  noseHarmony: 0.10,     // 10% - Nasal proportions
  lipRatio: 0.08,        // 8%  - Lip balance
  fwhr: 0.07,            // 7%  - Face width-to-height
  profileHarmony: 0.08,  // 8%  - Side profile balance
  structuralHarmony: 0.07 // 7% - Golden ratio adherence
};

// Calculate weighted harmony score from individual metrics (uses raw scores)
function calculateHarmonyScoreFromMetrics(metrics) {
  let weightedSum = 0;
  let totalWeight = 0;
  const calculatedScores = {};
  
  for (const [metric, weight] of Object.entries(SCIENTIFIC_WEIGHTS)) {
    const rawValue = metrics[metric];
    
    // If metric doesn't exist, use a reasonable default
    if (rawValue === undefined || rawValue === null) {
      calculatedScores[metric] = 55; // Neutral default
      weightedSum += 55 * weight;
      totalWeight += weight;
      continue;
    }
    
    // Use raw score directly to keep distinct results
    const finalScore = Math.max(25, Math.min(98, rawValue));
    calculatedScores[metric] = finalScore;
    weightedSum += finalScore * weight;
    totalWeight += weight;
  }
  
  // Calculate overall score (normalized to 100)
  let overallScore = weightedSum / totalWeight;
  overallScore = Math.round(overallScore * 10) / 10;
  
  // Determine tier based on raw score thresholds
  let tier;
  if (overallScore >= 92) tier = "ETHEREAL HARMONY";
  else if (overallScore >= 85) tier = "EXCEPTIONAL";
  else if (overallScore >= 77) tier = "DISTINGUISHED";
  else if (overallScore >= 68) tier = "HARMONIOUS";
  else if (overallScore >= 58) tier = "BALANCED";
  else if (overallScore >= 48) tier = "NATURAL";
  else if (overallScore >= 38) tier = "DEVELOPING";
  else tier = "UNIQUE CHARACTER";
  
  return {
    scores: calculatedScores,
    normalized_overall: overallScore,
    tier: tier
  };
}

// Transform batch response to use raw scores directly
function transformBatchResponse(response) {
  if (!response || response.status === 'partial') {
    return response;
  }
  
  // If response has scores directly (some backends)
  if (response.scores) {
    const transformed = calculateHarmonyScoreFromMetrics(response.scores);
    return {
      ...response,
      ...transformed
    };
  }
  
  return response;
}

function getTierFromScore(score) {
  if (score >= 92) return "ETHEREAL HARMONY";
  if (score >= 85) return "EXCEPTIONAL";
  if (score >= 77) return "DISTINGUISHED";
  if (score >= 68) return "HARMONIOUS";
  if (score >= 58) return "BALANCED";
  if (score >= 48) return "NATURAL";
  if (score >= 38) return "DEVELOPING";
  return "UNIQUE CHARACTER";
}

// ═══════════════════════════════════════════════════════════════════════════
// ORIGINAL FUNCTIONS (KEPT INTACT - only added transformation)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Send an image for facial harmony analysis.
 * @param {Blob} blob — image blob (JPEG/PNG)
 * @param {string} viewType — "front" | "left" | "right"
 */
export async function analyzeImage(blob, viewType = 'front') {
  const form = new FormData();
  form.append('file', blob, 'scan.jpg');
  form.append('view_type', viewType);

  const headers = {};
  if (EMBED_API_KEY) headers['X-API-Key'] = EMBED_API_KEY;

  const res = await fetch(`${FACE_API_BASE_URL}/analyze`, {
    method: 'POST',
    headers,
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw err;
  }

  const data = await res.json();
  
  // Transform the response to realistic scores while keeping all original data
  return transformBatchResponse(data);
}

export async function analyzeImageBatch({ front, left, right }) {
  if (!front || !left || !right) {
    throw new Error('front, left, and right images are required');
  }

  const form = new FormData();
  form.append('front_image', front, 'front.jpg');
  form.append('left_image', left, 'left.jpg');
  form.append('right_image', right, 'right.jpg');

  const headers = {};
  if (EMBED_API_KEY) headers['X-API-Key'] = EMBED_API_KEY;

  const res = await fetch(`${FACE_API_BASE_URL}/analyze-batch`, {
    method: 'POST',
    headers,
    body: form,
  });

  const data = await res.json().catch(() => ({}));

  // 422 or network errors → throw
  if (!res.ok) {
    throw data;
  }

  // For partial status, preserve the original response (twin detection logic intact)
  if (data.status === 'partial') {
    return data;
  }

  // Transform successful responses to realistic scores
  return transformBatchResponse(data);
}
