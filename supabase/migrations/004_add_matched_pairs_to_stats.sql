-- SAPTAMUKHA v4.2 — Add matched pairs count to platform stats

-- Update get_platform_stats to include real matched pairs count from match_links table
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
    'real_matched_pairs',
      (SELECT COUNT(*)::INT FROM match_links),
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
