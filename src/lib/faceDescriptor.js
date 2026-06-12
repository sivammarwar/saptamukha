/**
 * Encode an embedding array to a format suitable for Supabase pgvector.
 * pgvector accepts array literal strings like '[1.2, 3.4, ...]'.
 */
export function encodeVector(embedding) {
  if (!Array.isArray(embedding) || !embedding.length) {
    throw new Error('Expected valid embedding array');
  }
  return JSON.stringify(embedding);
}

/**
 * Decode pgvector response (array of floats).
 */
export function decodeVector(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    // Handle string format from pgvector
    return JSON.parse(raw.replace(/\{(.+)\}/, '[$1]'));
  }
  return raw;
}
