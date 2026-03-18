import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: { categorySlug: string; photoSlug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const photo = await prisma.photo.findUnique({ where: { slug: params.photoSlug } })
  if (!photo) return {}
  return {
    title: photo.metaTitle || `${photo.title} — Nicolas Debray`,
    description: photo.metaDescription || photo.description || undefined,
  }
}

export async function generateStaticParams() {
  const photos = await prisma.photo.findMany({
    where: { isVisible: true, category: { isVisible: true } },
    include: { category: { select: { slug: true } } },
    select: { slug: true, category: { select: { slug: true } } },
  })
  return photos.map((p) => ({
    categorySlug: p.category.slug,
    photoSlug: p.slug,
  }))
}

export default async function PhotoPage({ params }: Props) {
  const photo = await prisma.photo.findUnique({
    where: { slug: params.photoSlug },
    include: {
      category: { select: { name: true, slug: true } },
      event: { select: { name: true, slug: true } },
    },
  })

  if (!photo || !photo.isVisible) notFound()

  const settings = await prisma.siteSettings.findFirst()

  return (
    <section className="pt-[80px] px-6 md:px-10 max-w-5xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/portfolio/${photo.category.slug}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-cursor="hover"
        >
          &larr; {photo.category.name}
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <Image
            src={photo.imageUrl}
            alt={photo.altText || photo.title}
            width={photo.width}
            height={photo.height}
            className="w-full h-auto"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
        </div>

        <div className="lg:w-72 space-y-6">
          <div>
            <h1 className="text-xl font-light">{photo.title}</h1>
            {photo.event && (
              <p className="text-sm text-muted-foreground mt-1">{photo.event.name}</p>
            )}
            {photo.description && (
              <p className="text-sm text-muted-foreground mt-3">{photo.description}</p>
            )}
          </div>

          {/* EXIF data */}
          {settings?.showExifData && (photo.camera || photo.focalLength || photo.aperture || photo.shutterSpeed || photo.iso) && (
            <div className="space-y-2 text-xs text-muted-foreground border-t border-border pt-4">
              {photo.camera && (
                <div className="flex justify-between">
                  <span>Appareil</span>
                  <span className="text-foreground">{photo.camera}</span>
                </div>
              )}
              {photo.focalLength && (
                <div className="flex justify-between">
                  <span>Focale</span>
                  <span className="text-foreground">{photo.focalLength}</span>
                </div>
              )}
              {photo.aperture && (
                <div className="flex justify-between">
                  <span>Ouverture</span>
                  <span className="text-foreground">{photo.aperture}</span>
                </div>
              )}
              {photo.shutterSpeed && (
                <div className="flex justify-between">
                  <span>Vitesse</span>
                  <span className="text-foreground">{photo.shutterSpeed}</span>
                </div>
              )}
              {photo.iso && (
                <div className="flex justify-between">
                  <span>ISO</span>
                  <span className="text-foreground">{photo.iso}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
