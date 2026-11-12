import { Clock } from 'lucide-react'
import type { Project } from '../types'
import { formatDate } from '../lib/format'

export function RecentPanel({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) {
  const recent = [...projects].sort((a, b) => b.dataInserimento.localeCompare(a.dataInserimento)).slice(0, 5)
  return (
    <section aria-labelledby="recent-h" className="flex flex-col rounded-xl border border-line bg-white">
      <header className="border-b border-line px-5 py-3.5">
        <h2 id="recent-h" className="flex items-center gap-2 text-[15px] font-semibold"><Clock className="size-4 text-mute" />Ultimi progetti inseriti</h2>
      </header>
      {recent.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-mute">Nessun progetto presente.</p>
      ) : (
        <ol className="divide-y divide-line">
          {recent.map((p) => (
            <li key={p.id}>
              <button type="button" onClick={() => onOpen(p)} className="flex w-full items-center justify-between gap-3 px-5 py-2.5 text-left hover:bg-canvas">
                <span className="truncate text-sm font-medium">{p.cliente}</span>
                <time dateTime={p.dataInserimento} className="shrink-0 text-xs text-mute tabular-nums">{formatDate(p.dataInserimento)}</time>
              </button>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
