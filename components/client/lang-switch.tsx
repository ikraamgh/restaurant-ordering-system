'use client'

import { cn } from '@/lib/utils'
import type { Lang } from './i18n'

type FlagOption = { flag: string; country: string; lang: Lang }

const FLAGS: FlagOption[] = [
  { flag: '­ƒç½­ƒçÀ', country: 'France', lang: 'fr' },
  { flag: '­ƒçº­ƒç¬', country: 'Belgique', lang: 'fr' },
  { flag: '­ƒç¿­ƒçª', country: 'Canada', lang: 'fr' },
  { flag: '­ƒç¿­ƒç¡', country: 'Suisse', lang: 'fr' },
  { flag: '­ƒç▓­ƒçª', country: 'Maroc', lang: 'ar' },
  { flag: '­ƒç®­ƒç┐', country: 'Alg├®rie', lang: 'ar' },
  { flag: '­ƒç╣­ƒç│', country: 'Tunisie', lang: 'ar' },
  { flag: '­ƒç©­ƒçª', country: 'Arabie saoudite', lang: 'ar' },
  { flag: '­ƒçª­ƒç¬', country: '├ëmirats arabes unis', lang: 'ar' },
  { flag: '­ƒç¬­ƒç¼', country: '├ëgypte', lang: 'ar' },
  { flag: '­ƒç¼­ƒçº', country: 'Royaume-Uni', lang: 'en' },
  { flag: '­ƒç║­ƒç©', country: '├ëtats-Unis', lang: 'en' },
  { flag: '­ƒç«­ƒç¬', country: 'Irlande', lang: 'en' },
  { flag: '­ƒçª­ƒç║', country: 'Australie', lang: 'en' },
  { flag: '­ƒç│­ƒç┐', country: 'Nouvelle-Z├®lande', lang: 'en' },
  { flag: '­ƒç┐­ƒçª', country: 'Afrique du Sud', lang: 'en' },
  { flag: '­ƒç«­ƒç│', country: 'Inde', lang: 'en' },
  { flag: '­ƒç©­ƒç¼', country: 'Singapour', lang: 'en' },
  { flag: '­ƒç®­ƒç¬', country: 'Allemagne', lang: 'en' },
  { flag: '­ƒç¬­ƒç©', country: 'Espagne', lang: 'en' },
  { flag: '­ƒç«­ƒç╣', country: 'Italie', lang: 'en' },
  { flag: '­ƒç»­ƒçÁ', country: 'Japon', lang: 'en' },
  { flag: '­ƒç░­ƒçÀ', country: 'Cor├®e du Sud', lang: 'en' },
  { flag: '­ƒçº­ƒçÀ', country: 'Br├®sil', lang: 'en' },
]

const ACTIVE_FLAGS: Record<Lang, string> = { fr: '­ƒç½­ƒçÀ', en: '­ƒç¼­ƒçº', ar: '­ƒç▓­ƒçª' }

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
          <option value="fr">­ƒç½­ƒçÀ Fran├ºais</option>
          <option value="en">­ƒç¼­ƒçº English</option>
          <option value="ar">­ƒç▓­ƒçª Ïº┘äÏ╣Ï▒Ï¿┘èÏ®</option>
        </optgroup>
        <optgroup label="Choisir selon votre pays">
          {FLAGS.filter((flag) => !['fr', 'en', 'ar'].includes(flag.lang) || flag.flag !== ACTIVE_FLAGS[flag.lang]).map((flag) => (
            <option key={flag.flag} value={flag.lang}>{flag.flag} {flag.country}</option>
          ))}
        </optgroup>
      </select>
      <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-[10px]">Ôîä</span>
    </label>
  )
}
