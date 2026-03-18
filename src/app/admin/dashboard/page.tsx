import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const [photoCount, categoryCount, eventCount] = await Promise.all([
    prisma.photo.count(),
    prisma.category.count(),
    prisma.event.count(),
  ])

  const cards = [
    { label: 'Photos', count: photoCount, href: '/admin/photos' },
    { label: 'Categories', count: categoryCount, href: '/admin/categories' },
    { label: 'Events', count: eventCount, href: '/admin/events' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="border border-border p-6 hover:border-foreground transition-colors"
          >
            <p className="text-3xl font-light">{card.count}</p>
            <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        <Link href="/admin/photos/upload" className="bg-foreground text-background px-4 py-2 text-sm">
          Ajouter des photos
        </Link>
        <Link href="/admin/settings" className="border border-border px-4 py-2 text-sm hover:border-foreground">
          Paramètres
        </Link>
      </div>
    </div>
  )
}

export const dynamic = 'force-dynamic'
