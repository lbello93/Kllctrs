import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: current } = await supabaseAdmin
    .from('sponsors').select('website_clicks').eq('id', id).single()
  await supabaseAdmin
    .from('sponsors')
    .update({ website_clicks: (current?.website_clicks ?? 0) + 1 })
    .eq('id', id)
  return NextResponse.json({ ok: true })
}