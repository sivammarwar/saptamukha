-- SAPTAMUKHA v6.0 — UPDATE RLS POLICIES TO ALLOW ANON INSERT FOR SOULS, ETC.

-- Allow anonymous users to insert new souls
CREATE POLICY "Allow anonymous insert on souls" ON souls FOR INSERT WITH CHECK (TRUE);

-- Allow anonymous users to insert face embeddings
CREATE POLICY "Allow anonymous insert on face_embeddings" ON face_embeddings FOR INSERT WITH CHECK (TRUE);

-- Allow anonymous users to insert match links (though linkSouls will probably use service role)
CREATE POLICY "Allow anonymous insert on match_links" ON match_links FOR INSERT WITH CHECK (TRUE);

-- Allow anonymous users to insert top harmony scorers
CREATE POLICY "Allow anonymous insert on top_harmony_scorers" ON top_harmony_scorers FOR INSERT WITH CHECK (TRUE);
