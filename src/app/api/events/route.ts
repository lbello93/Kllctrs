import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { createOrganizerSubmissionCandidate } from '@/lib/events/organizer-submission-adapter'
import { findEventIdentityMatch } from '@/lib/events/deduplication'
import { mapCandidateToEventInsert } from '@/lib/events/supabase-mapper'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const state     = searchParams.get('state')
  const city      = searchParams.get('city')
  // Accept both the new (search/startDate/endDate) and legacy
  // (keyword/dateFrom/dateTo) param names so existing callers keep working.
  const search    = searchParams.get('search') ?? searchParams.get('keyword')
  const startDate = searchParams.get('startDate') ?? searchParams.get('dateFrom')
  const endDate   = searchParams.get('endDate') ?? searchParams.get('dateTo')
  const type      = searchParams.get('type')
  const hasSponsors = searchParams.get('hasSponsors') === 'true'

  const page  = Math.max(1, Number(searchParams.get('page')) || 1)
  const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit')) || 20))
  const from  = (page - 1) * limit
  const to    = from + limit - 1

  let query = supabase
    .from('events')
    .select('*', { count: 'exact' })
    .eq('status', 'approved')
    .order('date_start', { ascending: true })

  if (state)     query = query.eq('state', state)
  if (city)      query = query.ilike('city', `%${city}%`)
  if (type)      query = query.eq('event_type', type)
  if (search)    query = query.or(`name.ilike.%${search}%,venue_name.ilike.%${search}%,city.ilike.%${search}%`)
  if (startDate) query = query.gte('date_start', startDate)
  if (endDate)   query = query.lte('date_start', endDate)

  const { data, error, count } = await query.range(from, to)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows = data ?? []

  // Count tiered sponsors from the junction for this page of events.
  const ids = rows.map((e) => e.id)
  const junctionTally = new Map<string, number>()
  if (ids.length > 0) {
    const { data: links } = await supabase
      .from('event_sponsors')
      .select('event_id')
      .in('event_id', ids)
    for (const link of links ?? []) {
      junctionTally.set(link.event_id, (junctionTally.get(link.event_id) ?? 0) + 1)
    }
  }

  const events = rows.map((row) => {
    // Fall back to the legacy sponsors array when the junction is empty.
    const sponsorCount = junctionTally.get(row.id) || row.sponsors?.length || 0
    return { ...row, sponsorCount }
  })

  // "Has sponsors" is applied after counting so the fallback array is honored.
  const filtered = hasSponsors ? events.filter((e) => e.sponsorCount > 0) : events

  return NextResponse.json({
    events: filtered,
    page,
    limit,
    total: count ?? filtered.length,
    totalPages: count ? Math.ceil(count / limit) : 1,
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body: unknown = await request.json()
  const candidate = createOrganizerSubmissionCandidate(body, user.id)
  if (!candidate?.quality.readyForReview || !candidate.event.name || !candidate.event.dateStart || !candidate.event.city || !candidate.event.state) {
    return NextResponse.json({ error: 'Name, valid start date, city, and state are required.' }, { status: 400 })
  }
  let possibleMatch: Awaited<ReturnType<typeof findEventIdentityMatch>>
  try {
    possibleMatch = await findEventIdentityMatch(supabaseAdmin, candidate)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Event lookup failed.' }, { status: 500 })
  }
  if (possibleMatch?.match === 'same_source' || possibleMatch?.match === 'exact') {
    return NextResponse.json({
      error: 'A matching event already exists.',
      eventId: possibleMatch.event.id,
      match: possibleMatch.match,
    }, { status: 409 })
  }

  const possibleDuplicateOf = possibleMatch?.match === 'needs_review'
    ? {
        id: possibleMatch.event.id,
        name: possibleMatch.event.name,
        slug: possibleMatch.event.slug,
      }
    : undefined
  const safe = mapCandidateToEventInsert(candidate, { submittedBy: user.id, possibleDuplicateOf })

  const { data, error } = await supabaseAdmin
    .from('events')
    .insert(safe)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({
    event: data,
    candidate,
    needsReview: Boolean(possibleDuplicateOf),
    possibleDuplicateOf: possibleDuplicateOf ?? null,
  }, { status: possibleDuplicateOf ? 202 : 201 })
}
