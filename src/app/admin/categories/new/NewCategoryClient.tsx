'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCategoryPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', slug: '', description: '', metaTitle: '', metaDescription: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug }),
    })
    router.push('/admin/categories')
  }

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Nouvelle catégorie</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Nom</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Slug</label>
          <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" placeholder="Auto-généré si vide" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" rows={3} />
        </div>
        <button type="submit" className="bg-foreground text-background px-4 py-2 text-sm">Créer</button>
      </form>
    </div>
  )
}
