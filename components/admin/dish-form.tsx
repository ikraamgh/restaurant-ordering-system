'use client'

import { toast } from 'sonner'
import { BottomSheet } from '@/components/bottom-sheet'
import { MOMENTS, TAG_LABELS } from '@/lib/seed'
import { actions } from '@/lib/store'
import type { Dish, DishTag, Extra, Moment } from '@/lib/types'

const IMAGES = [
  'tajine-poulet', 'couscous', 'burger', 'pizza', 'msemen', 'ftour-marocain', 'pancakes', 'omelette',
  'poisson', 'pates', 'salade', 'jus-orange', 'the-menthe', 'cafe', 'cheesecake',
]

const splitList = (v: FormDataEntryValue | null) =>
  String(v ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

const field =
  'h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15'

export function DishForm({ dish, onClose }: { dish: Dish | 'new' | null; onClose: () => void }) {
  const editing = dish && dish !== 'new' ? dish : null

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const price = Number(fd.get('price'))
    const moments = fd.getAll('moments') as Moment[]
    if (!name || !Number.isFinite(price) || price <= 0 || moments.length === 0) {
      toast.error('Nom, prix valide et au moins un moment sont requis')
      return
    }
    const extras: Extra[] = splitList(fd.get('extras')).map((raw, i) => {
      const [label, p] = raw.split(':')
      return { id: `x${i}-${label.trim().toLowerCase()}`, label: label.trim(), price: Math.max(0, Number(p) || 0) }
    })
    actions.upsertDish({
      id: editing?.id ?? actions.newId(),
      name,
      price,
      moments,
      category: String(fd.get('category') ?? '').trim() || 'Autres',
      description: String(fd.get('description') ?? '').trim(),
      portion: String(fd.get('portion') ?? '').trim(),
      image: String(fd.get('image')),
      spiceLevel: Number(fd.get('spiceLevel')) as Dish['spiceLevel'],
      ingredients: splitList(fd.get('ingredients')),
      allergens: splitList(fd.get('allergens')),
      removable: splitList(fd.get('removable')),
      tags: fd.getAll('tags') as DishTag[],
      extras,
      available: editing?.available ?? true,
      popular: editing?.popular,
    })
    toast.success(editing ? 'Plat mis à jour' : 'Plat ajouté au menu')
    onClose()
  }

  return (
    <BottomSheet open={dish !== null} onClose={onClose} title={editing ? 'Modifier le plat' : 'Nouveau plat'} className="sm:max-w-2xl">
      <form key={editing?.id ?? 'new'} onSubmit={onSubmit} className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Nom" className="sm:col-span-2">
          <input name="name" required defaultValue={editing?.name} className={field} />
        </Field>
        <Field label="Prix (DH)">
          <input name="price" type="number" min={1} step={1} required defaultValue={editing?.price} className={field} />
        </Field>
        <Field label="Catégorie">
          <input name="category" defaultValue={editing?.category} className={field} placeholder="Tajines, Pâtes..." />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <textarea name="description" rows={2} defaultValue={editing?.description} className={`${field} h-auto py-2.5`} />
        </Field>
        <Field label="Ingrédients (séparés par des virgules)" className="sm:col-span-2">
          <input name="ingredients" defaultValue={editing?.ingredients.join(', ')} className={field} />
        </Field>
        <Field label="Allergènes">
          <input name="allergens" defaultValue={editing?.allergens.join(', ')} className={field} />
        </Field>
        <Field label="Ingrédients retirables">
          <input name="removable" defaultValue={editing?.removable.join(', ')} className={field} />
        </Field>
        <Field label="Suppléments (nom:prix, ...)" className="sm:col-span-2">
          <input
            name="extras"
            defaultValue={editing?.extras.map((e) => `${e.label}:${e.price}`).join(', ')}
            placeholder="Frites:15, Fromage:10"
            className={field}
          />
        </Field>
        <Field label="Portion">
          <input name="portion" defaultValue={editing?.portion} className={field} placeholder="350 g" />
        </Field>
        <Field label="Niveau de piquant">
          <select name="spiceLevel" defaultValue={editing?.spiceLevel ?? 0} className={field}>
            {[0, 1, 2, 3].map((n) => (
              <option key={n} value={n}>
                {n} / 3
              </option>
            ))}
          </select>
        </Field>
        <Field label="Photo" className="sm:col-span-2">
          <select name="image" defaultValue={editing?.image ?? '/dishes/tajine-poulet.png'} className={field}>
            {IMAGES.map((img) => (
              <option key={img} value={`/dishes/${img}.png`}>
                {img}
              </option>
            ))}
          </select>
        </Field>

        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium">Moments</legend>
          <div className="flex flex-wrap gap-2">
            {MOMENTS.map((m) => (
              <CheckChip key={m.id} name="moments" value={m.id} label={m.label} defaultChecked={editing?.moments.includes(m.id)} />
            ))}
          </div>
        </fieldset>
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium">Étiquettes</legend>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TAG_LABELS) as DishTag[]).map((t) => (
              <CheckChip key={t} name="tags" value={t} label={TAG_LABELS[t]} defaultChecked={editing?.tags.includes(t)} />
            ))}
          </div>
        </fieldset>

        <div className="flex justify-end gap-2 sm:col-span-2">
          <button type="button" onClick={onClose} className="h-11 rounded-full px-5 text-sm font-medium hover:bg-muted">
            Annuler
          </button>
          <button type="submit" className="h-11 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground">
            Enregistrer
          </button>
        </div>
      </form>
    </BottomSheet>
  )
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  )
}

function CheckChip({ name, value, label, defaultChecked }: { name: string; value: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="cursor-pointer">
      <input type="checkbox" name={name} value={value} defaultChecked={defaultChecked} className="peer sr-only" />
      <span className="inline-block rounded-full border border-border px-3 py-1.5 text-sm transition-colors peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring">
        {label}
      </span>
    </label>
  )
}
