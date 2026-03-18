'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [form, setForm] = useState<Record<string, unknown> | null>(null)

  useEffect(() => {
    fetch(`/api/admin/categories/${params.id}`).then((r) => r.json()).then(setForm)
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    await fetch(`/api/admin/categories/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, slug: form.slug, description: form.description, isVisible: form.isVisible, metaTitle: form.metaTitle, metaDescription: form.metaDescription }),
    })
    router.push('/admin/categories')
  }

  if (!form) return <div>Chargement...</div>

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Modifier la catégorie</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Nom</label>
          <input type="text" value={(form.name as string) || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Slug</label>
          <input type="text" value={(form.slug as string) || ''} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
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
