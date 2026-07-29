import type { Metadata } from 'next'
import { GalleryGrid } from '@/components/gallery-grid'
import { getDisplayPhotos } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Gallery | Mi Sueño by Angi Scott',
  description:
    'A curated collection of lifestyle, portrait, and event photography by Angi Scott.',
}

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const photos = await getDisplayPhotos()

  return (
    <div className="pt-32 lg:pt-40">
      <header className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.5em] text-primary">The Gallery</p>
        <h1 className="text-balance font-serif text-5xl font-light leading-tight text-foreground sm:text-6xl">
          A collection of moments
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Browse a curated selection of work spanning portraits, couples, events,
          and the everyday beauty of lifestyle photography.
        </p>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <GalleryGrid photos={photos} />
      </section>
    </div>
  )
}
