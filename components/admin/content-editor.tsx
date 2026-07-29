'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveContent } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import type { ContentMap } from '@/lib/content-defaults'

type Field = { key: string; label: string; multiline?: boolean }
type Section = { title: string; fields: Field[] }

const SECTIONS: Section[] = [
  {
    title: 'Homepage',
    fields: [
      { key: 'home.hero.title', label: 'Hero headline', multiline: true },
      { key: 'home.hero.subtitle', label: 'Hero subtitle', multiline: true },
      { key: 'home.vision.title', label: 'Vision headline', multiline: true },
      { key: 'home.vision.body', label: 'Vision text', multiline: true },
      { key: 'home.cta.title', label: 'Closing call-to-action', multiline: true },
    ],
  },
  {
    title: 'About page',
    fields: [
      { key: 'about.title', label: 'Heading' },
      { key: 'about.p1', label: 'Paragraph 1', multiline: true },
      { key: 'about.p2', label: 'Paragraph 2', multiline: true },
      { key: 'about.p3', label: 'Paragraph 3', multiline: true },
      { key: 'about.quote', label: 'Pull quote', multiline: true },
    ],
  },
  {
    title: 'Contact details',
    fields: [
      { key: 'contact.email', label: 'Email address' },
      { key: 'contact.phone', label: 'Phone number' },
      { key: 'contact.location', label: 'Location / availability' },
      { key: 'contact.instagram', label: 'Instagram handle' },
    ],
  },
]

export function ContentEditor({ content }: { content: ContentMap }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await saveContent(formData)
      if (res?.error) {
        setMessage({ type: 'err', text: res.error })
      } else {
        setMessage({ type: 'ok', text: 'Your changes are live.' })
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-10">
      {SECTIONS.map((section) => (
        <div key={section.title} className="flex flex-col gap-5">
          <h3 className="border-b border-border pb-2 font-serif text-lg font-light text-foreground">
            {section.title}
          </h3>
          {section.fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-2">
              <label
                htmlFor={field.key}
                className="text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                {field.label}
              </label>
              {field.multiline ? (
                <textarea
                  id={field.key}
                  name={field.key}
                  defaultValue={content[field.key] ?? ''}
                  rows={3}
                  className="resize-y border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors focus:border-primary"
                />
              ) : (
                <input
                  id={field.key}
                  name={field.key}
                  type="text"
                  defaultValue={content[field.key] ?? ''}
                  className="border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="sticky bottom-4 flex items-center gap-4 border border-border bg-card/90 px-5 py-4 backdrop-blur">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : 'Save changes'}
        </Button>
        {message && (
          <p className={message.type === 'ok' ? 'text-sm text-primary' : 'text-sm text-red-400'}>
            {message.text}
          </p>
        )}
      </div>
    </form>
  )
}
