import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { createOrganizerSubmissionCandidate } from '@/lib/events/organizer-submission-adapter'
import { findEventIdentityMatch } from '@/lib/events/deduplication'
import { mapCandidateToEventInsert } from '@/lib/events/supabase-mapper'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const state    = searchParams.get('state')
  const city     = searchParams.get('city')
  const keyword  = searchParams.get('keyword')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo   = searchParams.get('dateTo')

  let query = supabase
    .from('events')
    .select('*')
    .eq('status', 'approved')
    .order('date_start', { ascending: true })

  if (state)    query = query.eq('state', state)
  if (city)     query = query.ilike('city', `%${city}%`)
  if (keyword)  query = query.or(`name.ilike.%${keyword}%,venue_name.ilike.%${keyword}%,city.ilike.%${keyword}%`)
  if (dateFrom) query = query.gte('date_start', dateFrom)
  if (dateTo)   query = query.lte('date_start', dateTo)

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ events: data })
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
