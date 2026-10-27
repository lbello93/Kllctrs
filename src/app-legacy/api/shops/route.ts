import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)

  const state     = searchParams.get('state')
  const city      = searchParams.get('city')
  const keyword   = searchParams.get('keyword')
  const specialty = searchParams.get('specialty')

  let query = supabase
    .from('shops')
    .select('*')
    .eq('status', 'approved')
    .order('name', { ascending: true })

  if (state)     query = query.eq('state', state)
  if (city)      query = query.ilike('city', `%${city}%`)
  if (specialty) query = query.eq('specialty', specialty)
  if (keyword)   query = query.or(`name.ilike.%${keyword}%,city.ilike.%${keyword}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ shops: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  const safe = {
    name: body.name,
    slug: body.slug,
    address: body.address || null,
    city: body.city,
    state: body.state,
    zip_code: body.zip_code || null,
    phone: body.phone || null,
    website: body.website || null,
    specialty: body.specialty || 'both',
    status: 'pending',
    submitted_by: user.id,
    source: 'user',
  }

  const { data, error } = await supabaseAdmin
    .from('shops')
    .insert(safe)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ shop: data }, { status: 201 })
}