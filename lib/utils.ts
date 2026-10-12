import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format price in MAD */
export function formatPrice(amount: number, lang = 'fr'): string {
  if (lang === 'ar') return `${amount} درهم`
  return `${amount} MAD`
}

/** Time ago string */
export function timeAgo(timestamp: number, lang = 'fr'): string {
  const diff = Math.floor((Date.now() - timestamp) / 1000)
  if (diff < 60) {
    if (lang === 'ar') return 'الآن'
    if (lang === 'en') return 'Just now'
    return "À l'instant"
  }
  const min = Math.floor(diff / 60)
  if (min < 60) {
    if (lang === 'ar') return `منذ ${min} دقيقة`
    if (lang === 'en') return `${min} min ago`
    return `il y a ${min} min`
  }
  const hr = Math.floor(min / 60)
  if (lang === 'ar') return `منذ ${hr} ساعة`
  if (lang === 'en') return `${hr}h ago`
  return `il y a ${hr}h`
}
