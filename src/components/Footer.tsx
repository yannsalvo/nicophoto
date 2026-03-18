import Link from 'next/link'

interface FooterProps {
  photographerName: string
  location?: string
  email?: string
  instagram?: string
}

export function Footer({ photographerName, location, email, instagram }: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border mt-24 py-12 px-6 md:px-10">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <span className="font-body font-light text-lg text-foreground">
            {photographerName}
          </span>
          {location && (
            <span className="text-xs text-muted-foreground tracking-wide">{location}</span>
          )}
          <span className="text-xs text-muted-foreground/60 mt-1">&copy; {year}</span>
        </div>
        <nav className="flex items-center gap-5" aria-label="Liens sociaux">
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
        </nav>
      </div>
    </footer>
  )
}
