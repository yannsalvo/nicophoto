'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Event {
  id: string
  name: string
  slug: string
  date: string | null
  isVisible: boolean
  category: { name: string }
  _count: { photos: number }
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    fetch('/api/admin/events').then((r) => r.json()).then(setEvents)
  }, [])

  const deleteEvent = async (id: string) => {
    if (!confirm('Supprimer cet événement ?')) return
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' })
    setEvents(events.filter((e) => e.id !== id))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-light">Événements</h1>
        <Link href="/admin/events/new" className="bg-foreground text-background px-4 py-2 text-sm">
          Nouvel événement
        </Link>
      </div>
      <div className="space-y-2">
        {events.map((evt) => (
          <div key={evt.id} className="flex items-center justify-between border border-border p-4">
            <div>
              <p className="font-light">{evt.name}</p>
              <p className="text-xs text-muted-foreground">
                {evt.category.name} &middot; {evt._count.photos} photos
                {evt.date && ` \u00B7 ${new Date(evt.date).toLocaleDateString('fr-FR')}`}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href={`/admin/events/${evt.id}/edit`} className="text-xs border border-border px-3 py-1">Editer</Link>
              <button onClick={() => deleteEvent(evt.id)} className="text-xs border border-red-300 text-red-500 px-3 py-1">Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
