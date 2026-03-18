import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { DownloadPageClient } from './DownloadPageClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Télécharger les photos — Nicolas Debray',
  description: 'Téléchargez les photos de vos événements',
}

export default async function DownloadPage() {
  const settings = await prisma.siteSettings.findFirst()

  if (!settings?.allowDownload) {
    redirect('/')
  }

  const events = await prisma.event.findMany({
    where: { isVisible: true },
    include: {
      category: { select: { name: true, slug: true } },
      _count: { select: { photos: { where: { isVisible: true } } } },
    },
    orderBy: { date: 'desc' },
  })

  return (
    <DownloadPageClient
      events={events.map((e) => ({
        id: e.id,
        name: e.name,
        slug: e.slug,
        date: e.date?.toISOString() || null,
        coverImageUrl: e.coverImageUrl,
        categoryName: e.category.name,
        photoCount: e._count.photos,
      }))}
    />
  )
}

export const dynamic = 'force-dynamic'
