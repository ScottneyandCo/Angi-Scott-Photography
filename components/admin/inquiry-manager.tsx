'use client'

import { useState, useTransition } from 'react'
import { Mail, Trash2, Calendar, Tag, Check } from 'lucide-react'
import { markInquiryRead, deleteInquiry } from '@/app/actions/admin'

export type Inquiry = {
  id: number
  name: string
  email: string
  sessionType: string | null
  preferredDate: string | null
  message: string
  read: boolean
  emailed: boolean
  createdAt: Date
}

export function InquiryManager({ inquiries }: { inquiries: Inquiry[] }) {
  const [items, setItems] = useState(inquiries)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [, startTransition] = useTransition()

  function toggleRead(item: Inquiry) {
    const next = !item.read
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, read: next } : i)),
    )
    startTransition(() => markInquiryRead(item.id, next))
  }

  function remove(id: number) {
    if (confirmId !== id) {
      setConfirmId(id)
      return
    }
    setItems((prev) => prev.filter((i) => i.id !== id))
    setConfirmId(null)
    startTransition(() => deleteInquiry(id))
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed border-border px-8 py-20 text-center">
        <Mail className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        <p className="mt-4 font-serif text-lg font-light text-foreground">
          No inquiries yet
        </p>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          When someone sends a message through your contact page, it will appear
          here.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-4">
      {items.map((item) => (
        <li
          key={item.id}
          className={`border p-5 transition-colors ${
            item.read ? 'border-border bg-card' : 'border-primary/40 bg-card'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                {!item.read && (
                  <span
                    className="h-2 w-2 rounded-full bg-primary"
                    aria-label="Unread"
                  />
                )}
                <p className="font-serif text-lg font-light text-foreground">
                  {item.name}
                </p>
              </div>
              <a
                href={`mailto:${item.email}`}
                className="text-sm text-primary hover:underline"
              >
                {item.email}
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          {(item.sessionType || item.preferredDate) && (
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
              {item.sessionType && (
                <span className="flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.sessionType}
                </span>
              )}
              {item.preferredDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.preferredDate}
                </span>
              )}
            </div>
          )}

          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {item.message}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <a
              href={`mailto:${item.email}?subject=Re: Your inquiry with Mi Sue\u00f1o`}
              className="flex items-center gap-1.5 bg-primary px-3 py-2 text-xs uppercase tracking-wider text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Reply
            </a>
            <button
              type="button"
              onClick={() => toggleRead(item)}
              className="flex items-center gap-1.5 border border-border px-3 py-2 text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {item.read ? 'Mark unread' : 'Mark read'}
            </button>
            <button
              type="button"
              onClick={() => remove(item.id)}
              onBlur={() => setConfirmId(null)}
              className={`ml-auto flex items-center gap-1.5 border px-3 py-2 text-xs uppercase tracking-wider transition-colors ${
                confirmId === item.id
                  ? 'border-destructive bg-destructive text-destructive-foreground'
                  : 'border-border text-muted-foreground hover:border-destructive hover:text-destructive'
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              {confirmId === item.id ? 'Confirm' : 'Delete'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
