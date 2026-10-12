'use client'

import { Trash2, UserPlus } from 'lucide-react'
import { toast } from 'sonner'
import { actions } from '@/lib/store'
import type { Staff } from '@/lib/types'
import { cn } from '@/lib/utils'

const ROLES: Record<Staff['role'], string> = { admin: 'Administrateur', serveur: 'Serveur', cuisine: 'Cuisine' }

export function AdminStaff({ staff }: { staff: Staff[] }) {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    if (!name) return
    actions.addStaff({ name, role: fd.get('role') as Staff['role'], active: true })
    toast.success(`${name} ajouté à l'équipe`)
    form.reset()
  }

  return (
    <div className="flex flex-col gap-5">
      <form onSubmit={onSubmit} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-end">
        <label className="flex flex-[2] flex-col gap-1.5">
          <span className="text-sm font-medium">Nom complet</span>
          <input name="name" required maxLength={60} className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary" />
        </label>
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-sm font-medium">Rôle</span>
          <select name="role" className="h-11 rounded-xl border border-border bg-background px-3 text-sm">
            {Object.entries(ROLES).map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">
          <UserPlus className="size-4" /> Ajouter
        </button>
      </form>

      <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
        {staff.map((m) => (
          <li key={m.id} className="flex items-center gap-4 px-5 py-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
              {m.name
                .split(' ')
                .map((p) => p[0])
                .slice(0, 2)
                .join('')}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">{ROLES[m.role]}</p>
            </div>
            <button
              type="button"
              onClick={() => actions.toggleStaff(m.id)}
              aria-pressed={m.active}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium',
                m.active ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground',
              )}
            >
              {m.active ? 'En service' : 'Absent'}
            </button>
            <button
              type="button"
              onClick={() => actions.removeStaff(m.id)}
              className="flex size-8 items-center justify-center rounded-full text-destructive hover:bg-destructive/10"
              aria-label={`Retirer ${m.name}`}
            >
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
