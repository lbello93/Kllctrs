import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
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
  const body = await request.json()

  const update: TablesUpdate<'profiles'> = {}
  if (body.role && ['user', 'admin'].includes(body.role)) {
    update.role = body.role
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  // Safety: prevent demoting the last admin
  if (body.role === 'user') {
    const { count } = await supabaseAdmin
      .from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin')
    if ((count ?? 0) <= 1) {
      return NextResponse.json({ error: 'Cannot demote the last admin' }, { status: 400 })
    }
  }

  const { data, error } = await supabaseAdmin
    .from('profiles').update(update).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profile: data })
}
