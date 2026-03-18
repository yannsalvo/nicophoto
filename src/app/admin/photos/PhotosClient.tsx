'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Photo {
  id: string
  title: string
  slug: string
  imageUrl: string
  width: number
  height: number
  isFeatured: boolean
  isVisible: boolean
  category: { name: string; slug: string }
  event?: { name: string } | null
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/photos')
      .then((r) => r.json())
      .then((data) => {
        setPhotos(data)
        setLoading(false)
      })
  }, [])

  const toggleFeatured = async (id: string, current: boolean) => {
    await fetch(`/api/admin/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: !current }),
    })
    setPhotos(photos.map((p) => (p.id === id ? { ...p, isFeatured: !current } : p)))
  }

  const toggleVisible = async (id: string, current: boolean) => {
    await fetch(`/api/admin/photos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVisible: !current }),
    })
    setPhotos(photos.map((p) => (p.id === id ? { ...p, isVisible: !current } : p)))
  }

  const deletePhoto = async (id: string) => {
    if (!confirm('Supprimer cette photo ?')) return
    await fetch(`/api/admin/photos/${id}`, { method: 'DELETE' })
    setPhotos(photos.filter((p) => p.id !== id))
  }

  if (loading) return <div className="text-muted-foreground">Chargement...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">Photos ({photos.length})</h1>
        <Link href="/admin/photos/upload" className="bg-foreground text-background px-4 py-2 text-sm">
          Ajouter
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group border border-border">
            <div className="aspect-[3/4] relative overflow-hidden">
              <Image
                src={photo.imageUrl}
                alt={photo.title}
                fill
                className="object-cover"
                sizes="200px"
              />
              {!photo.isVisible && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xs">Masquée</span>
                </div>
              )}
              {photo.isFeatured && (
                <div className="absolute top-1 left-1 bg-yellow-400 text-black text-[9px] px-2 py-0.5 rounded-full">
                  A la une
                </div>
              )}
            </div>
            <div className="p-2 space-y-1">
              <p className="text-xs truncate">{photo.title}</p>
              <p className="text-[10px] text-muted-foreground">{photo.category.name}</p>
              <div className="flex gap-1 pt-1">
                <button
                  onClick={() => toggleFeatured(photo.id, photo.isFeatured)}
                  className={`text-[9px] px-2 py-0.5 border ${photo.isFeatured ? 'bg-yellow-100 border-yellow-400' : 'border-border'}`}
                >
                  {photo.isFeatured ? 'Retirer une' : 'A la une'}
                </button>
                <button
                  onClick={() => toggleVisible(photo.id, photo.isVisible)}
                  className="text-[9px] px-2 py-0.5 border border-border"
                >
                  {photo.isVisible ? 'Masquer' : 'Afficher'}
                </button>
                <Link href={`/admin/photos/${photo.id}/edit`} className="text-[9px] px-2 py-0.5 border border-border">
                  Editer
                </Link>
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="text-[9px] px-2 py-0.5 border border-red-300 text-red-500"
                >
                  Suppr
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
