import type { Metadata } from 'next'
import ContactPage from './ContactClient'

export const metadata: Metadata = {
  title: 'Contacter Nicolas Debray — Photographe à Paris',
  description: 'Envie de collaborer ou de télécharger des photos ? Contactez Nicolas Debray, photographe à Paris, pour toute demande professionnelle ou artistique.',
  openGraph: {
    title: 'Contacter Nicolas Debray — Photographe à Paris',
    description: 'Envie de collaborer ou de télécharger des photos ? Contactez Nicolas Debray, photographe à Paris, pour toute demande professionnelle ou artistique.',
  },
}

export default ContactPage

export const dynamic = 'force-dynamic'
