'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { PhotoUploader } from '@/components/admin/photo-uploader'
import { PhotoManager } from '@/components/admin/photo-manager'
import { ContentEditor } from '@/components/admin/content-editor'
import { InquiryManager, type Inquiry } from '@/components/admin/inquiry-manager'
import { LogOut, ExternalLink } from 'lucide-react'
import type { Photo } from '@/lib/data'
import type { ContentMap } from '@/lib/content-defaults'

type Tab = 'photos' | 'content' | 'inbox'

export function AdminShell({
  photos,
  content,
  name,
  inquiries,
}: {
  photos: Photo[]
  content: ContentMap
  name: string
  inquiries: Inquiry[]
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('photos')
  const unreadCount = inquiries.filter((i) => !i.read).length

  async function signOut() {
    await authClient.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={40} height={40} />
            <div>
              <p className="font-serif text-lg font-light leading-tight text-foreground">
                Studio Dashboard
              </p>
              <p className="text-xs text-muted-foreground">Welcome back, {name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /> View site
            </Link>
            <button
              type="button"
              onClick={signOut}
              className="flex items-center gap-2 border border-border px-3 py-2 text-xs uppercase tracking-wider text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex gap-2 border-b border-border">
          <button
            type="button"
            onClick={() => setTab('photos')}
            className={`-mb-px border-b-2 px-4 py-3 text-sm uppercase tracking-wider transition-colors ${
              tab === 'photos'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Photos
          </button>
          <button
            type="button"
            onClick={() => setTab('inbox')}
            className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-3 text-sm uppercase tracking-wider transition-colors ${
              tab === 'inbox'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Inbox
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setTab('content')}
            className={`-mb-px border-b-2 px-4 py-3 text-sm uppercase tracking-wider transition-colors ${
              tab === 'content'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Website text
          </button>
        </div>

        {tab === 'photos' && (
          <div className="flex flex-col gap-8">
            <PhotoUploader />
            <div>
              <h2 className="mb-4 font-serif text-xl font-light text-foreground">
                Your gallery ({photos.length})
              </h2>
              <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                These photos appear on your public gallery page. Mark a few as{' '}
                <span className="text-primary">Featured</span> to show them on your homepage.
              </p>
              <PhotoManager photos={photos} />
            </div>
          </div>
        )}

        {tab === 'inbox' && (
          <div>
            <h2 className="mb-4 font-serif text-xl font-light text-foreground">
              Inquiries ({inquiries.length})
            </h2>
            <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Messages sent through your contact page. Click{' '}
              <span className="text-primary">Reply</span> to respond by email.
            </p>
            <InquiryManager inquiries={inquiries} />
          </div>
        )}

        {tab === 'content' && <ContentEditor content={content} />}
      </div>
    </main>
  )
}
