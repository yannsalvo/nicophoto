import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { CategoryGalleryClient } from '@/components/CategoryGalleryClient'
import type { Metadata } from 'next'

interface Props {
  params: { categorySlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.categorySlug } })
  if (!category) return {}
  return {
    title: category.metaTitle || `${category.name} — Nicolas Debray`,
    description: category.metaDescription || category.description || undefined,
  }
}

export async function generateStaticParams() {
  try {
    const categories = await prisma.category.findMany({
      where: { isVisible: true },
      select: { slug: true },
    })
    return categories.map((c) => ({ categorySlug: c.slug }))
  } catch {
    return []
  }
}

export default async function CategoryPage({ params }: Props) {
  const category = await prisma.category.findUnique({
    where: { slug: params.categorySlug },
    include: {
      events: {
        where: { isVisible: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!category || !category.isVisible) notFound()

  // Sort photos by takenAt (newest first), fallback to createdAt
  const photos = await prisma.photo.findMany({
    where: {
      categoryId: category.id,
      isVisible: true,
    },
    include: {
      event: { select: { name: true } },
    },
    orderBy: [
      { isFeatured: 'desc' },
      { takenAt: 'desc' },
      { createdAt: 'desc' },
    ],
  })

  return (
    <CategoryGalleryClient
      categorySlug={category.slug}
      categoryName={category.name}
      photos={photos.map((p) => ({
        id: p.id,
        title: p.title,
        slug: p.slug,
        imageUrl: p.imageUrl,
        width: p.width,
        height: p.height,
        isFeatured: p.isFeatured,
        event: p.event,
      }))}
      events={category.events.map((e) => ({
        id: e.id,
        name: e.name,
        slug: e.slug,
        date: e.date?.toISOString() || null,
      }))}
    />
  )
}
