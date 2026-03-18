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
  const settings = await prisma.siteSettings.findFirst()
  return {
    title: settings?.metaTitle || 'Nicolas Debray — Photographe',
    description: settings?.metaDescription || 'Portfolio de Nicolas Debray',
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await prisma.siteSettings.findFirst()

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
        />
      </body>
    </html>
  )
}
