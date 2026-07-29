import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { getContent } from '@/lib/data'

export const metadata: Metadata = {
  title: 'About | Mi Sueño by Angi Scott',
  description:
    'Meet Angi Scott — the photographer behind Mi Sueño, capturing life’s most meaningful moments.',
}

export const dynamic = 'force-dynamic'

const values = [
  {
    title: 'Authentic',
    description:
      'Real emotion over posed perfection. The candid in-between moments are where the magic lives.',
  },
  {
    title: 'Cinematic',
    description:
      'A refined, film-inspired approach to light and color that gives every image a timeless feel.',
  },
  {
    title: 'Personal',
    description:
      'Every session begins with your story. Your images should feel unmistakably like you.',
  },
]

export default async function AboutPage() {
  const content = await getContent()

  return (
    <div className="pt-32 lg:pt-40">
      {/* Intro */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <Image
              src="/about-angi.png"
              alt="Portrait of photographer Angi Scott"
              width={700}
              height={875}
              className="w-full object-cover"
              priority
            />
          </div>
          <div>
            <p className="mb-6 text-xs uppercase tracking-[0.5em] text-primary">
              The Photographer
            </p>
            <h1 className="text-balance font-serif text-4xl font-light leading-tight text-foreground sm:text-5xl md:text-6xl">
              {content['about.title']}
            </h1>
            <div className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
              <p>{content['about.p1']}</p>
              <p>{content['about.p2']}</p>
              <p>{content['about.p3']}</p>
            </div>
            <Link
              href="/contact"
              className="group mt-10 inline-flex items-center gap-3 border border-primary/60 px-8 py-4 text-xs uppercase tracking-[0.25em] text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Work With Me
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy / values */}
      <section className="border-t border-border/60 bg-card">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-primary">My Approach</p>
            <h2 className="text-balance font-serif text-3xl font-light leading-snug text-foreground sm:text-4xl">
              Photography rooted in feeling, not just the frame
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-border/60 sm:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="bg-background p-10 text-center">
                <h3 className="font-serif text-2xl font-light text-primary">{value.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center lg:py-32">
        <blockquote className="text-balance font-serif text-3xl font-light italic leading-snug text-foreground sm:text-4xl">
          {`\u201C${content['about.quote']}\u201D`}
        </blockquote>
        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-primary">— Angi Scott</p>
      </section>
    </div>
  )
}
