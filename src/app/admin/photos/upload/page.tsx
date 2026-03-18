'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface UploadedPhoto {
  file: File
  preview: string
  title: string
  publicId: string
  url: string
  width: number
  height: number
  uploading: boolean
  uploaded: boolean
  error?: string
}

export default function UploadPage() {
  const router = useRouter()
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([])
  const [categoryId, setCategoryId] = useState('')
  const [eventId, setEventId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/categories').then((r) => r.json()),
      fetch('/api/admin/events').then((r) => r.json()),
    ]).then(([cats, evts]) => {
      setCategories(cats)
      setEvents(evts)
      if (cats.length > 0) setCategoryId(cats[0].id)
    })
  }, [])

  const handleFiles = useCallback(async (files: FileList) => {
    const newPhotos: UploadedPhoto[] = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      publicId: '',
      url: '',
      width: 0,
      height: 0,
      uploading: false,
      uploaded: false,
    }))
    setPhotos((prev) => [...prev, ...newPhotos])

    // Upload each to Cloudinary
    for (const photo of newPhotos) {
      const sigRes = await fetch('/api/admin/cloudinary-signature', { method: 'POST' })
      const { signature, timestamp, cloudName, apiKey } = await sigRes.json()

      const formData = new FormData()
      formData.append('file', photo.file)
      formData.append('signature', signature)
      formData.append('timestamp', String(timestamp))
      formData.append('api_key', apiKey)
      formData.append('folder', 'portfolio')

      photo.uploading = true
      setPhotos((prev) => [...prev])

      try {
        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        })
        const result = await uploadRes.json()
        photo.publicId = result.public_id
        photo.url = result.secure_url
        photo.width = result.width
        photo.height = result.height
        photo.uploaded = true
      } catch {
        photo.error = 'Echec upload'
      }
      photo.uploading = false
      setPhotos((prev) => [...prev])
    }
  }, [])

  const saveAll = async () => {
    if (!categoryId) return alert('Sélectionner une catégorie')
    setSaving(true)

    const toSave = photos
      .filter((p) => p.uploaded)
      .map((p) => ({
        title: p.title,
        slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        altText: p.title,
        imageUrl: p.url,
        imagePublicId: p.publicId,
        width: p.width,
        height: p.height,
        categoryId,
        eventId: eventId || undefined,
      }))

    await fetch('/api/admin/photos/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ photos: toSave }),
    })

    setSaving(false)
    router.push('/admin/photos')
  }

  return (
    <div>
      <h1 className="text-2xl font-light mb-8">Ajouter des photos</h1>

      <div className="space-y-4 mb-8">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Catégorie</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="border border-border bg-transparent px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Événement</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="border border-border bg-transparent px-3 py-2 text-sm"
            >
              <option value="">Aucun</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>{evt.name}</option>
              ))}
            </select>
          </div>
        </div>

        <label className="block border-2 border-dashed border-border p-12 text-center hover:border-foreground transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
          <span className="text-muted-foreground">
            Cliquer ou glisser des images ici
          </span>
        </label>
      </div>

      {photos.length > 0 && (
        <>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
            {photos.map((photo, i) => (
              <div key={i} className="relative aspect-[3/4] overflow-hidden border border-border">
                <Image src={photo.preview} alt={photo.title} fill className="object-cover" sizes="150px" />
                {photo.uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-xs animate-pulse">Upload...</span>
                  </div>
                )}
                {photo.error && (
                  <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                    <span className="text-white text-xs">{photo.error}</span>
                  </div>
                )}
                {photo.uploaded && (
                  <div className="absolute top-1 right-1 bg-green-500 w-3 h-3 rounded-full" />
                )}
              </div>
            ))}
          </div>
          <button
            onClick={saveAll}
            disabled={saving || !photos.some((p) => p.uploaded)}
            className="bg-foreground text-background px-6 py-2 text-sm disabled:opacity-50"
          >
            {saving ? 'Enregistrement...' : `Enregistrer ${photos.filter((p) => p.uploaded).length} photos`}
          </button>
        </>
      )}
    </div>
  )
}
