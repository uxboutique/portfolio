import { RotateCcw, Search, Star } from 'lucide-react'
import { PUB_STATUS, SETTORI, TAGS, WORK_STATUS, type Filters, type PubStatus, type WorkStatus } from '../types'
import { activeFilterCount } from '../lib/filter'

const darkField =
  'h-10 w-full rounded-lg border border-ink-3 bg-ink-2 px-3 text-sm text-white placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none'

function Group({ label, children, htmlFor }: { label: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-[13px] font-medium text-zinc-300">{label}</label>
      {children}
    </div>
  )
}

export function Sidebar({ filters, set, people }: { filters: Filters; set: (f: Filters) => void; people: string[] }) {
  const upd = (patch: Partial<Filters>) => set({ ...filters, ...patch })
  const n = activeFilterCount(filters)
  const toggleTag = (t: string) =>
    upd({ tags: filters.tags.includes(t) ? filters.tags.filter((x) => x !== t) : [...filters.tags, t] })

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col bg-ink text-white">
      <div className="flex h-16 items-center border-b border-ink-3 px-5">
        <span className="text-[17px] font-bold tracking-tight">UX Boutique</span>
      </div>
      <div className="flex items-center justify-between px-5 pt-5 pb-1">
        <h2 className="text-sm font-semibold">Filtri</h2>
        {n > 0 && <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-ink">{n} attivi</span>}
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
        <Group label="Cerca cliente" htmlFor="f-q">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-500" />
            <input id="f-q" className={`${darkField} pl-9`} placeholder="Nome cliente" value={filters.q} onChange={(e) => upd({ q: e.target.value })} />
          </div>
        </Group>

        <Group label="Settore" htmlFor="f-settore">
          <select id="f-settore" className={darkField} value={filters.settore} onChange={(e) => upd({ settore: e.target.value })}>
            <option value="">Tutti i settori</option>
            {SETTORI.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Group>

        <Group label="Tag">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tag">
            {TAGS.map((t) => {
              const on = filters.tags.includes(t)
              return (
                <button
                  key={t} type="button" aria-pressed={on} onClick={() => toggleTag(t)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                    on ? 'border-white bg-white text-ink' : 'border-ink-3 text-zinc-300 hover:border-zinc-500 hover:text-white'
                  }`}
                >{t}</button>
              )
            })}
          </div>
          {filters.tags.length > 1 && <p className="mt-2 text-xs text-zinc-500">Progetti con tutti i tag selezionati</p>}
        </Group>

        <Group label="Stato pubblicazione" htmlFor="f-pub">
          <select id="f-pub" className={darkField} value={filters.pub} onChange={(e) => upd({ pub: e.target.value as PubStatus | '' })}>
            <option value="">Tutti</option>
            {(Object.keys(PUB_STATUS) as PubStatus[]).map((k) => <option key={k} value={k}>{PUB_STATUS[k].label}</option>)}
          </select>
        </Group>

        <Group label="Mockup" htmlFor="f-mockup">
          <select id="f-mockup" className={darkField} value={filters.mockup} onChange={(e) => upd({ mockup: e.target.value as WorkStatus | '' })}>
            <option value="">Tutti</option>
            {(Object.keys(WORK_STATUS) as WorkStatus[]).map((k) => <option key={k} value={k}>{WORK_STATUS[k].label}</option>)}
          </select>
        </Group>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-zinc-200">
          <input type="checkbox" className="size-4 accent-white" checked={filters.bestOf} onChange={(e) => upd({ bestOf: e.target.checked })} />
          <Star className="size-4 text-zinc-400" /> Solo Best of
        </label>

        <Group label="Chi ha seguito il progetto" htmlFor="f-who">
          <input id="f-who" list="people" className={darkField} placeholder="Es. Irene" value={filters.seguitoDa} onChange={(e) => upd({ seguitoDa: e.target.value })} />
          <datalist id="people">{people.map((p) => <option key={p} value={p} />)}</datalist>
        </Group>
      </div>
      <div className="border-t border-ink-3 p-4">
        <button
          type="button" disabled={n === 0} onClick={() => set({ q: '', settore: '', tags: [], pub: '', mockup: '', bestOf: false, seguitoDa: '' })}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm text-zinc-300 hover:bg-ink-2 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <RotateCcw className="size-4" /> Azzera filtri
        </button>
      </div>
    </aside>
  )
}
