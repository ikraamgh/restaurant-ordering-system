'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { ExternalLink, Plus, Printer, Trash2 } from 'lucide-react'
import { ACTIVE_STATUSES, actions } from '@/lib/store'
import type { AppState } from '@/lib/types'
import { cn } from '@/lib/utils'

const ZONES = ['Salle', 'Terrasse', 'Patio']

export function AdminTables({ state }: { state: AppState }) {
  const [zone, setZone] = useState(ZONES[0])
  const [seats, setSeats] = useState(4)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  const busy = new Set(state.orders.filter((o) => ACTIVE_STATUSES.includes(o.status)).map((o) => o.table))

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium">Zone</span>
          <select value={zone} onChange={(e) => setZone(e.target.value)} className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
            {ZONES.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium">Places</span>
          <input
            type="number"
            min={1}
            max={20}
            value={seats}
            onChange={(e) => setSeats(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={() => actions.addTable({ zone, seats })}
          className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="size-4" /> Ajouter une table
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex h-11 items-center justify-center gap-2 rounded-full border border-border px-5 text-sm font-semibold hover:bg-muted"
        >
          <Printer className="size-4" /> Imprimer les QR
        </button>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {state.tables.map((t) => {
          const url = `${origin}/table/${t.number}`
          const occupied = busy.has(t.number)
          return (
            <li key={t.number} className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-4 text-center">
              <div className="flex w-full items-center justify-between">
                <span className="font-serif text-xl font-semibold">Table {t.number}</span>
                <span
                  className={cn('size-2.5 rounded-full', occupied ? 'bg-primary' : 'bg-success')}
                  title={occupied ? 'Commande en cours' : 'Libre'}
                />
              </div>
              <div className="rounded-xl bg-background p-2.5 ring-1 ring-border">
                <QRCodeSVG value={url} size={112} fgColor="#2b2118" bgColor="transparent" aria-label={`QR code table ${t.number}`} />
              </div>
              <p className="text-xs text-muted-foreground">
                {t.zone} · {t.seats} places
              </p>
              <div className="flex w-full gap-1 print:hidden">
                <Link
                  href={`/table/${t.number}`}
                  target="_blank"
                  className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-full bg-muted text-xs font-medium hover:bg-secondary"
                >
                  <ExternalLink className="size-3" /> Ouvrir
                </Link>
                <button
                  type="button"
                  onClick={() => actions.removeTable(t.number)}
                  className="flex size-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
                  aria-label={`Supprimer la table ${t.number}`}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
