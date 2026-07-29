'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deletePhoto, toggleFeatured, updatePhotoMeta } from '@/app/actions/admin'
import { categoryLabel } from '@/lib/categories'
import { Star, Trash2, Pencil, Check } from 'lucide-react'
import type { Photo } from '@/lib/data'

export function PhotoManager({ photos }: { photos: Photo[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<number | null>(null)
  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [draftTitle, setDraftTitle] = useState('')

  function startEdit(p: Photo) {
    setEditId(p.id)
    setDraftTitle(p.title ?? '')
  }

  function saveCaption(id: number) {
    setBusyId(id)
    startTransition(async () => {
      await updatePhotoMeta(id, { title: draftTitle.trim() })
      setBusyId(null)
      setEditId(null)
      router.refresh()
    })
  }

  function onToggle(p: Photo) {
    setBusyId(p.id)
    startTransition(async () => {
      await toggleFeatured(p.id, !p.featured)
      setBusyId(null)
      router.refresh()
    })
  }

  function onDelete(id: number) {
    setBusyId(id)
    startTransition(async () => {
      await deletePhoto(id)
      setBusyId(null)
      setConfirmId(null)
      router.refresh()
    })
  }

  if (photos.length === 0) {
    return (
      <div className="border border-dashed border-border bg-card/20 p-10 text-center">
        <p className="text-muted-foreground">
          No photos yet. Upload your first image above and it will appear here and on your public gallery.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((p) => (
        <div key={p.id} className="group relative overflow-hidden border border-border bg-card">
          <div className="relative aspect-[4/5]">
            <Image
              src={p.url || '/placeholder.svg'}
              alt={p.title ?? 'Gallery photo'}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
            />
            {p.featured && (
              <span className="absolute left-2 top-2 flex items-center gap-1 bg-primary px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-primary-foreground">
                <Star className="h-3 w-3 fill-current" aria-hidden="true" /> Featured
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 p-3">
            <p className="truncate text-xs text-muted-foreground">{categoryLabel(p.category)}</p>

            {editId === p.id ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  placeholder="Add a caption"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) saveCaption(p.id)
                    if (e.key === 'Escape') setEditId(null)
                  }}
                  className="min-w-0 flex-1 border border-border bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => saveCaption(p.id)}
                  disabled={pending && busyId === p.id}
                  aria-label="Save caption"
                  className="flex items-center justify-center border border-border px-2 py-1 text-primary transition-colors hover:border-primary disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => startEdit(p)}
                className="flex items-center gap-1 text-left text-sm text-foreground transition-colors hover:text-primary"
              >
                <span className="truncate">{p.title || 'Add a caption'}</span>
                <Pencil className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              </button>
            )}

            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggle(p)}
                disabled={pending && busyId === p.id}
                className="flex flex-1 items-center justify-center gap-1 border border-border px-2 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
              >
                <Star className={`h-3.5 w-3.5 ${p.featured ? 'fill-primary text-primary' : ''}`} aria-hidden="true" />
                {p.featured ? 'Unfeature' : 'Feature'}
              </button>

              {confirmId === p.id ? (
                <button
                  type="button"
                  onClick={() => onDelete(p.id)}
                  disabled={pending && busyId === p.id}
                  className="flex-1 border border-red-500/60 bg-red-500/10 px-2 py-1.5 text-xs text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                >
                  {pending && busyId === p.id ? 'Deleting…' : 'Confirm'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmId(p.id)}
                  aria-label="Delete photo"
                  className="flex items-center justify-center border border-border px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:border-red-500/60 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
