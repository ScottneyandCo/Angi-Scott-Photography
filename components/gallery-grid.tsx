'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { FILTER_LABELS } from '@/lib/categories'
import type { DisplayPhoto } from '@/lib/data'
import { cn } from '@/lib/utils'

export function GalleryGrid({ photos }: { photos: DisplayPhoto[] }) {
  const [filter, setFilter] = useState<string>('All')
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered =
    filter === 'All' ? photos : photos.filter((p) => p.category === filter)

  const open = (i: number) => setLightbox(i)
  const close = () => setLightbox(null)
  const prev = () =>
    setLightbox((i) => (i === null ? i : (i - 1 + filtered.length) % filtered.length))
  const next = () =>
    setLightbox((i) => (i === null ? i : (i + 1) % filtered.length))

  return (
    <>
      {/* Filters */}
      <div className="mb-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {FILTER_LABELS.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              'text-xs uppercase tracking-[0.25em] transition-colors',
              filter === cat
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry-style columns */}
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {filtered.map((photo, i) => (
          <button
            key={`${photo.src}-${i}`}
            type="button"
            onClick={() => open(i)}
            className="group relative block w-full overflow-hidden break-inside-avoid"
          >
            <Image
              src={photo.src || '/placeholder.svg'}
              alt={photo.alt}
              width={800}
              height={1000}
              className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="p-5 text-xs uppercase tracking-[0.25em] text-primary">
                {photo.category}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-6 top-6 text-muted-foreground transition-colors hover:text-primary"
          >
            <X className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous"
            className="absolute left-4 text-muted-foreground transition-colors hover:text-primary sm:left-8"
          >
            <ChevronLeft className="h-9 w-9" />
          </button>
          <div className="relative mx-16 max-h-[85vh] max-w-5xl">
            <Image
              src={filtered[lightbox].src || '/placeholder.svg'}
              alt={filtered[lightbox].alt}
              width={1400}
              height={1400}
              className="max-h-[85vh] w-auto object-contain"
            />
            <p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-primary">
              {filtered[lightbox].category}
            </p>
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next"
            className="absolute right-4 text-muted-foreground transition-colors hover:text-primary sm:right-8"
          >
            <ChevronRight className="h-9 w-9" />
          </button>
        </div>
      )}
    </>
  )
}
