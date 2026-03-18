'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Mot de passe incorrect')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-light text-center">Administration</h1>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground"
        />
        <button
          type="submit"
          className="w-full bg-foreground text-background py-3 text-sm tracking-wide hover:opacity-90"
        >
          Connexion
        </button>
      </form>
    </div>
  )
}
