'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewEventPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [form, setForm] = useState({ name: '', slug: '', description: '', date: '', categoryId: '' })

  useEffect(() => {
    fetch('/api/admin/categories').then((r) => r.json()).then((cats) => {
      setCategories(cats)
      if (cats.length > 0) setForm((f) => ({ ...f, categoryId: cats[0].id }))
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const slug = form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, slug, date: form.date ? new Date(form.date).toISOString() : null }),
    })
    router.push('/admin/events')
  }

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Nouvel événement</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Nom</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Catégorie</label>
          <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm">
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
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
