import type { Filters, Project, Tone } from '../types'
import { Dot } from './ui'

type Stat = { label: string; value: number; tone: Tone; patch: Partial<Filters>; active: boolean }

export function StatsBar({ projects, filters, set }: { projects: Project[]; filters: Filters; set: (f: Filters) => void }) {
  const c = (f: (p: Project) => boolean) => projects.filter(f).length
  const stats: Stat[] = [
    { label: 'Pubblicati', value: c((p) => p.statoPubblicazione === 'fatto'), tone: 'green', patch: { pub: 'fatto' }, active: filters.pub === 'fatto' },
    { label: 'In attesa', value: c((p) => p.statoPubblicazione === 'in_attesa'), tone: 'yellow', patch: { pub: 'in_attesa' }, active: filters.pub === 'in_attesa' },
    { label: 'Non pubblicabili', value: c((p) => p.statoPubblicazione === 'non_pubblicabile'), tone: 'red', patch: { pub: 'non_pubblicabile' }, active: filters.pub === 'non_pubblicabile' },
    { label: 'Mockup da fare', value: c((p) => p.mockup === 'da_fare'), tone: 'red', patch: { mockup: 'da_fare' }, active: filters.mockup === 'da_fare' },
  ]
  return (
    <section aria-label="Statistiche" className="flex items-stretch overflow-hidden rounded-xl border border-line bg-white">
      <div className="flex flex-col justify-center border-r border-line px-6 py-4">
        <span className="text-[13px] text-mute">Totale progetti</span>
        <span className="text-3xl font-semibold tracking-tight tabular-nums">{projects.length}</span>
      </div>
      {stats.map((s) => (
        <button
          key={s.label} type="button" aria-pressed={s.active}
          onClick={() => set({ ...filters, ...(s.active ? Object.fromEntries(Object.keys(s.patch).map((k) => [k, ''])) : s.patch) })}
          className={`flex flex-1 flex-col justify-center border-r border-line px-5 py-4 text-left last:border-r-0 transition-colors ${s.active ? 'bg-canvas' : 'hover:bg-canvas/60'}`}
          title={s.active ? 'Rimuovi filtro' : `Filtra: ${s.label.toLowerCase()}`}
        >
          <span className="flex items-center gap-2 text-[13px] text-mute"><Dot tone={s.tone} />{s.label}</span>
          <span className="text-2xl font-semibold tracking-tight tabular-nums">{s.value}</span>
        </button>
      ))}
    </section>
  )
}
