import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-light">404</h1>
      <p className="text-muted-foreground">Page non trouvée</p>
      <Link href="/" className="text-sm underline underline-offset-4" data-cursor="hover">
        Retour à l&apos;accueil
      </Link>
    </div>
  )
}
