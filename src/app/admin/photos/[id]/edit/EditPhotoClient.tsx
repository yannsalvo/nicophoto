'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function EditPhotoPage() {
  const params = useParams()
  const router = useRouter()
  const [photo, setPhoto] = useState<Record<string, unknown> | null>(null)
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([])

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/photos/${params.id}`).then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
      fetch('/api/admin/events').then((r) => r.json()),
    ]).then(([p, cats, evts]) => {
      setPhoto(p)
      setCategories(cats)
      setEvents(evts)
    })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!photo) return
    await fetch(`/api/admin/photos/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: photo.title,
        description: photo.description,
        altText: photo.altText,
        categoryId: photo.categoryId,
        eventId: photo.eventId || null,
        isFeatured: photo.isFeatured,
        isVisible: photo.isVisible,
        takenAt: photo.takenAt || null,
      }),
    })
    router.push('/admin/photos')
  }

  if (!photo) return <div>Chargement...</div>

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Modifier la photo</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Titre</label>
          <input
            type="text"
            value={(photo.title as string) || ''}
            onChange={(e) => setPhoto({ ...photo, title: e.target.value })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Description</label>
          <textarea
            value={(photo.description as string) || ''}
            onChange={(e) => setPhoto({ ...photo, description: e.target.value })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm"
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Texte alternatif</label>
          <input
            type="text"
            value={(photo.altText as string) || ''}
            onChange={(e) => setPhoto({ ...photo, altText: e.target.value })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Catégorie</label>
          <select
            value={(photo.categoryId as string) || ''}
            onChange={(e) => setPhoto({ ...photo, categoryId: e.target.value })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Événement</label>
          <select
            value={(photo.eventId as string) || ''}
            onChange={(e) => setPhoto({ ...photo, eventId: e.target.value })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm"
          >
            <option value="">Aucun</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>{evt.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Date de prise de vue</label>
          <input
            type="datetime-local"
            value={(photo.takenAt as string)?.slice(0, 16) || ''}
            onChange={(e) => setPhoto({ ...photo, takenAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm"
          />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={photo.isFeatured as boolean}
              onChange={(e) => setPhoto({ ...photo, isFeatured: e.target.checked })}
            />
            A la une
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={photo.isVisible as boolean}
              onChange={(e) => setPhoto({ ...photo, isVisible: e.target.checked })}
            />
            Visible
          </label>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" className="bg-foreground text-background px-4 py-2 text-sm">Enregistrer</button>
          <button type="button" onClick={() => router.back()} className="border border-border px-4 py-2 text-sm">Annuler</button>
        </div>
      </form>
    </div>
  )
}
