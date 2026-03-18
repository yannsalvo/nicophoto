'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const [form, setForm] = useState<Record<string, unknown> | null>(null)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/events/${params.id}`).then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ]).then(([evt, cats]) => {
      setForm(evt)
      setCategories(cats)
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    await fetch(`/api/admin/events/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        description: form.description,
        categoryId: form.categoryId,
        date: form.date ? new Date(form.date as string).toISOString() : null,
        isVisible: form.isVisible,
      }),
    })
    router.push('/admin/events')
  }

  if (!form) return <div>Chargement...</div>

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Modifier l&apos;événement</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Nom</label>
          <input type="text" value={(form.name as string) || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Catégorie</label>
          <select value={(form.categoryId as string) || ''} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm">
            {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Date</label>
          <input type="date" value={(form.date as string)?.slice(0, 10) || ''} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Description</label>
          <textarea value={(form.description as string) || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" rows={3} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isVisible as boolean} onChange={(e) => setForm({ ...form, isVisible: e.target.checked })} />
          Visible
        </label>
        <div className="flex gap-3">
          <button type="submit" className="bg-foreground text-background px-4 py-2 text-sm">Enregistrer</button>
          <button type="button" onClick={() => router.back()} className="border border-border px-4 py-2 text-sm">Annuler</button>
        </div>
      </form>
    </div>
  )
}
