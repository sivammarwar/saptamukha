// @ts-nocheck
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { descriptor, scanType, profileId } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (scanType === 'celebrity') {
    return new Response(JSON.stringify({ error: 'use_client_side' }), { status: 400 })
  }

  if (scanType === 'live') {
    const { data: face } = await supabase
      .from('face_records')
      .insert({ profile_id: profileId, descriptor, is_primary: true, image_url: '' })
      .select()
      .single()
  }

  const { data: matches, error } = await supabase.rpc('find_matching_faces', {
    query_descriptor: descriptor,
    match_threshold: 0.30,
    max_results: 10,
  })

  if (error) return new Response(JSON.stringify({ error }), { status: 500 })

  const enriched = await Promise.all(matches.map(async (m: any) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, location, instagram, twitter, facebook, mobile')
      .eq('id', m.profile_id)
      .single()
    return { ...m, profile }
  }))

  return new Response(JSON.stringify({ matches: enriched }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
