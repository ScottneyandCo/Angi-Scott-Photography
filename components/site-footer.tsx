import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { InstagramIcon, FacebookIcon } from '@/components/social-icons'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="flex flex-col items-center gap-8 text-center">
          <Link href="/" className="flex flex-col items-center gap-4">
            <Image
              src="/logo.png"
              alt="Mi Sueño by Angi Scott logo"
              width={80}
              height={80}
              className="h-20 w-20 rounded-full"
            />
            <span className="font-serif text-2xl tracking-[0.25em] text-primary">MI SUEÑO</span>
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100093686346606"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <FacebookIcon className="h-5 w-5 object-contain" />
            </a>
            <a
              href="mailto:misuenophoto@gmail.com"
              aria-label="Email"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-border/40 pt-8 text-center">
          <p className="text-xs tracking-[0.15em] text-muted-foreground">
            &copy; {new Date().getFullYear()} Mi Sueño by Angi Scott. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60 transition-colors hover:text-primary"
          >
            Studio Login
          </Link>
        </div>
      </div>
    </footer>
  )
}
