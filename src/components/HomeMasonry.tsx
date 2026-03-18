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
  category: { slug: string }
  event?: { name: string; slug: string } | null
}

interface Category {
  slug: string
  name: string
}

interface HomeMasonryProps {
  photos: Photo[]
  categories: Category[]
}

export function HomeMasonry({ photos, categories }: HomeMasonryProps) {
  // Featured photos first, then the rest
  const sortedPhotos = [...photos].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1
    if (!a.isFeatured && b.isFeatured) return 1
    return 0
  })

  return (
    <section className="pt-[80px] px-4 md:px-8 max-w-[1800px] mx-auto">
      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/portfolio/${cat.slug}`}
            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 rounded-full"
            data-cursor="hover"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Masonry grid - landscape photos span 2 columns */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
        {sortedPhotos.map((photo) => {
          const isLandscape = photo.width > photo.height

          return (
            <Link
              key={photo.id}
              href={`/portfolio/${photo.category.slug}/${photo.slug}`}
              className={`block relative group overflow-hidden break-inside-avoid ${
                isLandscape ? 'md:col-span-2 md:break-inside-auto' : ''
              }`}
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
              {/* Featured badge */}
              {photo.isFeatured && (
                <div className="absolute top-3 left-3 bg-white/90 text-black text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-medium">
                  A la une
                </div>
              )}
              {/* Hover overlay with event name */}
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
