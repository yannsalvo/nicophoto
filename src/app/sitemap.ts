import { prisma } from '@/lib/prisma'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.nicodebray.com'

  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    select: { slug: true, updatedAt: true },
  })

  const photos = await prisma.photo.findMany({
    where: { isVisible: true, category: { isVisible: true } },
    select: { slug: true, updatedAt: true, category: { select: { slug: true } } },
  })

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...categories.map((cat) => ({
      url: `${baseUrl}/portfolio/${cat.slug}`,
      lastModified: cat.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...photos.map((photo) => ({
      url: `${baseUrl}/portfolio/${photo.category.slug}/${photo.slug}`,
      lastModified: photo.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
