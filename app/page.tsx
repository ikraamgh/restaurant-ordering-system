'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ChefHat, LayoutDashboard, QrCode, Smartphone, Users, UtensilsCrossed } from 'lucide-react'

const spaces = [
  { href: '/admin', label: 'Super admin', title: 'Pilotez tout le réseau', description: 'Restaurants, chiffres, menus et activité de chaque établissement depuis une seule vue.', icon: LayoutDashboard, tone: 'bg-[#193b35] text-white' },
  { href: '/table/5', label: 'Espace client', title: 'Commandez en quelques secondes', description: 'Scannez le QR code, choisissez vos plats et suivez votre commande depuis la table.', icon: Smartphone, tone: 'bg-[#c8643b] text-white' },
  { href: '/serveur', label: 'Responsable serveur', title: 'Suivez les commandes', description: 'Toutes les commandes et les tables au même endroit. Confirmez le paiement, puis passez à la suite.', icon: ChefHat, tone: 'bg-[#f2eadf] text-[#193b35]' },
]

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#f8f5ef] text-[#193b35]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#c8643b] font-serif text-xl font-bold text-white">D</span>
          <span><span className="block font-serif text-lg font-semibold">TableFlow</span><span className="block text-[10px] uppercase tracking-[.22em] text-[#6e817b]">QR Restaurant Platform</span></span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-[#52645f] md:flex"><a href="#espaces">Espaces</a><a href="#fonctionnement">Fonctionnement</a><Link className="rounded-full bg-[#193b35] px-4 py-2.5 font-medium text-white" href="/admin">Ouvrir le dashboard</Link></nav>
        <Link className="rounded-full bg-[#193b35] px-4 py-2.5 text-sm font-medium text-white md:hidden" href="/admin">Dashboard</Link>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-10 lg:grid-cols-[.9fr_1.1fr] lg:px-8 lg:pb-24 lg:pt-16">
        <div>
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.24em] text-[#c8643b]"><span className="size-2 rounded-full bg-[#c8643b]" /> Plateforme restaurant nouvelle génération</p>
          <h1 className="max-w-xl font-serif text-5xl font-semibold leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">Le restaurant, <em className="font-normal text-[#c8643b]">en mouvement.</em></h1>
          <p className="mt-6 max-w-lg text-base leading-7 text-[#60716c]">Une seule plateforme pour connecter vos établissements, fluidifier le service et offrir à chaque table une expérience qui donne envie de revenir.</p>
          <div className="mt-8 flex flex-wrap gap-3"><Link href="/admin" className="inline-flex items-center gap-2 rounded-full bg-[#c8643b] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#c8643b]/20">Explorer la plateforme <ArrowUpRight className="size-4" /></Link><Link href="/table/5" className="rounded-full border border-[#cad4ce] px-5 py-3 text-sm font-semibold text-[#193b35]">Voir l&apos;expérience client</Link></div>
          <div className="mt-12 flex items-center gap-8 border-t border-[#dfe4dc] pt-5"><div><strong className="font-serif text-2xl">3</strong><span className="ml-2 text-xs text-[#71817c]">espaces connectés</span></div><div><strong className="font-serif text-2xl">24/7</strong><span className="ml-2 text-xs text-[#71817c]">service simplifié</span></div></div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-[#193b35] p-3 shadow-2xl shadow-[#193b35]/15"><div className="relative aspect-[1.15] overflow-hidden rounded-[1.5rem]"><Image src="/hero.png" alt="Table de restaurant chaleureuse" fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#193b35]/80 via-transparent to-transparent" /><div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white"><div><p className="text-xs uppercase tracking-[.2em] text-white/70">Aujourd&apos;hui chez</p><p className="mt-1 font-serif text-3xl">Dar Zitoun</p></div><span className="rounded-full bg-white/15 px-3 py-1.5 text-xs backdrop-blur">Ouvert maintenant</span></div></div></div>
      </section>

      <section id="espaces" className="border-y border-[#e2e6df] bg-white/60"><div className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><div className="mb-8 flex items-end justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#c8643b]">Une plateforme, chaque rôle</p><h2 className="mt-2 font-serif text-3xl font-semibold">Tout le monde avance ensemble.</h2></div><QrCode className="hidden size-10 text-[#c8643b] sm:block" /></div><div className="grid gap-3 sm:grid-cols-3">{spaces.map(({ href, label, title, description, icon: Icon, tone }) => <Link key={label} href={href} className={`group rounded-3xl p-5 transition-transform hover:-translate-y-1 ${tone}`}><Icon className="size-6" /><p className="mt-10 text-xs uppercase tracking-[.14em] opacity-65">{label}</p><h3 className="mt-2 font-serif text-2xl leading-tight">{title}</h3><p className="mt-3 text-sm leading-6 opacity-75">{description}</p><span className="mt-6 flex items-center gap-2 text-sm font-semibold">Ouvrir <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></span></Link>)}</div></div></section>

      <section id="fonctionnement" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 lg:grid-cols-[.7fr_1.3fr] lg:px-8"><div><p className="text-xs font-semibold uppercase tracking-[.2em] text-[#c8643b]">Pensé pour grandir</p><h2 className="mt-3 font-serif text-4xl font-semibold leading-tight">Une identité forte. Des opérations simples.</h2></div><div className="grid gap-4 sm:grid-cols-3"><div className="border-t-2 border-[#c8643b] pt-4"><UtensilsCrossed className="size-5 text-[#c8643b]" /><h3 className="mt-8 font-semibold">Votre menu</h3><p className="mt-2 text-sm leading-6 text-[#71817c]">Plats, catégories, prix et disponibilités toujours à jour.</p></div><div className="border-t-2 border-[#193b35] pt-4"><Users className="size-5 text-[#193b35]" /><h3 className="mt-8 font-semibold">Votre équipe</h3><p className="mt-2 text-sm leading-6 text-[#71817c]">Chaque rôle accède uniquement à ce dont il a besoin.</p></div><div className="border-t-2 border-[#c8643b] pt-4"><QrCode className="size-5 text-[#c8643b]" /><h3 className="mt-8 font-semibold">Vos tables</h3><p className="mt-2 text-sm leading-6 text-[#71817c]">Un QR code par table, une expérience claire pour chaque client.</p></div></div></section>
      <footer className="border-t border-[#e2e6df] px-5 py-6 text-center text-xs text-[#71817c]">Dar Zitoun · La table commence ici.</footer>
    </main>
  )
}
