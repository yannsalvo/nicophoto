import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'À propos — Nicolas Debray, Photographe Indépendant à Paris',
  description: 'Passionné par la lumière naturelle et les instants minimalistes, Nicolas Debray est photographe indépendant à Paris. Découvrez son approche artistique et son univers visuel.',
  openGraph: {
    title: 'À propos — Nicolas Debray, Photographe Indépendant à Paris',
    description: 'Passionné par la lumière naturelle et les instants minimalistes, Nicolas Debray est photographe indépendant à Paris. Découvrez son approche artistique et son univers visuel.',
  },
}

export default async function AboutPage() {
  const settings = await prisma.siteSettings.findFirst()

  return (
    <section className="pt-[80px] px-6 md:px-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-8">À propos — Nicolas Debray, Photographe à Paris</h1>
      {settings?.bio && (
        <p className="text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
          {settings.bio}
        </p>
      )}
      {settings?.aboutApproach && (
        <div className="border-t border-border pt-8">
          <h2 className="text-lg font-light mb-4">Approche</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {settings.aboutApproach}
          </p>
        </div>
      )}
    </section>
  )
}

export const dynamic = 'force-dynamic'
