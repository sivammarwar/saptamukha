-- SAPTAMUKHA v7.0 — multi-member twin groups at 90%+ similarity

CREATE UNIQUE INDEX IF NOT EXISTS idx_match_links_pair_canonical
ON match_links (LEAST(soul_a, soul_b), GREATEST(soul_a, soul_b));

CREATE OR REPLACE FUNCTION find_twin_candidates(
  query_descriptor vector(512),
  min_similarity_pct FLOAT DEFAULT 90,
  max_results INT DEFAULT 25
)
RETURNS TABLE (
  soul_id UUID,
  name TEXT,
  age INTEGER,
  country TEXT,
  email TEXT,
  instagram TEXT,
  other_social TEXT,
  twin_message TEXT,
  image_url TEXT,
  father_name TEXT,
  mother_name TEXT,
  cosine_distance FLOAT,
  similarity_pct FLOAT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    s.id AS soul_id,
    s.name,
    s.age,
    s.country,
    s.email,
    s.instagram,
    s.other_social,
    s.twin_message,
    s.image_url,
    s.father_name,
    s.mother_name,
    (fe.embedding <=> query_descriptor) AS cosine_distance,
    ROUND(CAST((1 - (fe.embedding <=> query_descriptor)) * 100 AS NUMERIC), 1) AS similarity_pct,
    s.created_at
  FROM face_embeddings fe
  JOIN souls s ON s.id = fe.soul_id
  WHERE ROUND(CAST((1 - (fe.embedding <=> query_descriptor)) * 100 AS NUMERIC), 1) >= min_similarity_pct
  ORDER BY cosine_distance ASC
  LIMIT max_results;
$$;

CREATE OR REPLACE FUNCTION get_match_group(root_soul_id UUID)
RETURNS TABLE (
  soul_id UUID,
  name TEXT,
  age INTEGER,
  country TEXT,
  email TEXT,
  instagram TEXT,
  other_social TEXT,
  twin_message TEXT,
  image_url TEXT,
  rarity_score INTEGER,
  rarity_tier TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
AS $$
  WITH RECURSIVE connected AS (
    SELECT root_soul_id AS soul_id
    UNION
    SELECT
      CASE
        WHEN ml.soul_a = c.soul_id THEN ml.soul_b
        ELSE ml.soul_a
      END AS soul_id
    FROM connected c
    JOIN match_links ml
      ON ml.similarity_pct >= 90
     AND (ml.soul_a = c.soul_id OR ml.soul_b = c.soul_id)
  )
  SELECT
    s.id AS soul_id,
    s.name,
    s.age,
    s.country,
    s.email,
    s.instagram,
    s.other_social,
    s.twin_message,
    s.image_url,
    s.rarity_score,
    s.rarity_tier,
    s.created_at
  FROM connected c
  JOIN souls s ON s.id = c.soul_id
  ORDER BY s.created_at ASC;
$$;

CREATE OR REPLACE FUNCTION link_soul_group(
  p_new_soul_id UUID,
  p_primary_match_id UUID DEFAULT NULL,
  p_direct_matches JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  match_record JSONB;
  existing_id UUID;
  similarity FLOAT;
  canonical_a UUID;
  canonical_b UUID;
BEGIN
  UPDATE souls
  SET
    has_match = TRUE,
    matched_soul_id = COALESCE(matched_soul_id, p_primary_match_id),
    last_searched_at = NOW()
  WHERE id = p_new_soul_id;

  FOR match_record IN
    SELECT value FROM jsonb_array_elements(COALESCE(p_direct_matches, '[]'::jsonb))
  LOOP
    existing_id := NULLIF(match_record->>'soul_id', '')::UUID;
    similarity := COALESCE(NULLIF(match_record->>'similarity_pct', '')::FLOAT, 0);

    IF existing_id IS NULL OR existing_id = p_new_soul_id THEN
      CONTINUE;
    END IF;

    canonical_a := LEAST(p_new_soul_id, existing_id);
    canonical_b := GREATEST(p_new_soul_id, existing_id);

    INSERT INTO match_links (soul_a, soul_b, similarity_pct)
    SELECT canonical_a, canonical_b, similarity
    WHERE NOT EXISTS (
      SELECT 1
      FROM match_links
      WHERE soul_a = canonical_a
        AND soul_b = canonical_b
    );

    UPDATE souls
    SET
      has_match = TRUE,
      matched_soul_id = COALESCE(matched_soul_id, p_new_soul_id),
      last_searched_at = NOW()
    WHERE id = existing_id;
  END LOOP;

  RETURN jsonb_build_object('ok', TRUE);
END;
$$;

CREATE OR REPLACE FUNCTION update_soul_contact(
  p_soul_id UUID,
  p_email TEXT
)
RETURNS TABLE (
  id UUID,
  email TEXT,
  last_searched_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE souls
  SET
    email = p_email,
    last_searched_at = NOW()
  WHERE souls.id = p_soul_id
  RETURNING souls.id, souls.email, souls.last_searched_at;
END;
$$;

CREATE OR REPLACE FUNCTION update_soul_social_links(
  p_soul_id UUID,
  p_instagram TEXT DEFAULT NULL,
  p_other_social TEXT DEFAULT NULL,
  p_twin_message TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  instagram TEXT,
  other_social TEXT,
  twin_message TEXT,
  last_searched_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  UPDATE souls
  SET
    instagram = p_instagram,
    other_social = p_other_social,
    twin_message = p_twin_message,
    last_searched_at = NOW()
  WHERE souls.id = p_soul_id
  RETURNING souls.id, souls.instagram, souls.other_social, souls.twin_message, souls.last_searched_at;
END;
$$;

GRANT EXECUTE ON FUNCTION find_twin_candidates(vector(512), FLOAT, INT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_match_group(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION link_soul_group(UUID, UUID, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_soul_contact(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION update_soul_social_links(UUID, TEXT, TEXT, TEXT) TO anon, authenticated;
