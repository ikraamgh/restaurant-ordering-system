import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, QrCode, UtensilsCrossed } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#f7f2ea] font-sans text-foreground">

      {/* ══════════════════════════════════════════
          NAV
      ══════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 border-b border-black/8 bg-[#f7f2ea]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground font-serif text-sm font-bold text-background">
              D
            </div>
            <div>
              <p className="text-xs font-bold leading-tight tracking-tight">TableFlow</p>
              <p className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground leading-tight">
                DR Restaurant Platform
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#espaces" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Espaces
            </a>
            <a href="#fonctionnement" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
              Fonctionnement
            </a>
          </nav>

          {/* CTA */}
          <Link
            href="/admin"
            className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
          >
            Ouvrir le dashboard
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
        {/* Left */}
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            • Plateforme restaurant nouvelle génération
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
            Le restaurant,{' '}
            <span className="italic text-primary">en mouvement.</span>
          </h1>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground max-w-xs">
            Une seule plateforme pour connecter vos établissements,{' '}
            <span className="underline decoration-primary/50">fluidifier</span> le service et offrir à
            chaque table une expérience qui donne envie de revenir.
          </p>

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Explorer la plateforme
              <ArrowUpRight className="size-3.5" />
            </Link>
            <Link
              href="/table/dar-zitoun/5"
              className="flex items-center gap-1.5 rounded-full border border-foreground/20 bg-card px-5 py-2.5 text-xs font-semibold hover:bg-muted transition-colors"
            >
              Voir l&apos;expérience client
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-9 flex items-center gap-8 border-t border-border/60 pt-6">
            <div>
              <span className="font-serif text-xl font-semibold">3</span>
              <p className="mt-0.5 text-xs text-muted-foreground">espaces connectés</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="font-serif text-xl font-semibold">24/7</span>
              <p className="mt-0.5 text-xs text-muted-foreground">service simplifié</p>
            </div>
          </div>
        </div>

        {/* Right — restaurant image card */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl aspect-[4/3]">
          <Image
            src="/hero.png"
            alt="Dar Zitoun"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Top badge */}
          <div className="absolute top-4 left-4">
            <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
              Aujourd&apos;hui chez
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
            <p className="font-serif text-2xl font-semibold text-white">Dar Zitoun</p>
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold text-white">
              Ouvert maintenant
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ROLES SECTION
      ══════════════════════════════════════════ */}
      <section id="espaces" className="border-t border-border/50 bg-card/40 py-16">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="mb-10 flex items-start justify-between">
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Une plateforme, chaque rôle
              </p>
              <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
                Tout le monde avance ensemble.
              </h2>
            </div>
            <QrCode className="size-10 shrink-0 text-primary/40" strokeWidth={1.2} />
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

            {/* Super Admin — dark green */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#1c3a2e] p-6 text-white">
              <div>
                <div className="mb-4 flex size-9 items-center justify-center rounded-xl bg-white/10">
                  <UtensilsCrossed className="size-4" />
                </div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-white/50">
                  Super Admin
                </p>
                <h3 className="font-serif text-xl font-semibold leading-tight">
                  Pilotez tout le réseau
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-white/60">
                  Restaurants, chiffres, menus et activité de chaque établissement depuis une seule vue.
                </p>
              </div>
              <Link
                href="/admin"
                className="mt-6 flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition-colors"
              >
                Ouvrir <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {/* Espace Client — orange terracotta */}
            <div className="flex flex-col justify-between rounded-2xl bg-[#c05c32] p-6 text-white">
              <div>
                <div className="mb-4 flex size-9 items-center justify-center rounded-xl bg-white/15">
                  <span className="text-base">📱</span>
                </div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-white/60">
                  Espace client
                </p>
                <h3 className="font-serif text-xl font-semibold leading-tight">
                  Commandez en quelques secondes
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-white/70">
                  Scannez le QR code, choisissez vos plats et suivez votre commande depuis la table.
                </p>
              </div>
              <Link
                href="/table/dar-zitoun/5"
                className="mt-6 flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition-colors"
              >
                Ouvrir <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            {/* Responsable — beige */}
            <div className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6">
              <div>
                <div className="mb-4 flex size-9 items-center justify-center rounded-xl bg-muted">
                  <span className="text-base">🧑‍💼</span>
                </div>
                <p className="mb-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                  Responsable service
                </p>
                <h3 className="font-serif text-xl font-semibold leading-tight">
                  Suivez les commandes
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground">
                  Toutes les tables et les commandes au même endroit. Confirmez le paiement, puis passez à la suite.
                </p>
              </div>
              <Link
                href="/serveur"
                className="mt-6 flex items-center gap-1 text-xs font-semibold text-primary hover:opacity-70 transition-opacity"
              >
                Ouvrir <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════ */}
      <section id="fonctionnement" className="border-t border-border/50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
            {/* Left */}
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                Pensé pour grandir
              </p>
              <h2 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">
                Une identité forte. Des opérations simples.
              </h2>
            </div>

            {/* Right — 3 feature items */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Menu */}
              <div>
                <div className="mb-3 text-xl">🍽️</div>
                <p className="font-semibold text-sm">Votre menu</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Plats, catégories,{' '}
                  <span className="underline decoration-muted-foreground/50">prix</span> et
                  disponibilités toujours à jour.
                </p>
              </div>

              {/* Équipe */}
              <div>
                <div className="mb-3 text-xl">👥</div>
                <p className="font-semibold text-sm">Votre équipe</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Chaque rôle accède uniquement à ce dont il a besoin.
                </p>
              </div>

              {/* Tables */}
              <div>
                <div className="mb-3 text-xl">📋</div>
                <p className="font-semibold text-sm">Vos tables</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Un QR code par table, une expérience client pour chaque client.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════ */}
      <footer className="border-t border-border/50 py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Dar Zitoun – La table commence ici.
        </p>
      </footer>

    </div>
  )
}
