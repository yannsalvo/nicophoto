import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export default async function PortfolioPage() {
  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    orderBy: { order: 'asc' },
    include: {
      photos: {
        where: { isVisible: true },
        take: 1,
        orderBy: { order: 'asc' },
      },
      _count: { select: { photos: { where: { isVisible: true } } } },
    },
  })

  return (
    <section className="pt-[80px] px-6 md:px-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-12 text-center">Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/portfolio/${cat.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-lg"
            data-cursor="hover"
          >
            {cat.coverImageUrl || cat.photos[0]?.imageUrl ? (
              <Image
                src={cat.coverImageUrl || cat.photos[0].imageUrl}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 bg-muted-foreground/10" />
            )}
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-xl font-light tracking-wide">{cat.name}</h2>
              <span className="text-xs text-white/70 mt-2">
                {cat._count.photos} photo{cat._count.photos > 1 ? 's' : ''}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
