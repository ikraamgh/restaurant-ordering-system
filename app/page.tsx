import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-secondary/40 p-8 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-primary font-serif text-4xl font-bold text-primary-foreground">
        Q
      </div>
      <div>
        <h1 className="font-serif text-4xl font-semibold">Resto QR</h1>
        <p className="mt-2 text-muted-foreground">Plateforme de commande QR pour restaurants</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Super Administration
        </Link>
        <Link
          href="/responsable/dar-zitoun"
          className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted"
        >
          Espace Responsable (démo)
        </Link>
        <Link
          href="/table/dar-zitoun/5"
          className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold hover:bg-muted"
        >
          Espace Client (Table 5)
        </Link>
      </div>
    </div>
  )
}
