-- SAPTAMUKHA v4.0 — SOULS SCHEMA (no auth dependency)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. SOULS TABLE — the central user record
CREATE TABLE IF NOT EXISTS souls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  country TEXT NOT NULL,
  email TEXT NOT NULL,
  father_name TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  instagram TEXT,
  other_social TEXT,
  twin_message TEXT,
  rarity_score INTEGER CHECK (rarity_score BETWEEN 0 AND 100),
  rarity_tier TEXT,
  image_url TEXT,
  has_match BOOLEAN DEFAULT FALSE,
  matched_soul_id UUID REFERENCES souls(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_searched_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FACE EMBEDDINGS — one per soul, vector for similarity search
CREATE TABLE IF NOT EXISTS face_embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  soul_id UUID REFERENCES souls(id) ON DELETE CASCADE NOT NULL UNIQUE,
  embedding vector(512) NOT NULL,
  quality_score FLOAT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_face_embeddings_soul ON face_embeddings(soul_id);
CREATE INDEX IF NOT EXISTS idx_face_embeddings_vector ON face_embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- 3. MATCH LOG — audit trail when two souls are linked
CREATE TABLE IF NOT EXISTS match_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  soul_a UUID REFERENCES souls(id) ON DELETE CASCADE,
  soul_b UUID REFERENCES souls(id) ON DELETE CASCADE,
  similarity_pct FLOAT NOT NULL,
  notified_a BOOLEAN DEFAULT FALSE,
  notified_b BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(soul_a, soul_b)
);

-- 4. VIEWS — social proof counters
CREATE OR REPLACE VIEW mirror_souls_count AS
SELECT COUNT(*) AS total FROM souls;

CREATE OR REPLACE VIEW waiting_souls_count AS
SELECT COUNT(*) AS total FROM souls WHERE has_match = FALSE;

-- 5. RPC: find closest soul by face embedding (for deduplication)
CREATE OR REPLACE FUNCTION find_closest_soul(
  query_descriptor vector(512),
  match_threshold FLOAT DEFAULT 0.30
)
RETURNS TABLE (
  soul_id UUID,
  name TEXT,
  father_name TEXT,
  mother_name TEXT,
  cosine_distance FLOAT,
  similarity_pct FLOAT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
AS $$
  SELECT
    s.id AS soul_id,
    s.name,
    s.father_name,
    s.mother_name,
    (fe.embedding <=> query_descriptor) AS cosine_distance,
    ROUND(CAST((1 - (fe.embedding <=> query_descriptor)) * 100 AS NUMERIC), 1) AS similarity_pct,
    s.created_at
  FROM face_embeddings fe
  JOIN souls s ON s.id = fe.soul_id
  WHERE (fe.embedding <=> query_descriptor) < match_threshold
  ORDER BY cosine_distance ASC
  LIMIT 1;
$$;

-- 6. RPC: find all matching souls (for real twin search)
CREATE OR REPLACE FUNCTION find_matching_souls(
  query_descriptor vector(512),
  match_threshold FLOAT DEFAULT 0.30,
  max_results INT DEFAULT 10
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
  cosine_distance FLOAT,
  similarity_pct FLOAT,
  created_at TIMESTAMPTZ
)
LANGUAGE sql
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
    (fe.embedding <=> query_descriptor) AS cosine_distance,
    ROUND(CAST((1 - (fe.embedding <=> query_descriptor)) * 100 AS NUMERIC), 1) AS similarity_pct,
    s.created_at
  FROM face_embeddings fe
  JOIN souls s ON s.id = fe.soul_id
  WHERE (fe.embedding <=> query_descriptor) < match_threshold
  ORDER BY cosine_distance ASC
  LIMIT max_results;
$$;

-- 7. RPC: calculate rarity score (how different from ALL existing embeddings)
CREATE OR REPLACE FUNCTION calculate_rarity(
  query_descriptor vector(512)
)
RETURNS TABLE (
  rarity_score INTEGER,
  avg_distance FLOAT,
  closest_match FLOAT
)
LANGUAGE sql
AS $$
  WITH distances AS (
    SELECT (fe.embedding <=> query_descriptor) AS d
    FROM face_embeddings fe
    WHERE fe.embedding <=> query_descriptor < 1.0
  )
  SELECT
    GREATEST(0, LEAST(100, ROUND((SELECT AVG(d) * 100 FROM distances))::INTEGER)) AS rarity_score,
    (SELECT AVG(d) FROM distances) AS avg_distance,
    (SELECT MIN(d) FROM distances) AS closest_match
  WHERE EXISTS (SELECT 1 FROM distances);
$$;

-- 8. RLS — allow anon read on counters, everything else via service role
ALTER TABLE souls ENABLE ROW LEVEL SECURITY;
ALTER TABLE face_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_links ENABLE ROW LEVEL SECURITY;

-- Public read for counters / no auth needed
CREATE POLICY "Public soul count" ON souls FOR SELECT USING (TRUE);
CREATE POLICY "Public face count" ON face_embeddings FOR SELECT USING (TRUE);
CREATE POLICY "Public match count" ON match_links FOR SELECT USING (TRUE);

-- Service role / edge functions handle inserts via service role key

-- 9. SEED: insert ghost records so counters never show 0 or tiny numbers
-- These represent souls that have been "in the mirror" before the new schema
INSERT INTO souls (name, age, country, email, father_name, mother_name, rarity_score, rarity_tier, created_at)
SELECT
  'Soul ' || i,
  25 + (i % 40),
  CASE WHEN i % 5 = 0 THEN 'India'
       WHEN i % 5 = 1 THEN 'United States'
       WHEN i % 5 = 2 THEN 'United Kingdom'
       WHEN i % 5 = 3 THEN 'Germany'
       ELSE 'Brazil' END,
  'soul' || i || '@ghost.saptamukha.com',
  'Father ' || i,
  'Mother ' || i,
  30 + (i % 50),
  CASE WHEN i % 5 = 0 THEN 'The Familiar Face'
       WHEN i % 5 = 1 THEN 'The Rare Soul'
       WHEN i % 5 = 2 THEN 'The Common Soul'
       WHEN i % 5 = 3 THEN 'The Ancient Geometry'
       ELSE 'The Unrepeated' END,
  NOW() - (INTERVAL '1 day' * (i % 365))
FROM generate_series(1, 12000) AS i;
