import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import { triggerEventAlerts } from '@/lib/alerts'
import type { TablesUpdate } from '@/types/database'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, status: 401, error: 'Unauthorized' }
  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { ok: false as const, status: 403, error: 'Forbidden' }
  return { ok: true as const, user }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
 const body = await request.json();

const update: TablesUpdate<'events'> = {
  name: body.name,
  slug: body.slug,
  date_start: body.date_start,
  date_end: body.date_end,

  city: body.city,
  state: body.state,

  venue_name: body.venue_name,
  venue_address: body.venue_address,
  zip_code: body.zip_code,

  website: body.website,
  venue_website: body.venue_website,

  vendor_tables: body.vendor_tables,

  contact_name: body.contact_name,
  contact_phone: body.contact_phone,
  contact_email: body.contact_email,

  autograph_guests: body.autograph_guests,
};

if (
  body.status &&
  ["pending", "approved", "rejected"].includes(body.status)
) {
  update.status = body.status;
}

Object.keys(update).forEach((key) => {
  const field = key as keyof typeof update;
  if (update[field] === undefined) {
    delete update[field];
  }
});
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('events').update(update).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (update.status === 'approved' && data) {
    triggerEventAlerts({
      id: data.id,
      name: data.name,
      city: data.city,
      state: data.state,
      date_start: data.date_start,
      slug: data.slug,
    }).catch(e => console.error('[alerts] failed:', e))
  }

  return NextResponse.json({ event: data })
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status })

  const { id } = await params
  const { error } = await supabaseAdmin.from('events').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
