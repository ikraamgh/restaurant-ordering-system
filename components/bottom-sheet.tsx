'use client'

import { useEffect, useId } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  hideTitle?: boolean
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  dir?: 'ltr' | 'rtl'
}

export function BottomSheet({ open, onClose, title, hideTitle, children, footer, className, dir }: Props) {
  const titleId = useId()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" dir={dir}>
      <button
        type="button"
        aria-label="Fermer"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] animate-in fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={cn(
          'relative flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl animate-in slide-in-from-bottom duration-300 sm:max-w-lg sm:rounded-3xl',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 px-5 pt-4 pb-2">
          <h2 id={titleId} className={cn('font-serif text-xl font-semibold', hideTitle && 'sr-only')}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="ms-auto flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground transition-colors hover:bg-secondary"
            aria-label="Fermer"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-border bg-card p-4">{footer}</div>}
      </div>
    </div>
  )
}
