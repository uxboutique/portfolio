import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { PUB_STATUS, WORK_STATUS, type PubStatus, type Tone, type WorkStatus } from '../types'

const DOT: Record<Tone, string> = {
  green: 'bg-ok',
  red: 'bg-ko',
  yellow: 'bg-wait',
  black: 'bg-ink',
  greenOutline: 'bg-white ring-2 ring-inset ring-ok',
}

export function Dot({ tone, className = '' }: { tone: Tone; className?: string }) {
  return <span aria-hidden className={`inline-block size-2 shrink-0 rounded-full ${DOT[tone]} ${className}`} />
}

export function Pill({ tone, label, compact }: { tone: Tone; label: string; compact?: boolean }) {
  const muted = tone === 'black'
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium ${
        muted ? 'border-line bg-canvas text-mute' : 'border-line bg-white text-ink'
      }`}
      title={label}
    >
      <Dot tone={tone} />
      {!compact && label}
    </span>
  )
}

export const WorkPill = ({ s, compact }: { s: WorkStatus; compact?: boolean }) => (
  <Pill tone={WORK_STATUS[s].tone} label={WORK_STATUS[s].label} compact={compact} />
)
export const PubPill = ({ s }: { s: PubStatus }) => (
  <Pill tone={PUB_STATUS[s].tone} label={PUB_STATUS[s].label} />
)

export function Button({
  variant = 'secondary', className = '', ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' | 'ghost' }) {
  const v = {
    primary: 'bg-ink text-white hover:bg-ink-2 border-ink',
    secondary: 'bg-white text-ink border-line hover:bg-canvas',
    danger: 'bg-ko text-white border-ko hover:bg-red-700',
    ghost: 'border-transparent text-mute hover:text-ink hover:bg-canvas',
  }[variant]
  return (
    <button
      type="button"
      className={`inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-3.5 text-sm font-medium transition-colors disabled:opacity-50 ${v} ${className}`}
      {...props}
    />
  )
}

export function Modal({
  title, subtitle, onClose, children, footer, width = 'max-w-2xl',
}: { title: string; subtitle?: string; onClose: () => void; children: ReactNode; footer?: ReactNode; width?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    ref.current?.querySelector<HTMLElement>('input,select,textarea,button')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey); prev?.focus() }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal aria-label={title} className={`animate-pop flex max-h-[90vh] w-full ${width} flex-col rounded-xl bg-white shadow-2xl`}>
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
            {subtitle && <p className="mt-0.5 text-sm text-mute">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Chiudi" className="-m-1 rounded-md p-1 text-mute hover:bg-canvas hover:text-ink">
            <X className="size-5" />
          </button>
        </header>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t border-line px-6 py-4">{footer}</footer>}
      </div>
    </div>
  )
}

export const fieldCls =
  'h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink placeholder:text-zinc-400 focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink'

export function Field({ label, required, children, hint }: { label: string; required?: boolean; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}{required && <span className="text-ko"> *</span>}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-mute">{hint}</span>}
    </label>
  )
}
