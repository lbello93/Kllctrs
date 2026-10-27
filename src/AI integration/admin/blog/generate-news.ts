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
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { ok: false as const, status: 403, error: 'Forbidden' }
  return { ok: true as const }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  let topic: unknown
  let sourceUrl: unknown
  try {
    ({ topic, source_url: sourceUrl } = await request.json())
  } catch {
    return NextResponse.json({ error: 'A valid JSON request is required' }, { status: 400 })
  }
  if (typeof topic !== 'string' || topic.trim().length < 5 || topic.length > 240) {
    return NextResponse.json({ error: 'Enter a story topic between 5 and 240 characters' }, { status: 400 })
  }
  if (sourceUrl !== undefined && sourceUrl !== '') {
    try {
      const url = new URL(String(sourceUrl))
      if (!['http:', 'https:'].includes(url.protocol)) throw new Error('invalid protocol')
    } catch {
      return NextResponse.json({ error: 'Source URL must be a valid http or https URL' }, { status: 400 })
    }
  }

  try {
    const lookup = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Research current, verifiable news in the sports and trading card collecting hobby for this story idea: ${topic.trim()}${sourceUrl ? `\nStarting source: ${sourceUrl}` : ''}\nPrioritize primary sources such as auction houses, grading companies, leagues, brands, and event organizers. Verify what happened, the date, item/card identity, grade, sale price and whether it was an auction result, private sale, listing, or asking price. Search for corroboration and context. Do not treat a listing price as a completed sale.`,
      config: { tools: [{ googleSearch: {} }] },
    })
    const chunks = lookup.candidates?.[0]?.groundingMetadata?.groundingChunks ?? []
    const sourceMap = new Map<string, { title: string; url: string }>()
    for (const chunk of chunks) {
      const web = chunk.web
      if (web?.uri && /^https?:\/\//i.test(web.uri)) {
        sourceMap.set(web.uri, { title: web.title || new URL(web.uri).hostname, url: web.uri })
      }
    }
    const sources = [...sourceMap.values()].slice(0, 10)
    const research = lookup.text?.trim()
    if (!research || sources.length === 0) {
      return NextResponse.json({ error: 'Search did not return verifiable sources. Try a more specific topic.' }, { status: 422 })
    }

    const writing = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: `Write a clear, engaging 500–700 word KLLCTRS Market Intel article for collectors based only on the research brief and listed sources below. This is timely hobby news, not investment advice. Explain why the story matters to collectors, distinguish completed sale prices from asking prices, include the date and card/item details when verified, and state uncertainty plainly. Do not add facts or citations that are not in the brief. Finish with a short collector takeaway. Return only a JSON object with title (max 90 chars), meta_description (max 155 chars), and body (Markdown).\n\nResearch brief:\n${research}\n\nSources:\n${sources.map((source, i) => `${i + 1}. ${source.title} — ${source.url}`).join('\n')}`,
      config: { responseMimeType: 'application/json' },
    })
    const text = writing.text ?? ''
    const parsed = JSON.parse(text) as { title?: string; meta_description?: string; body?: string }
    if (!parsed.title || !parsed.body) return NextResponse.json({ error: 'The article generator returned incomplete content' }, { status: 502 })

    const baseSlug = slugify(parsed.title, { lower: true, strict: true }).slice(0, 90) || `market-intel-${Date.now()}`
    const slug = `${baseSlug}-${Date.now().toString(36)}`
    const checkedAt = new Date().toISOString()
    const { data: draft, error } = await supabaseAdmin.from('content').insert({
      type: 'blog', category: 'market_intel', title: parsed.title, slug,
      body: parsed.body, meta_description: parsed.meta_description ?? null,
      status: 'draft', author: 'KLLCTRS Editorial',
      source_links: sources.map((source) => ({ ...source, checked_at: checkedAt })),
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ draft }, { status: 201 })
  } catch (error) {
    console.error('[blog/generate-news] error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'News draft generation failed' }, { status: 500 })
  }
}
