'use server'

import { db } from '@/lib/db'
import { inquiries } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

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

  // 2) Send a notification through Web3Forms. The inquiry remains safely
  // stored even if email delivery is unavailable or the provider rejects it.
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY
  const to = process.env.CONTACT_NOTIFICATION_EMAIL
  if (accessKey && to) {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New inquiry from ${name}`,
          from_name: 'Mi Sueno Photography website',
          email: to,
          replyto: email,
          name,
          session_type: sessionType || 'Not specified',
          preferred_date: preferredDate || 'Not specified',
          message,
        }),
      })

      if (!response.ok) {
        throw new Error(`Web3Forms returned ${response.status}`)
      }

      const result = (await response.json()) as { success?: boolean }
      if (!result.success) {
        throw new Error('Web3Forms rejected the submission')
      }

      await db
        .update(inquiries)
        .set({ emailed: true })
        .where(eq(inquiries.id, inquiryId))
    } catch (err) {
      console.error('[v0] Failed to send inquiry email through Web3Forms:', err)
    }
  } else {
    console.warn('[v0] Web3Forms is not configured; inquiry saved without email notification')
  }

  revalidatePath('/admin')
  return { ok: true }
}
