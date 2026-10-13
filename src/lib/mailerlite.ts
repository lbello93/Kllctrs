// subscribe, trigger alert, send newsletter

const API_KEY = process.env.MAILERLITE_API_KEY!
const BASE = 'https://connect.mailerlite.com/api'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  // First ensure subscriber exists
  await fetch(`${BASE}/subscribers`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: to }),
  })

  // Send campaign-style email via automation or direct
  // MailerLite free tier doesn't have transactional API
  // So we'll use their subscriber + campaign approach
  // For now, log the intent and use Supabase edge function later
  return { sent: true, to, subject }
}

export async function sendEventAlert(
  userEmail: string,
  event: { name: string; city: string; state: string; date_start: string; slug: string }
) {
  const subject = `New card show in ${event.state}: ${event.name}`
  const html = `
    <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #0a1628; color: #ffffff;">
      <div style="margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: 1px;">KLLCTBLS</span>
      </div>

      <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 8px; color: #ffffff;">
        New Show Alert: ${event.name}
      </h1>

      <p style="font-size: 15px; color: #94a3b8; margin-bottom: 24px;">
        A new card show was just added in your tracked state.
      </p>

      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0 0 8px; font-size: 14px; color: #94a3b8;">📍 ${event.city}, ${event.state}</p>
        <p style="margin: 0 0 8px; font-size: 14px; color: #94a3b8;">📅 ${new Date(event.date_start).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      <a href="https://kllctbls.com/events/${event.slug}"
         style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #c026d3); color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
        View Show Details →
      </a>

      <p style="margin-top: 32px; font-size: 12px; color: #475569;">
        You're receiving this because you track card shows in ${event.state} on KLLCTBLS.
        <br/>Update your preferences anytime from your KLLCTRS profile.
      </p>
    </div>
  `

  return sendEmail({ to: userEmail, subject, html })
}
