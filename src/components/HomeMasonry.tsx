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
  const featuredPhotos = photos.filter((p) => p.isFeatured)
  const regularPhotos = photos.filter((p) => !p.isFeatured)

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

      {/* Featured photos - hero section, full width landscape */}
      {featuredPhotos.length > 0 && (
        <div className="mb-8 space-y-4">
          {featuredPhotos.map((photo) => (
            <Link
              key={photo.id}
              href={`/portfolio/${photo.category.slug}/${photo.slug}`}
              className="block relative group overflow-hidden"
              data-cursor="hover"
            >
              <div className="relative w-full overflow-hidden" style={{ maxHeight: '70vh' }}>
                <Image
                  src={photo.imageUrl}
                  alt={photo.title}
                  width={photo.width}
                  height={photo.height}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  sizes="100vw"
                  priority
                />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-end">
                <div className="p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-white text-sm tracking-wide font-light">
                    {photo.title}
                  </span>
                  {photo.event && (
                    <span className="text-white/80 text-xs tracking-wide ml-3">
                      {photo.event.name}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Regular photos - 3 column grid, landscape photos span 2 columns */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-auto">
        {regularPhotos.map((photo) => {
          const isLandscape = photo.width > photo.height

          return (
            <Link
              key={photo.id}
              href={`/portfolio/${photo.category.slug}/${photo.slug}`}
              className={`block relative group overflow-hidden ${
                isLandscape ? 'col-span-2' : 'col-span-1'
              }`}
              data-cursor="hover"
            >
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                width={photo.width}
                height={photo.height}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes={isLandscape ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 50vw, 33vw'}
              />
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
