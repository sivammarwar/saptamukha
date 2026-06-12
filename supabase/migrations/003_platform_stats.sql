-- SAPTAMUKHA v4.1 — Live platform stats (real counts; fake baselines applied in frontend)

-- 1. Soul twin scan events — every time a user sends their face to the server
CREATE TABLE IF NOT EXISTS soul_scan_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_soul_scan_events_created ON soul_scan_events(created_at DESC);

-- 2. Mukha Darshan harmony scans — every successful analyze-batch submission
CREATE TABLE IF NOT EXISTS harmony_scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  normalized_overall FLOAT NOT NULL,
  tier TEXT,
  scores JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_harmony_scans_created ON harmony_scans(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_harmony_scans_overall ON harmony_scans(normalized_overall DESC);

-- 3. Record a soul twin scan (+1 per face submission)
CREATE OR REPLACE FUNCTION record_soul_scan()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO soul_scan_events DEFAULT VALUES;
END;
$$;

-- 4. Record a Mukha Darshan harmony scan
CREATE OR REPLACE FUNCTION record_harmony_scan(
  p_overall FLOAT,
  p_tier TEXT,
  p_scores JSONB
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO harmony_scans (normalized_overall, tier, scores)
  VALUES (
    p_overall,
    p_tier,
    COALESCE(p_scores, '{}'::jsonb)
  );
END;
$$;

-- 5. Real counts only (frontend adds fake baselines: 109810 / 500)
CREATE OR REPLACE FUNCTION get_platform_stats()
RETURNS JSON
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT json_build_object(
    'real_souls',
      (SELECT COUNT(*)::INT FROM souls WHERE email NOT LIKE '%@ghost.saptamukha.com'),
    'real_waiting',
      (SELECT COUNT(*)::INT FROM souls
       WHERE has_match = FALSE AND email NOT LIKE '%@ghost.saptamukha.com'),
    'soul_scans_today',
      (SELECT COUNT(*)::INT FROM soul_scan_events
       WHERE created_at >= date_trunc('day', NOW() AT TIME ZONE 'UTC')),
    'soul_scans_total',
      (SELECT COUNT(*)::INT FROM soul_scan_events),
    'harmony_scans_today',
      (SELECT COUNT(*)::INT FROM harmony_scans
       WHERE created_at >= date_trunc('day', NOW() AT TIME ZONE 'UTC')),
    'harmony_scans_total',
      (SELECT COUNT(*)::INT FROM harmony_scans),
    'harmony_highest_overall',
      COALESCE((SELECT MAX(normalized_overall)::FLOAT FROM harmony_scans), 0),
    'harmony_highest_by_metric',
      COALESCE(
        (SELECT jsonb_object_agg(metric_key, max_score)
         FROM (
           SELECT key AS metric_key, MAX((value)::FLOAT) AS max_score
           FROM harmony_scans, jsonb_each_text(scores)
           WHERE value ~ '^[0-9]+\.?[0-9]*$'
           GROUP BY key
         ) metric_maxs),
        '{}'::jsonb
      )
  );
$$;

GRANT EXECUTE ON FUNCTION record_soul_scan() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION record_harmony_scan(FLOAT, TEXT, JSONB) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_platform_stats() TO anon, authenticated;

ALTER TABLE soul_scan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE harmony_scans ENABLE ROW LEVEL SECURITY;
