import type { Metadata } from 'next'
import { Mail, Phone, MapPin } from 'lucide-react'
import { InstagramIcon } from '@/components/social-icons'
import { ContactForm } from '@/components/contact-form'
import { getContent } from '@/lib/data'

export const metadata: Metadata = {
  title: 'Contact | Mi Sueño by Angi Scott',
  description:
    'Get in touch with Angi Scott to book a portrait, couples, family, or event photography session.',
}

export const dynamic = 'force-dynamic'

export default async function ContactPage() {
  const content = await getContent()

  const email = content['contact.email']
  const phone = content['contact.phone']
  const igHandle = content['contact.instagram']
  const igUrl = `https://instagram.com/${igHandle.replace(/^@/, '')}`

  const details = [
    { icon: Mail, label: 'Email', value: email, href: `mailto:${email}` },
    {
      icon: Phone,
      label: 'Phone',
      value: phone,
      href: `tel:${phone.replace(/[^0-9+]/g, '')}`,
    },
    { icon: MapPin, label: 'Based in', value: content['contact.location'] },
    { icon: InstagramIcon, label: 'Instagram', value: igHandle, href: igUrl },
  ]

  return (
    <div className="pt-32 lg:pt-40">
      <header className="mx-auto max-w-3xl px-6 pb-16 text-center">
        <p className="mb-6 text-xs uppercase tracking-[0.5em] text-primary">Get in Touch</p>
        <h1 className="text-balance font-serif text-5xl font-light leading-tight text-foreground sm:text-6xl">
          Let&apos;s create something beautiful
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Tell me a little about what you have in mind and I&apos;ll get back to
          you to start planning your session.
        </p>
      </header>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10 lg:pb-32">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          {/* Details */}
          <div>
            <h2 className="font-serif text-2xl font-light text-foreground">Contact Details</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Prefer to reach out directly? Use any of the options below — I&apos;d
              love to hear from you.
            </p>
            <ul className="mt-10 space-y-8">
              {details.map((item) => {
                const Icon = item.icon
                const content = (
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border/60 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.25em] text-muted-foreground">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-foreground">{item.value}</span>
                    </span>
                  </div>
                )
                return (
                  <li key={item.label}>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="block transition-opacity hover:opacity-80"
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Form */}
          <div className="border border-border/60 bg-card p-8 sm:p-12">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  )
}
