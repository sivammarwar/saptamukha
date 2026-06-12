-- SAPTAMUKHA v5.0 — TOP HARMONY SCORERS TABLE

CREATE TABLE IF NOT EXISTS top_harmony_scorers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT,
  country TEXT NOT NULL,
  avatar_url TEXT,
  score FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_top_harmony_scorers_score ON top_harmony_scorers(score DESC);

-- Enable RLS
ALTER TABLE top_harmony_scorers ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "Public read access" ON top_harmony_scorers FOR SELECT USING (TRUE);
