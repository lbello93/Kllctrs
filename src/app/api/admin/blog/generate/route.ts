import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import slugify from 'slugify'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, status: 401, error: 'Unauthorized' }
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { ok: false as const, status: 403, error: 'Forbidden' }
  return { ok: true as const, user }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { event_id } = await req.json()
  if (!event_id) return NextResponse.json({ error: 'event_id required' }, { status: 400 })

  // Fetch event
  const { data: event, error: eventErr } = await supabaseAdmin
    .from('events').select('*').eq('id', event_id).single()
  if (eventErr || !event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

  // Build context for Gemini
  const eventContext = `
Event Name: ${event.name}
Date: ${event.date_start}${event.date_end && event.date_end !== event.date_start ? ` to ${event.date_end}` : ''}
Location: ${event.city}, ${event.state}
Venue: ${event.venue_name ?? 'TBA'}
Address: ${event.venue_address ?? 'TBA'}
Website: ${event.website ?? 'N/A'}
Vendor Tables: ${event.vendor_tables ?? 'TBA'}
Autograph Guests: ${event.autograph_guests ?? 'None announced'}
`.trim()

  const prompt = `You are a sports card hobby blogger writing for KLLCTBLS, a US-focused card show discovery platform.

Write a 400-500 word blog post about this upcoming card show:

${eventContext}

Requirements:
- Engaging title (max 80 chars) — include the event name and city
- Hook opening that explains why a collector should care
- 3-4 short paragraphs covering: what the show offers, who should attend, practical tips (parking, hours, vendor count), and what to bring/look for
- End with a call-to-action mentioning users can save this show on KLLCTBLS to get reminders
- Conversational but informed tone — written by someone who knows the hobby
- DO NOT invent facts. If something is "TBA", say it's TBA or skip it
- DO NOT use phrases like "trip down memory lane" or other clichés

Return ONLY a JSON object with this exact shape:
{
  "title": "...",
  "meta_description": "... (max 155 chars, SEO-friendly summary)",
  "body": "... (markdown formatted, paragraphs separated by double newlines)"
}

No markdown code fence, no preamble, just the raw JSON.`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    })

    const text = response.text ?? ''
    let parsed: { title: string; meta_description: string; body: string }
    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'Gemini returned invalid JSON', raw: text }, { status: 500 })
    }

    if (!parsed.title || !parsed.body) {
      return NextResponse.json({ error: 'Missing title or body in generated content' }, { status: 500 })
    }

    const slug = slugify(parsed.title, { lower: true, strict: true }).slice(0, 100)

    // Insert as draft
    const { data: draft, error: insertErr } = await supabaseAdmin
      .from('content')
      .insert({
        type: 'blog',
        title: parsed.title,
        slug,
        body: parsed.body,
        meta_description: parsed.meta_description ?? null,
        status: 'draft',
        source_event_id: event_id,
        author: 'KLLCTBLS Editorial',
      })
      .select()
      .single()

    if (insertErr) {
      return NextResponse.json({ error: insertErr.message }, { status: 500 })
    }

    return NextResponse.json({ draft }, { status: 201 })
  } catch (e: any) {
    console.error('[blog/generate] error:', e)
    return NextResponse.json({ error: e.message ?? 'Generation failed' }, { status: 500 })
  }
}