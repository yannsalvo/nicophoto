'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="pt-[80px] px-6 md:px-10 max-w-xl mx-auto">
      <h1 className="text-3xl font-light tracking-wide mb-8">Contact</h1>
      {sent ? (
        <p className="text-muted-foreground">Merci pour votre message !</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm text-muted-foreground mb-2">Nom</label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-muted-foreground mb-2">Email</label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm text-muted-foreground mb-2">Message</label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none"
            />
          </div>
          <button
            type="submit"
            className="bg-foreground text-background px-6 py-3 text-sm tracking-wide hover:opacity-90 transition-opacity"
            data-cursor="hover"
          >
            Envoyer
          </button>
        </form>
      )}
    </section>
  )
}
