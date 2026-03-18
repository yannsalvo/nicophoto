'use client'

import Image from 'next/image'
import Link from 'next/link'

interface Photo {
  id: string
  title: string
  slug: string
  imageUrl: string
  width: number
  height: number
  isFeatured: boolean
  event?: { name: string } | null
}

interface Event {
  id: string
  name: string
  slug: string
  date: string | null
}

interface CategoryGalleryClientProps {
  categorySlug: string
  categoryName: string
  photos: Photo[]
  events: Event[]
}

export function CategoryGalleryClient({
  categorySlug,
  categoryName,
  photos,
  events,
}: CategoryGalleryClientProps) {
  return (
    <section className="pt-[80px] px-4 md:px-8 max-w-[1800px] mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-4 text-center">{categoryName}</h1>

      {/* Event filters */}
      {events.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {events.map((evt) => (
            <span
              key={evt.id}
              className="text-xs tracking-widest uppercase text-muted-foreground border border-border px-4 py-2 rounded-full"
            >
              {evt.name}
            </span>
          ))}
        </div>
      )}

      {/* Photo grid - landscape photos span 2 columns */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {photos.map((photo) => {
          const isLandscape = photo.width > photo.height

          return (
            <Link
              key={photo.id}
              href={`/portfolio/${categorySlug}/${photo.slug}`}
              className="block relative group overflow-hidden break-inside-avoid"
              data-cursor="hover"
              style={isLandscape ? { columnSpan: 'all' } : undefined}
            >
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes={isLandscape ? '100vw' : '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                <div className="p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {photo.event && (
                    <span className="text-white text-xs tracking-wide">
                      {photo.event.name}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
