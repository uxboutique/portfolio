import { ArrowDown, ArrowUp, Home, Star } from 'lucide-react'
import type { Project } from '../types'
import { PubPill, WorkPill } from './ui'

export type SortKey = 'cliente' | 'settore' | 'dataInserimento'
export type Sort = { key: SortKey; dir: 'asc' | 'desc' }

function Th({ label, k, sort, setSort, className = '' }: { label: string; k?: SortKey; sort: Sort; setSort: (s: Sort) => void; className?: string }) {
  if (!k) return <th scope="col" className={`px-3 py-2.5 text-left text-xs font-medium text-mute ${className}`}>{label}</th>
  const on = sort.key === k
  const Icon = sort.dir === 'asc' ? ArrowUp : ArrowDown
  return (
    <th scope="col" aria-sort={on ? (sort.dir === 'asc' ? 'ascending' : 'descending') : 'none'} className={`px-3 py-2.5 text-left text-xs font-medium ${className}`}>
      <button type="button" onClick={() => setSort({ key: k, dir: on && sort.dir === 'asc' ? 'desc' : 'asc' })} className={`inline-flex items-center gap-1 hover:text-ink ${on ? 'text-ink' : 'text-mute'}`}>
        {label}{on && <Icon className="size-3" />}
      </button>
    </th>
  )
}

const Tags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-wrap gap-1">
    {tags.map((t) => <span key={t} className="rounded bg-canvas px-1.5 py-0.5 text-[11px] font-medium text-zinc-600">{t}</span>)}
  </div>
)

export function ProjectTable({ projects, onOpen, sort, setSort }: { projects: Project[]; onOpen: (p: Project) => void; sort: Sort; setSort: (s: Sort) => void }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[1080px] border-collapse text-sm">
        <thead className="sticky top-0 z-10 border-b border-line bg-white">
          <tr>
            <Th label="Cliente" k="cliente" sort={sort} setSort={setSort} className="pl-5" />
            <Th label="Settore" k="settore" sort={sort} setSort={setSort} />
            <Th label="Tag" sort={sort} setSort={setSort} />
            <Th label="Pubblicazione" sort={sort} setSort={setSort} />
            <Th label="Mockup" sort={sort} setSort={setSort} />
            <Th label="Slide" sort={sort} setSort={setSort} />
            <Th label="Case study" sort={sort} setSort={setSort} />
            <Th label="Screenshot" sort={sort} setSort={setSort} />
            <Th label="Seguito da" sort={sort} setSort={setSort} />
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {projects.map((p) => (
            <tr
              key={p.id} tabIndex={0} onClick={() => onOpen(p)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(p))}
              className="cursor-pointer align-middle hover:bg-canvas focus-visible:bg-canvas"
            >
              <td className="py-2.5 pr-3 pl-5">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{p.cliente}</span>
                  {p.bestOf && <Star className="size-3.5 fill-ink text-ink" aria-label="Best of" />}
                  {p.inHome && <Home className="size-3.5 text-mute" aria-label="In home" />}
                  {p.tipologia === 'Gara' && <span className="rounded border border-line px-1 text-[10px] font-semibold text-mute">Gara</span>}
                </div>
                {p.collab && <div className="text-xs text-mute">con {p.collab}</div>}
              </td>
              <td className="max-w-48 px-3 py-2.5 text-[13px] text-zinc-600">{p.settore}</td>
              <td className="max-w-44 px-3 py-2.5"><Tags tags={p.tags} /></td>
              <td className="px-3 py-2.5"><PubPill s={p.statoPubblicazione} /></td>
              <td className="px-3 py-2.5"><WorkPill s={p.mockup} /></td>
              <td className="px-3 py-2.5"><WorkPill s={p.slidePptx} compact /></td>
              <td className="px-3 py-2.5"><WorkPill s={p.caseStudy} compact /></td>
              <td className="px-3 py-2.5"><WorkPill s={p.screenshot} compact /></td>
              <td className="max-w-40 truncate px-3 py-2.5 text-[13px] text-zinc-600">{p.seguitoDa || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ProjectCards({ projects, onOpen }: { projects: Project[]; onOpen: (p: Project) => void }) {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3">
      {projects.map((p) => (
        <li key={p.id}>
          <button type="button" onClick={() => onOpen(p)} className="flex h-full w-full flex-col gap-3 rounded-xl border border-line bg-white p-4 text-left hover:border-zinc-400">
            <div className="flex w-full items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate font-semibold">{p.cliente}</div>
                <div className="truncate text-xs text-mute">{p.settore}</div>
              </div>
              <div className="flex shrink-0 gap-1.5 pt-0.5">
                {p.bestOf && <Star className="size-4 fill-ink text-ink" aria-label="Best of" />}
                {p.tipologia === 'Gara' && <span className="rounded border border-line px-1 text-[10px] font-semibold text-mute">Gara</span>}
              </div>
            </div>
            <Tags tags={p.tags} />
            <div className="mt-auto flex flex-wrap gap-1.5">
              <PubPill s={p.statoPubblicazione} />
              <span className="inline-flex items-center gap-1 text-xs text-mute">Mockup <WorkPill s={p.mockup} compact /></span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
