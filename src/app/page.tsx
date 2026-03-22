import { Suspense } from 'react'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { HomeMasonry } from '@/components/HomeMasonry'

export const metadata: Metadata = {
  title: 'Photographe à Paris | Nicolas Debray — Lumière & Minimalisme',
  description: 'Photographe indépendant basé à Paris, spécialisé dans la lumière naturelle et les compositions minimalistes. Découvrez le portfolio de Nicolas Debray et téléchargez ses photos.',
  openGraph: {
    title: 'Photographe à Paris | Nicolas Debray — Lumière & Minimalisme',
    description: 'Photographe indépendant basé à Paris, spécialisé dans la lumière naturelle et les compositions minimalistes. Découvrez le portfolio de Nicolas Debray et téléchargez ses photos.',
  },
}

async function getHomeData() {
  const [photos, categories] = await Promise.all([
    prisma.photo.findMany({
      where: { isVisible: true, category: { isVisible: true } },
      include: {
        category: { select: { slug: true } },
        event: { select: { name: true, slug: true } },
      },
      orderBy: [
        { isFeatured: 'desc' },
        { takenAt: 'desc' },
        { createdAt: 'desc' },
      ],
    }),
    prisma.category.findMany({
      where: { isVisible: true },
      orderBy: { order: 'asc' },
      select: { slug: true, name: true },
    }),
  ])

  return { photos, categories }
}

export default async function HomePage() {
  const { photos, categories } = await getHomeData()

  const settings = await prisma.siteSettings.findFirst()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: settings?.photographerName || 'Nicolas Debray',
    description: settings?.metaDescription || 'Photographe indépendant basé à Paris, spécialisé dans la lumière naturelle et les compositions minimalistes.',
    author: {
      '@type': 'Person',
      name: settings?.photographerName || 'Nicolas Debray',
      jobTitle: 'Photographe',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Paris',
        addressCountry: 'FR',
      },
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="sr-only">Photographe à Paris — Nicolas Debray</h1>
      <Suspense fallback={<div className="pt-[80px] flex justify-center"><div className="animate-pulse">Chargement...</div></div>}>
        <HomeMasonry
          photos={photos.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            imageUrl: p.imageUrl,
            width: p.width,
            height: p.height,
            isFeatured: p.isFeatured,
            category: p.category,
            event: p.event,
          }))}
          categories={categories}
        />
      </Suspense>
    </>
  )
}

export const dynamic = 'force-dynamic'
