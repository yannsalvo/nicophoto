'use client'

import Link from 'next/link'

interface HeaderProps {
  photographerName: string
  instagram?: string
  email?: string
}

export function Header({ photographerName, instagram, email }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link href="/" className="font-body font-light text-lg tracking-wide text-foreground" data-cursor="hover">
          {photographerName}
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor="hover">
            A propos
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-cursor="hover">
            Contact
          </Link>
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-cursor="hover"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-cursor="hover"
              aria-label="Email"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          )}
        </nav>
      </div>
    </header>
  )
}
