import { ExternalLink, FolderOpen, Pencil, Trash2, X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'
import type { Project } from '../types'
import { formatDate, isUrl } from '../lib/format'
import { Button, Pill, PubPill, WorkPill } from './ui'

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[150px_1fr] gap-3 py-2.5">
      <dt className="text-[13px] text-mute">{label}</dt>
      <dd className="min-w-0 text-sm">{children}</dd>
    </div>
  )
}
const text = (s: string) => s || <span className="text-zinc-400">—</span>

export function ProjectDrawer({ project: p, onClose, onEdit, onDelete }: { project: Project; onClose: () => void; onEdit: () => void; onDelete: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-ink/30" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <aside role="dialog" aria-modal aria-label={p.cliente} className="animate-drawer flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div className="min-w-0">
            <p className="text-[13px] text-mute">{p.tipologia} · inserito il {formatDate(p.dataInserimento)}</p>
            <h2 className="mt-0.5 text-2xl font-semibold tracking-tight">{p.cliente}</h2>
            <p className="mt-1 text-sm text-mute">{p.settore}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Chiudi" className="rounded-md p-1 text-mute hover:bg-canvas hover:text-ink"><X className="size-5" /></button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="pt-2 pb-1 text-sm font-semibold">Avanzamento</h3>
          <dl className="divide-y divide-line">
            <Row label="Stato pubblicazione"><PubPill s={p.statoPubblicazione} /></Row>
            <Row label="Mockup"><WorkPill s={p.mockup} /></Row>
            <Row label="Slide PPTX"><WorkPill s={p.slidePptx} /></Row>
            <Row label="Case study sito"><WorkPill s={p.caseStudy} /></Row>
            <Row label="Screenshot sito"><WorkPill s={p.screenshot} /></Row>
            <Row label="Best of">{p.bestOf ? <Pill tone="green" label="Best of" /> : text('')}</Row>
            <Row label="In home sito">{p.inHome ? <Pill tone="green" label="Fatto" /> : text('')}</Row>
            <Row label="Logo sito">{text(p.logo)}</Row>
            <Row label="Pagina / nota">
              {isUrl(p.notaPubblicazione)
                ? <a href={p.notaPubblicazione} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 break-all underline underline-offset-2 hover:text-mute">{p.notaPubblicazione.replace(/^https?:\/\/(www\.)?/, '')}<ExternalLink className="size-3.5 shrink-0" /></a>
                : text(p.notaPubblicazione)}
            </Row>
          </dl>

          <h3 className="pt-6 pb-1 text-sm font-semibold">Progetto</h3>
          <dl className="divide-y divide-line">
            <Row label="Tag">{p.tags.length ? p.tags.join(', ') : text('')}</Row>
            <Row label="In collab. con">{text(p.collab)}</Row>
            <Row label="Seguito da">{text(p.seguitoDa)}</Row>
            <Row label="Mockup di">{text(p.mockupDa)}</Row>
            <Row label="Cartella Drive">
              {p.drive
                ? <a href={p.drive} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 underline underline-offset-2 hover:text-mute"><FolderOpen className="size-4" />Apri cartella</a>
                : text('')}
            </Row>
          </dl>
        </div>

        <footer className="flex justify-between gap-2 border-t border-line px-6 py-4">
          <Button variant="ghost" onClick={onDelete} className="text-ko hover:text-ko"><Trash2 className="size-4" />Elimina</Button>
          <Button variant="primary" onClick={onEdit}><Pencil className="size-4" />Modifica progetto</Button>
        </footer>
      </aside>
    </div>
  )
}
