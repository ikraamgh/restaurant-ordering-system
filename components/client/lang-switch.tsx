'use client'

import { cn } from '@/lib/utils'
import type { Lang } from './i18n'

type FlagOption = { flag: string; country: string; lang: Lang }

const FLAGS: FlagOption[] = [
  { flag: '🇫🇷', country: 'France', lang: 'fr' },
  { flag: '🇧🇪', country: 'Belgique', lang: 'fr' },
  { flag: '🇨🇦', country: 'Canada', lang: 'fr' },
  { flag: '🇨🇭', country: 'Suisse', lang: 'fr' },
  { flag: '🇲🇦', country: 'Maroc', lang: 'ar' },
  { flag: '🇩🇿', country: 'Algérie', lang: 'ar' },
  { flag: '🇹🇳', country: 'Tunisie', lang: 'ar' },
  { flag: '🇸🇦', country: 'Arabie saoudite', lang: 'ar' },
  { flag: '🇦🇪', country: 'Émirats arabes unis', lang: 'ar' },
  { flag: '🇪🇬', country: 'Égypte', lang: 'ar' },
  { flag: '🇬🇧', country: 'Royaume-Uni', lang: 'en' },
  { flag: '🇺🇸', country: 'États-Unis', lang: 'en' },
  { flag: '🇮🇪', country: 'Irlande', lang: 'en' },
  { flag: '🇦🇺', country: 'Australie', lang: 'en' },
  { flag: '🇳🇿', country: 'Nouvelle-Zélande', lang: 'en' },
  { flag: '🇿🇦', country: 'Afrique du Sud', lang: 'en' },
  { flag: '🇮🇳', country: 'Inde', lang: 'en' },
  { flag: '🇸🇬', country: 'Singapour', lang: 'en' },
  { flag: '🇩🇪', country: 'Allemagne', lang: 'en' },
  { flag: '🇪🇸', country: 'Espagne', lang: 'en' },
  { flag: '🇮🇹', country: 'Italie', lang: 'en' },
  { flag: '🇯🇵', country: 'Japon', lang: 'en' },
  { flag: '🇰🇷', country: 'Corée du Sud', lang: 'en' },
  { flag: '🇧🇷', country: 'Brésil', lang: 'en' },
]

const ACTIVE_FLAGS: Record<Lang, string> = { fr: '🇫🇷', en: '🇬🇧', ar: '🇲🇦' }

export function LangSwitch({ lang, onChange, inverted }: { lang: Lang; onChange: (l: Lang) => void; inverted?: boolean }) {
  return (
    <label className="relative inline-flex" aria-label="Choisir la langue">
      <span className="sr-only">Choisir la langue</span>
      <select
        value={lang}
        onChange={(event) => onChange(event.target.value as Lang)}
        className={cn(
          'appearance-none rounded-full py-2 pe-8 ps-9 text-xs font-semibold outline-none transition-colors',
          inverted ? 'bg-background/15 text-background backdrop-blur' : 'bg-muted text-foreground',
        )}
        aria-label="Langue"
      >
        <optgroup label="Langues disponibles">
          <option value="fr">🇫🇷 Français</option>
          <option value="en">🇬🇧 English</option>
          <option value="ar">🇲🇦 العربية</option>
        </optgroup>
        <optgroup label="Choisir selon votre pays">
          {FLAGS.filter((flag) => !['fr', 'en', 'ar'].includes(flag.lang) || flag.flag !== ACTIVE_FLAGS[flag.lang]).map((flag) => (
            <option key={flag.flag} value={flag.lang}>{flag.flag} {flag.country}</option>
          ))}
        </optgroup>
      </select>
      <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-[10px]">⌄</span>
    </label>
  )
}
