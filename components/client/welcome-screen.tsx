'use client'

import Image from 'next/image'
import { Coffee, CupSoda, IceCreamCone, Moon, Sun, type LucideIcon } from 'lucide-react'
import { MOMENTS } from '@/lib/seed'
import type { Moment } from '@/lib/types'
import { DICT, type Lang } from './i18n'
import { LangSwitch } from './lang-switch'

const ICONS: Record<Moment, LucideIcon> = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  drinks: CupSoda,
  desserts: IceCreamCone,
}

type Props = {
  table: number
  lang: Lang
  onLangChange: (l: Lang) => void
  onSelect: (m: Moment) => void
}

export function WelcomeScreen({ table, lang, onLangChange, onSelect }: Props) {
  const t = DICT[lang]
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col">
      <header className="relative h-[42dvh] min-h-72 overflow-hidden rounded-b-[2rem]">
        <Image src="/hero.png" alt="" fill priority className="object-cover" sizes="(max-width: 512px) 100vw, 512px" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-foreground/10" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5">
          <span className="rounded-full bg-background/15 px-3 py-1.5 text-xs font-semibold text-background backdrop-blur">
            {t.table} {table}
          </span>
          <LangSwitch lang={lang} onChange={onLangChange} inverted />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-6 text-background">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Dar Zitoun</p>
          <h1 className="mt-2 text-balance font-serif text-3xl font-semibold leading-tight">{t.welcome}</h1>
        </div>
      </header>

      <section className="flex-1 px-5 py-7" aria-labelledby="moment-q">
        <h2 id="moment-q" className="text-lg font-semibold">
          {t.question}
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3">
          {MOMENTS.map((m, i) => {
            const Icon = ICONS[m.id]
            return (
              <li key={m.id} className={i === 0 ? 'col-span-2' : undefined}>
                <button
                  type="button"
                  onClick={() => onSelect(m.id)}
                  className="group flex h-full w-full items-center gap-3 rounded-2xl border border-border bg-card p-4 text-start transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:scale-[0.98]"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-semibold">{t.moments[m.id]}</span>
                    <span className="text-xs text-muted-foreground">{m.hours}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
