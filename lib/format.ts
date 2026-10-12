export const formatPrice = (n: number) => `${n.toLocaleString('fr-FR')} DH`

export function timeAgo(ts: number, now = Date.now()) {
  const min = Math.max(0, Math.round((now - ts) / 60_000))
  if (min < 1) return "à l'instant"
  if (min < 60) return `il y a ${min} min`
  const h = Math.floor(min / 60)
  return `il y a ${h} h${min % 60 ? ` ${String(min % 60).padStart(2, '0')}` : ''}`
}

export function isToday(ts: number) {
  const d = new Date(ts)
  const n = new Date()
  return d.toDateString() === n.toDateString()
}
