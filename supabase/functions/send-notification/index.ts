// @ts-nocheck
// Supabase Edge Function: send-notification
// Sends transactional emails via Resend API
// Types: twin_found | sealed | duplicate

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const body = await req.json()
  const { type } = body

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const resendApiKey = Deno.env.get('RESEND_API_KEY')
  if (!resendApiKey) {
    return new Response(JSON.stringify({ error: 'missing_resend_key' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  }

  const appUrl = Deno.env.get('VITE_APP_URL') || 'https://saptamukha.com'
  const results = []

  async function sendEmail({ to, subject, html }) {
    return await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Saptamukha <alerts@saptamukha.com>',
        to,
        subject,
        html,
      }),
    })
  }

  // ─── TYPE: twin_found ───
  if (type === 'twin_found') {
    const newSoulId = body.newSoulId || body.soulA || null
    const directMatchMap = new Map(
      ((body.directMatches || []) as Array<{ soulId: string; similarityPct?: number }>)
        .filter((entry) => entry?.soulId)
        .map((entry) => [entry.soulId, entry.similarityPct ?? null])
    )
    const legacySoulIds = [body.soulA, body.soulB].filter(Boolean)
    const requestedSoulIds = Array.from(new Set([...(body.soulIds || []), ...legacySoulIds]))

    if (requestedSoulIds.length > 0) {
      const { data: souls } = await supabase
        .from('souls')
        .select('id, name, email, rarity_tier, rarity_score, country, age, instagram, other_social')
        .in('id', requestedSoulIds)

      const soulMap = new Map((souls || []).map((soul) => [soul.id, soul]))
      const orderedSouls = requestedSoulIds
        .map((soulId) => soulMap.get(soulId))
        .filter(Boolean)

      for (const soul of orderedSouls) {
        if (!soul?.email) continue

        const others = orderedSouls.filter((other) => other.id !== soul.id)
        if (others.length === 0) continue

        const otherCards = others
          .map((other) => {
            const directSimilarity =
              soul.id === newSoulId
                ? (directMatchMap.get(other.id) ?? body.similarityPct ?? null)
                : other.id === newSoulId
                  ? (directMatchMap.get(soul.id) ?? body.similarityPct ?? null)
                  : null
            const similarityLine = directSimilarity
              ? `<div style="font-size:24px;color:#7f5af0;font-weight:bold;margin-bottom:6px;">${directSimilarity}% direct match</div>`
              : `<div style="font-size:13px;color:#9d7fe3;margin-bottom:6px;">Connected through your twin circle</div>`

            return `<div style="background:#1a0a2e;border:1px solid #3d2a6e;border-radius:12px;padding:16px;margin:12px 0;text-align:center;">
              ${similarityLine}
              <div style="font-size:18px;color:#d4b8ff;margin-bottom:4px;">${other.name || 'Unknown Soul'}</div>
              <div style="font-size:13px;color:#9d7fe3;">${other.country || ''}${other.country && other.age ? ' · ' : ''}${other.age || ''}${other.age ? ' years old' : ''}</div>
              ${other.instagram ? `<div style="font-size:13px;color:#d4b8ff;margin-top:8px;">📷 ${other.instagram}</div>` : ''}
              ${other.other_social ? `<div style="font-size:13px;color:#d4b8ff;">🔗 ${other.other_social}</div>` : ''}
            </div>`
          })
          .join('')

        const subject =
          others.length === 1
            ? '🔱 The mirror found your other face'
            : '🔱 The mirror expanded your twin circle'

        const intro =
          others.length === 1
            ? 'Someone whose face mirrors yours across lifetimes has been found.'
            : `Your mirror circle now holds ${others.length} souls whose faces connect to yours.`

        const res = await sendEmail({
          to: soul.email,
          subject,
          html: `<div style="font-family:Georgia,serif;color:#d4b8ff;background:#0d0821;padding:40px;max-width:600px;margin:auto;border:1px solid #3d2a6e;border-radius:12px;">
            <h2 style="color:#7f5af0;font-size:22px;margin-bottom:8px;">${others.length === 1 ? 'The mirror found your other face' : 'Your twin circle has grown'}</h2>
            <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">Namaste ${soul.name},</p>
            <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">${intro}</p>
            ${otherCards}
            <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">Your rarity: <strong style="color:#d4b8ff;">${soul.rarity_tier}</strong> (${soul.rarity_score}% unique)</p>
            <p style="text-align:center;margin-top:24px;"><a href="${appUrl}" style="display:inline-block;padding:12px 24px;background:#1a0a2e;border:1px solid #7f5af0;color:#d4b8ff;text-decoration:none;border-radius:8px;font-size:15px;">Return to the mirror →</a></p>
          </div>`,
        })

        results.push({ soulId: soul.id, sent: res.ok, recipients: others.length })
      }
    }
  }

  // ─── TYPE: sealed ───
  if (type === 'sealed') {
    const { soulId } = body
    const { data: soul } = await supabase
      .from('souls')
      .select('id, name, email, rarity_tier, rarity_score')
      .eq('id', soulId)
      .single()

    if (soul?.email) {
      const res = await sendEmail({
        to: soul.email,
        subject: '🔱 Your face has been sealed in the Akashic record',
        html: `<div style="font-family:Georgia,serif;color:#d4b8ff;background:#0d0821;padding:40px;max-width:600px;margin:auto;border:1px solid #3d2a6e;border-radius:12px;">
          <h2 style="color:#7f5af0;font-size:22px;margin-bottom:8px;">Your face has been sealed in the Akashic record</h2>
          <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">Namaste ${soul.name},</p>
          <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">Your face is now part of the mirror. Every soul who steps into SAPTAMUKHA from this moment forward will be checked against yours.</p>
          <div style="background:#1a0a2e;border:1px solid #3d2a6e;border-radius:12px;padding:20px;margin:20px 0;text-align:center;">
            <div style="font-size:13px;color:#9d7fe3;margin-bottom:4px;">Your rarity tier</div>
            <div style="font-size:28px;color:#d4b8ff;font-weight:bold;margin-bottom:8px;">${soul.rarity_tier}</div>
            <div style="font-size:18px;color:#7f5af0;">${soul.rarity_score}% unique</div>
          </div>
          <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">The moment a match is found — across any city, any country — you will be notified instantly.</p>
          <p style="text-align:center;margin-top:24px;"><a href="${appUrl}" style="display:inline-block;padding:12px 24px;background:#1a0a2e;border:1px solid #7f5af0;color:#d4b8ff;text-decoration:none;border-radius:8px;font-size:15px;">Return to the mirror →</a></p>
        </div>`,
      })
      results.push({ soulId, sent: res.ok })
    }
  }

  // ─── TYPE: duplicate ───
  if (type === 'duplicate') {
    const { soulId } = body
    const { data: soul } = await supabase
      .from('souls')
      .select('id, name, email, rarity_tier, rarity_score')
      .eq('id', soulId)
      .single()

    if (soul?.email) {
      const res = await sendEmail({
        to: soul.email,
        subject: '🔱 We recognised your face',
        html: `<div style="font-family:Georgia,serif;color:#d4b8ff;background:#0d0821;padding:40px;max-width:600px;margin:auto;border:1px solid #3d2a6e;border-radius:12px;">
          <h2 style="color:#7f5af0;font-size:22px;margin-bottom:8px;">We recognised your face</h2>
          <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">Namaste ${soul.name},</p>
          <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">The bloodline record matched. The parentage you provided was already sealed in this mirror. This is you, returning from a different device or a different moment in time.</p>
          <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">Your search is still active. Your face twin has not yet arrived.</p>
          <p style="font-size:15px;line-height:1.6;color:#9d7fe3;">If your email has changed, you can update it when you return to the mirror.</p>
          <p style="text-align:center;margin-top:24px;"><a href="${appUrl}" style="display:inline-block;padding:12px 24px;background:#1a0a2e;border:1px solid #7f5af0;color:#d4b8ff;text-decoration:none;border-radius:8px;font-size:15px;">Return to the mirror →</a></p>
        </div>`,
      })
      results.push({ soulId, sent: res.ok })
    }
  }

  return new Response(JSON.stringify({ results }), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  })
})
