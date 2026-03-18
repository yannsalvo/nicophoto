'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [form, setForm] = useState<Record<string, unknown> | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings').then((r) => r.json()).then(setForm)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    setSaving(true)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    router.refresh()
  }

  if (!form) return <div>Chargement...</div>

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Paramètres</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Nom du photographe</label>
          <input type="text" value={(form.photographerName as string) || ''} onChange={(e) => setForm({ ...form, photographerName: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Tagline</label>
          <input type="text" value={(form.tagline as string) || ''} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Bio</label>
          <textarea value={(form.bio as string) || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" rows={4} />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Approche</label>
          <textarea value={(form.aboutApproach as string) || ''} onChange={(e) => setForm({ ...form, aboutApproach: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" rows={4} />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Localisation</label>
          <input type="text" value={(form.location as string) || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Email</label>
          <input type="email" value={(form.email as string) || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Instagram</label>
          <input type="url" value={(form.instagram as string) || ''} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm" />
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.showExifData as boolean} onChange={(e) => setForm({ ...form, showExifData: e.target.checked })} />
            Afficher les données EXIF
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.allowDownload as boolean} onChange={(e) => setForm({ ...form, allowDownload: e.target.checked })} />
            Autoriser le téléchargement
          </label>
        </div>
        <button type="submit" disabled={saving} className="bg-foreground text-background px-6 py-2 text-sm disabled:opacity-50">
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>
    </div>
  )
}
