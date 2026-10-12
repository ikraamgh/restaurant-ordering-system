/** Formate un montant en MAD selon la langue */
export function formatPrice(amount: number, lang = 'fr'): string {
  if (lang === 'ar') return `${amount} درهم`
  if (lang === 'en') return `${amount} MAD`
  return `${amount} MAD`
}

/** Durée depuis un timestamp */
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

/** Vérifie si un timestamp est aujourd'hui */
export function isToday(timestamp: number): boolean {
  const d = new Date(timestamp)
  const now = new Date()
  return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
}

/** Heure formatée HH:mm */
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('fr-MA', { hour: '2-digit', minute: '2-digit' })
}
