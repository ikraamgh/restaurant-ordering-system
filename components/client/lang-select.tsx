'use client'

import type { Language } from '@/lib/types'

const LABELS: Record<string, { welcome: string; subtitle: string; choose: string }> = {
  fr: { welcome: 'Bienvenue', subtitle: 'Choisissez votre langue', choose: 'Choisir' },
  en: { welcome: 'Welcome',   subtitle: 'Choose your language',  choose: 'Select' },
  ar: { welcome: 'أهلاً وسهلاً', subtitle: 'اختر لغتك',        choose: 'اختر' },
}

export function LangSelect({
  restaurantName,
  languages,
  onSelect,
}: {
  restaurantName: string
  languages: Language[]
  onSelect: (code: string) => void
}) {
  const defaultLabel = LABELS.fr

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-gradient-to-b from-primary/5 to-background px-6 py-12 text-center">
      {/* Logo placeholder */}
      <div className="flex size-24 items-center justify-center rounded-3xl bg-primary/10 font-serif text-5xl font-bold text-primary">
        {restaurantName.slice(0, 1)}
      </div>

      <div>
        <h1 className="font-serif text-3xl font-semibold text-foreground">{restaurantName}</h1>
        <p className="mt-3 text-base text-muted-foreground">{defaultLabel.subtitle}</p>
      </div>

      {/* Language buttons */}
      <div className="flex w-full max-w-xs flex-col gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onSelect(lang.code)}
            className="flex items-center gap-4 rounded-2xl border-2 border-border bg-card px-6 py-4 text-start transition-all hover:border-primary hover:bg-primary/5 active:scale-[0.98]"
          >
            <span className="text-4xl leading-none">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="font-semibold text-foreground">{lang.name}</span>
              <span className="text-xs text-muted-foreground">
                {LABELS[lang.code]?.welcome ?? LABELS.fr.welcome}
              </span>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/60">Table • Resto QR</p>
    </div>
  )
}
