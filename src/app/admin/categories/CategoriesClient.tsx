'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  order: number
  isVisible: boolean
  _count: { photos: number; events: number }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('/api/admin/categories').then((r) => r.json()).then(setCategories)
  }, [])

  const deleteCategory = async (id: string) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    setCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">Catégories</h1>
        <Link href="/admin/categories/new" className="bg-foreground text-background px-4 py-2 text-sm">
          Nouvelle catégorie
        </Link>
      </div>
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between border border-border p-4">
            <div>
              <p className="font-light">{cat.name}</p>
              <p className="text-xs text-muted-foreground">
                {cat._count.photos} photos, {cat._count.events} events
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/categories/${cat.id}/edit`} className="text-xs border border-border px-3 py-1">
                Editer
              </Link>
              <button onClick={() => deleteCategory(cat.id)} className="text-xs border border-red-300 text-red-500 px-3 py-1">
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
