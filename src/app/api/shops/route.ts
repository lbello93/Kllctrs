import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { listShops } from '@/lib/shops/finder'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const sp = request.nextUrl.searchParams
  const num = (k: string) => {
    const raw = sp.get(k)
    if (raw === null) return null
    const v = Number(raw)
    return Number.isFinite(v) ? v : null
  }

  const shops = await listShops(supabase, {
    lat: num('lat'),
    lng: num('lng'),
    radius: num('radius') ?? 25,
    category: sp.get('category') ?? undefined,
    minRating: num('minRating'),
    search: sp.get('search') ?? undefined,
    state: sp.get('state') ?? undefined,
    city: sp.get('city') ?? undefined,
  })

  return NextResponse.json({ shops })
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