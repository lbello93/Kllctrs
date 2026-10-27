import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('saved_events').eq('id', user.id).single()

  const current = (profile?.saved_events ?? []) as string[]
  const isSaved = current.includes(id)
  const updated = isSaved ? current.filter(x => x !== id) : [...current, id]

  await supabase.from('profiles').update({ saved_events: updated }).eq('id', user.id)
  return NextResponse.json({ saved: !isSaved })
}