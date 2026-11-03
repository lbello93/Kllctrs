import { getAdminApiContext } from '@/lib/auth/apiGuard'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'
import type { TablesUpdate } from '@/types/database'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAdminApiContext()
  if (!auth.ok) return auth.response

  const { id } = await params
  const body = await request.json()

  const update: TablesUpdate<'profiles'> = {}
  if (body.role && ['user', 'admin', 'super_admin'].includes(body.role)) {
    update.role = body.role
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  // Safety: prevent demoting the last admin (counts admin + super_admin)
  if (body.role === 'user') {
    const { count } = await supabaseAdmin
      .from('profiles').select('*', { count: 'exact', head: true }).in('role', ['admin', 'super_admin'])
    if ((count ?? 0) <= 1) {
      return NextResponse.json({ error: 'Cannot demote the last admin' }, { status: 400 })
    }
  }

  const { data, error } = await supabaseAdmin
    .from('profiles').update(update).eq('id', id).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ profile: data })
}
