'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Check } from 'lucide-react'
import { submitInquiry } from '@/app/actions/contact'

const sessionTypes = ['Portrait', 'Couples', 'Family', 'Event', 'Lifestyle', 'Other']

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const formData = new FormData(e.currentTarget)
    const result = await submitInquiry(formData)
    setPending(false)
    if (result.ok) {
      setSubmitted(true)
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center border border-border/60 bg-card px-8 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/60 text-primary">
          <Check className="h-6 w-6" />
        </div>
        <h3 className="mt-6 font-serif text-2xl font-light text-foreground">
          Thank you
        </h3>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your message has been received. I&apos;ll be in touch within 1–2 business
          days to start planning your session.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-primary"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-primary"
          />
        </Field>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Session Type" htmlFor="type">
          <select
            id="type"
            name="type"
            className="w-full border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-primary [&>option]:bg-background"
            defaultValue=""
          >
            <option value="" disabled>
              Select one
            </option>
            {sessionTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preferred Date" htmlFor="date">
          <input
            id="date"
            name="date"
            type="date"
            className="w-full border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-primary [color-scheme:dark]"
          />
        </Field>
      </div>

      <Field label="Tell me about your vision" htmlFor="message">
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full resize-none border-b border-border bg-transparent py-3 text-foreground outline-none transition-colors focus:border-primary"
        />
      </Field>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? 'Sending…' : 'Send Inquiry'}
      </button>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1 block text-xs uppercase tracking-[0.25em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
