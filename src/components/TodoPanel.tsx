import { useMemo, useState } from 'react'
import { ListTodo } from 'lucide-react'
import type { Project } from '../types'
import { TODO_LABEL, todosFor, type TodoKind } from '../lib/people'
import { readJSON, writeJSON } from '../lib/storage'
import { Dot } from './ui'

const KEY = 'uxb-portfolio-todo-person'

export function TodoPanel({ projects, people, onOpen }: { projects: Project[]; people: string[]; onOpen: (p: Project) => void }) {
  const ranked = useMemo(() => {
    return people
      .map((name) => ({ name, items: projects.map((p) => ({ p, kinds: todosFor(p, name) })).filter((x) => x.kinds.length) }))
      .filter((x) => x.items.length)
      .sort((a, b) => b.items.length - a.items.length || a.name.localeCompare(b.name, 'it'))
  }, [projects, people])

  const [sel, setSel] = useState<string>(() => readJSON(KEY, ''))
  const current = ranked.find((r) => r.name === sel) ?? ranked[0]
  const choose = (n: string) => { setSel(n); writeJSON(KEY, n) }

  const totals = useMemo(() => {
    const t: Record<TodoKind, number> = { mockup: 0, slidePptx: 0, caseStudy: 0, screenshot: 0 }
    current?.items.forEach((i) => i.kinds.forEach((k) => t[k]++))
    return t
  }, [current])

  return (
    <section aria-labelledby="todo-h" className="flex min-h-0 flex-col rounded-xl border border-line bg-white">
      <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
        <h2 id="todo-h" className="flex items-center gap-2 text-[15px] font-semibold"><ListTodo className="size-4 text-mute" />Da fare per persona</h2>
        {current && (
          <p className="text-xs text-mute tabular-nums">
            {(Object.keys(totals) as TodoKind[]).filter((k) => totals[k]).map((k) => `${totals[k]} ${TODO_LABEL[k].toLowerCase()}`).join(', ')}
          </p>
        )}
      </header>
      {ranked.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-mute">Nessuna attività da fare. Tutto in ordine.</p>
      ) : (
        <div className="flex min-h-0 flex-1">
          <ul className="w-44 shrink-0 overflow-y-auto border-r border-line py-1.5" aria-label="Persone">
            {ranked.map((r) => {
              const on = r.name === current?.name
              return (
                <li key={r.name}>
                  <button
                    type="button" aria-current={on} onClick={() => choose(r.name)}
                    className={`flex w-full items-center justify-between px-4 py-1.5 text-left text-sm ${on ? 'bg-ink font-medium text-white' : 'text-ink hover:bg-canvas'}`}
                  >
                    <span className="truncate">{r.name}</span>
                    <span className={`ml-2 text-xs tabular-nums ${on ? 'text-zinc-300' : 'text-mute'}`}>{r.items.length}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <ul className="min-w-0 flex-1 divide-y divide-line overflow-y-auto">
            {current?.items.map(({ p, kinds }) => (
              <li key={p.id}>
                <button type="button" onClick={() => onOpen(p)} className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-canvas">
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.cliente}</span>
                  <span className="flex shrink-0 gap-1">
                    {kinds.map((k) => (
                      <span key={k} className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] font-medium text-ink">
                        <Dot tone="red" className="size-1.5" />{TODO_LABEL[k]}
                      </span>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
