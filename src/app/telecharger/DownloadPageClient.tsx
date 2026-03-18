'use client'

import { useState } from 'react'
import Image from 'next/image'

interface EventItem {
  id: string
  name: string
  slug: string
  date: string | null
  coverImageUrl: string | null
  categoryName: string
  photoCount: number
}

interface Props {
  events: EventItem[]
}

export function DownloadPageClient({ events }: Props) {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (eventId: string, eventName: string) => {
    setDownloading(eventId)
    try {
      const res = await fetch(`/api/download/${eventId}`)
      if (!res.ok) throw new Error('Erreur lors du téléchargement')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${eventName.replace(/[^a-zA-Z0-9àâäéèêëïîôùûüÿçœæ\s-]/g, '')}.zip`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      alert('Une erreur est survenue lors du téléchargement.')
    } finally {
      setDownloading(null)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return null
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <section className="pt-[80px] px-6 md:px-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-3">Télécharger les photos</h1>
      <p className="text-muted-foreground mb-10">
        Sélectionnez un événement pour télécharger toutes les photos au format ZIP.
      </p>

      {events.length === 0 ? (
        <p className="text-muted-foreground">Aucun événement disponible.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="group border border-border rounded-lg overflow-hidden hover:border-foreground/20 transition-colors"
            >
              {event.coverImageUrl ? (
                <div className="relative aspect-[3/2] bg-muted-foreground/5">
                  <Image
                    src={event.coverImageUrl}
                    alt={event.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="aspect-[3/2] bg-muted-foreground/5 flex items-center justify-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground/30">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                    <circle cx="9" cy="9" r="2" />
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                  </svg>
                </div>
              )}
              <div className="p-4">
                <p className="text-xs text-muted-foreground mb-1">{event.categoryName}</p>
                <h2 className="font-light text-lg mb-1">{event.name}</h2>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(event.date)}
                    {event.photoCount > 0 && (
                      <span> — {event.photoCount} photo{event.photoCount > 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(event.id, event.name)}
                  disabled={downloading === event.id || event.photoCount === 0}
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-4 text-sm border border-border rounded hover:bg-foreground hover:text-background transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  data-cursor="hover"
                >
                  {downloading === event.id ? (
                    <>
                      <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Téléchargement...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Télécharger
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
