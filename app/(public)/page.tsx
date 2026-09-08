import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getFeaturedDisplay, getContent } from '@/lib/data'
import { HeroBackground } from '@/components/hero-background'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featured, content] = await Promise.all([
    getFeaturedDisplay(),
    getContent(),
  ])

  return (
    <>
      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <HeroBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 text-xs uppercase tracking-[0.5em] text-primary">
            {content['home.hero.eyebrow']}
          </p>
          <h1 className="text-balance font-serif text-5xl font-light leading-[1.05] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            {content['home.hero.title']}
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            {content['home.hero.subtitle']}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/gallery"
              className="group inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              View Gallery
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 border border-border px-8 py-4 text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="mx-auto max-w-5xl px-6 py-24 text-center lg:py-32">
        <p className="mb-6 text-xs uppercase tracking-[0.4em] text-primary">
          {content['home.vision.eyebrow']}
        </p>
        <h2 className="text-balance font-serif text-3xl font-light leading-snug text-foreground sm:text-4xl md:text-5xl">
          {content['home.vision.title']}
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          {content['home.vision.body']}
        </p>
      </section>

      {/* Featured grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.4em] text-primary">Selected Work</p>
            <h2 className="font-serif text-3xl font-light text-foreground sm:text-4xl">
              Featured Moments
            </h2>
          </div>
          <Link
            href="/gallery"
            className="group hidden items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
          >
            All Work
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {featured.map((photo, i) => (
            <div
              key={`${photo.src}-${i}`}
              className={`group relative overflow-hidden ${
                i === 0 ? 'col-span-2 row-span-2 md:col-span-2' : ''
              }`}
            >
              <Image
                src={photo.src || '/placeholder.svg'}
                alt={photo.alt}
                width={800}
                height={i === 0 ? 800 : 600}
                className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                  i === 0 ? 'aspect-square md:aspect-[4/3.2]' : 'aspect-[4/5]'
                }`}
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="p-5 text-xs uppercase tracking-[0.25em] text-primary">
                  {photo.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-primary"
          >
            View Full Gallery
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-border/60 bg-card">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-primary">
            {content['home.cta.eyebrow']}
          </p>
          <h2 className="text-balance font-serif text-4xl font-light leading-tight text-foreground sm:text-5xl">
            {content['home.cta.title']}
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Whether it&apos;s a portrait, a celebration, or a once-in-a-lifetime
            moment, let&apos;s craft something beautiful together.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 bg-primary px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book a Session
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
