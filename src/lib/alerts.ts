import { supabaseAdmin } from '@/lib/supabase/admin'
import { sendEventAlert } from '@/lib/mailerlite'

interface EventData {
  id: string
  name: string
  city: string
  state: string
  date_start: string
  slug: string
}

export async function triggerEventAlerts(event: EventData) {
  // Find users who track this event's state
  const { data: users } = await supabaseAdmin
    .from('profiles')
    .select('id, email, alert_states')
    .not('alert_states', 'is', null)

  if (!users || users.length === 0) return { sent: 0, skipped: 0 }

  const matchingUsers = users.filter(u => {
    const states = u.alert_states as string[] | null
    return states && states.includes(event.state)
  })

  let sent = 0
  let skipped = 0

  for (const user of matchingUsers) {
    if (!user.email) { skipped++; continue }

    // Check if already sent (idempotent)
    const { data: existing } = await supabaseAdmin
      .from('email_log')
      .select('id')
      .eq('user_id', user.id)
      .eq('event_id', event.id)
      .eq('email_type', 'event_alert')
      .maybeSingle()

    if (existing) { skipped++; continue }

    try {
      await sendEventAlert(user.email, event)

      await supabaseAdmin.from('email_log').insert({
        user_id: user.id,
        event_id: event.id,
        email_type: 'event_alert',
        status: 'sent',
      })
      sent++
    } catch (e: unknown) {
      await supabaseAdmin.from('email_log').insert({
        user_id: user.id,
        event_id: event.id,
        email_type: 'event_alert',
        status: 'failed',
        error_message: e instanceof Error ? e.message : "Unknown alert error",
      })
      skipped++
    }
  }

  return { sent, skipped }
}
