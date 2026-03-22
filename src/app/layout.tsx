import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CustomCursor } from '@/components/CustomCursor'
import { ImageProtection } from '@/components/ImageProtection'
import { prisma } from '@/lib/prisma'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await prisma.siteSettings.findFirst()
    return {
      title: {
        default: settings?.metaTitle || 'Photographe à Paris | Nicolas Debray — Lumière & Minimalisme',
        template: '%s | Nicolas Debray',
      },
      description: settings?.metaDescription || 'Photographe indépendant basé à Paris, spécialisé dans la lumière naturelle et les compositions minimalistes. Découvrez le portfolio de Nicolas Debray et téléchargez ses photos.',
      openGraph: {
        title: settings?.metaTitle || 'Photographe à Paris | Nicolas Debray — Lumière & Minimalisme',
        description: settings?.metaDescription || 'Photographe indépendant basé à Paris, spécialisé dans la lumière naturelle et les compositions minimalistes. Découvrez le portfolio de Nicolas Debray et téléchargez ses photos.',
        locale: 'fr_FR',
        type: 'website',
      },
    }
  } catch {
    return {
      title: {
        default: 'Photographe à Paris | Nicolas Debray — Lumière & Minimalisme',
        template: '%s | Nicolas Debray',
      },
      description: 'Photographe indépendant basé à Paris, spécialisé dans la lumière naturelle et les compositions minimalistes. Découvrez le portfolio de Nicolas Debray et téléchargez ses photos.',
      openGraph: {
        title: 'Photographe à Paris | Nicolas Debray — Lumière & Minimalisme',
        description: 'Photographe indépendant basé à Paris, spécialisé dans la lumière naturelle et les compositions minimalistes. Découvrez le portfolio de Nicolas Debray et téléchargez ses photos.',
        locale: 'fr_FR',
        type: 'website',
      },
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let settings = null
  try {
    settings = await prisma.siteSettings.findFirst()
  } catch {
    // DB unavailable during build
  }

  return (
    <html lang="fr">
      <body className={`${plusJakarta.variable} font-body antialiased`}>
        <CustomCursor />
        <ImageProtection />
        <Header
          photographerName={settings?.photographerName || 'Nicolas Debray'}
          instagram={settings?.instagram || undefined}
          email={settings?.email || undefined}
        />
        <main className="min-h-screen">{children}</main>
        <Footer
          photographerName={settings?.photographerName || 'Nicolas Debray'}
          location={settings?.location || undefined}
          email={settings?.email || undefined}
          instagram={settings?.instagram || undefined}
          allowDownload={settings?.allowDownload || false}
        />
      </body>
    </html>
  )
}
