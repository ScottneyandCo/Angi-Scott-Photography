'use server'

import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { Resend } from 'resend'

export type ContactResult = { ok: boolean; error?: string }

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function submitInquiry(formData: FormData): Promise<ContactResult> {
  const name = String(formData.get('name') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const sessionType = String(formData.get('type') ?? '').trim()
  const preferredDate = String(formData.get('date') ?? '').trim()
  const message = String(formData.get('message') ?? '').trim()

  // Basic validation.
  if (!name || !email || !message) {
    return { ok: false, error: 'Please fill in your name, email, and message.' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  // 1) Always save to the database so nothing is ever lost.
  let inquiryId: number
  try {
    const [row] = await db
      .insert(inquiries)
      .values({
        name,
        email,
        sessionType: sessionType || null,
        preferredDate: preferredDate || null,
        message,
      })
      .returning({ id: inquiries.id })
    inquiryId = row.id
  } catch (err) {
    console.error('[v0] Failed to save inquiry:', err)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }

  // 2) Try to email a notification. Dormant until RESEND_API_KEY is set —
  // a missing key never blocks the submission (it's already saved above).
  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_NOTIFICATION_EMAIL
  if (apiKey && to) {
    try {
      const resend = new Resend(apiKey)
      const dateLine = preferredDate
        ? `<p><strong>Preferred date:</strong> ${escapeHtml(preferredDate)}</p>`
        : ''
      const typeLine = sessionType
        ? `<p><strong>Session type:</strong> ${escapeHtml(sessionType)}</p>`
        : ''
      await resend.emails.send({
        // Resend's shared sender works with no domain setup. Swap for a
        // verified domain address later for best deliverability.
        from: 'Mi Sueno Inquiries <onboarding@resend.dev>',
        to,
        replyTo: email,
        subject: `New inquiry from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #1a1a1a;">
            <h2 style="font-weight: 400;">New website inquiry</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            ${typeLine}
            ${dateLine}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
          </div>
        `,
      })
      await db
        .update(inquiries)
        .set({ emailed: true })
        .where(eq(inquiries.id, inquiryId))
    } catch (err) {
      // Email failed, but the inquiry is safely stored in the dashboard.
      console.error('[v0] Failed to send inquiry email:', err)
    }
  }

  revalidatePath('/admin')
  return { ok: true }
}
