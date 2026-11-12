import { useCallback, useMemo, useState } from 'react'
import { Download, LayoutGrid, LogOut, PanelLeft, Plus, Rows3 } from 'lucide-react'
import { authConfig } from './auth.config'
import { useProjects } from './store'
import { EMPTY_FILTERS, type Filters, type Project, type ProjectInput } from './types'
import { applyFilters, activeFilterCount } from './lib/filter'
import { allPeople } from './lib/people'
import { exportCSV } from './lib/csv'
import { readJSON, writeJSON } from './lib/storage'
import { Sidebar } from './components/Sidebar'
import { StatsBar } from './components/StatsBar'
import { TodoPanel } from './components/TodoPanel'
import { RecentPanel } from './components/RecentPanel'
import { ProjectCards, ProjectTable, type Sort } from './components/ProjectList'
import { ProjectDrawer } from './components/ProjectDrawer'
import { ProjectForm } from './components/ProjectForm'
import { Login } from './components/Login'
import { Button, Modal } from './components/ui'

function useAuth() {
  const [user, setUser] = useState<string | null>(() =>
    authConfig.requireAuth ? readJSON<string | null>(authConfig.sessionKey, null) : 'sviluppo',
  )
  const login = (u: string, p: string) => {
    const ok = authConfig.users.some((x) => x.username === u && x.password === p)
    if (ok) { writeJSON(authConfig.sessionKey, u); setUser(u) }
    return ok
  }
  const logout = () => { localStorage.removeItem(authConfig.sessionKey); setUser(null) }
  return { user, login, logout }
}

export default function App() {
  const { user, login, logout } = useAuth()
  if (!user) return <Login onLogin={login} />
  return <Dashboard user={user} onLogout={authConfig.requireAuth ? logout : undefined} />
}

function Dashboard({ user, onLogout }: { user: string; onLogout?: () => void }) {
  const { projects, add, update, remove } = useProjects()
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sidebar, setSidebar] = useState(() => readJSON('uxb-portfolio-sidebar', true))
  const [view, setView] = useState<'table' | 'cards'>(() => readJSON('uxb-portfolio-view', 'table'))
  const [sort, setSort] = useState<Sort>({ key: 'cliente', dir: 'asc' })
  const [openId, setOpenId] = useState<string | null>(null)
  const [form, setForm] = useState<{ mode: 'new' } | { mode: 'edit'; id: string } | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const people = useMemo(() => allPeople(projects), [projects])
  const filtered = useMemo(() => {
    const list = applyFilters(projects, filters)
    const m = sort.dir === 'asc' ? 1 : -1
    return list.sort((a, b) => m * a[sort.key].localeCompare(b[sort.key], 'it', { sensitivity: 'base' }))
  }, [projects, filters, sort])

  const byId = (id: string | null) => projects.find((p) => p.id === id)
  const open = byId(openId)
  const editing = form?.mode === 'edit' ? byId(form.id) : undefined
  const confirming = byId(confirmId)

  const flash = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 2600) }
  const openProject = useCallback((p: Project) => setOpenId(p.id), [])
  const toggleSidebar = () => setSidebar((s: boolean) => { writeJSON('uxb-portfolio-sidebar', !s); return !s })
  const switchView = (v: 'table' | 'cards') => { setView(v); writeJSON('uxb-portfolio-view', v) }

  const save = (v: ProjectInput) => {
    if (form?.mode === 'edit') { update(form.id, v); flash(`${v.cliente}: modifiche salvate`) }
    else { const p = add(v); flash(`${p.cliente} aggiunto al portfolio`) }
    setForm(null)
  }

  const nFilters = activeFilterCount(filters)

  return (
    <div className="flex h-screen overflow-hidden">
      {sidebar && <Sidebar filters={filters} set={setFilters} people={people} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-white px-6">
          <div className="flex items-center gap-3">
            <button type="button" onClick={toggleSidebar} aria-label={sidebar ? 'Nascondi filtri' : 'Mostra filtri'} aria-expanded={sidebar} className="rounded-md p-1.5 text-mute hover:bg-canvas hover:text-ink">
              <PanelLeft className="size-5" />
            </button>
            <h1 className="text-[15px] font-semibold">Portfolio</h1>
            {!sidebar && nFilters > 0 && <span className="rounded-full bg-ink px-2 py-0.5 text-xs font-medium text-white">{nFilters} filtri attivi</span>}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-mute">{user}</span>
            {onLogout && (
              <button type="button" onClick={onLogout} className="inline-flex items-center gap-1.5 text-mute hover:text-ink"><LogOut className="size-4" />Esci</button>
            )}
          </div>
        </header>

        <main className="flex-1 space-y-5 overflow-y-auto p-6">
          <StatsBar projects={projects} filters={filters} set={setFilters} />

          <div className="grid h-80 grid-cols-[minmax(0,2fr)_minmax(280px,1fr)] gap-5">
            <TodoPanel projects={projects} people={people} onOpen={openProject} />
            <RecentPanel projects={projects} onOpen={openProject} />
          </div>

          <section aria-labelledby="list-h" className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h2 id="list-h" className="text-[15px] font-semibold">
                Progetti <span className="font-normal text-mute tabular-nums">{filtered.length === projects.length ? filtered.length : `${filtered.length} di ${projects.length}`}</span>
              </h2>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-line bg-white p-0.5" role="group" aria-label="Vista">
                  {([['table', Rows3, 'Tabella'], ['cards', LayoutGrid, 'Card']] as const).map(([k, Icon, l]) => (
                    <button key={k} type="button" aria-pressed={view === k} onClick={() => switchView(k)} title={l}
                      className={`rounded-md p-1.5 ${view === k ? 'bg-ink text-white' : 'text-mute hover:text-ink'}`}>
                      <Icon className="size-4" /><span className="sr-only">{l}</span>
                    </button>
                  ))}
                </div>
                <Button onClick={() => exportCSV(filtered)} disabled={!filtered.length}><Download className="size-4" />Esporta CSV</Button>
                <Button variant="primary" onClick={() => setForm({ mode: 'new' })}><Plus className="size-4" />Nuovo progetto</Button>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-14 text-center">
                <p className="font-medium">Nessun progetto corrisponde ai filtri.</p>
                <p className="mt-1 text-sm text-mute">Prova a togliere qualche filtro o aggiungi un nuovo progetto.</p>
                <Button className="mt-4" onClick={() => setFilters(EMPTY_FILTERS)}>Azzera filtri</Button>
              </div>
            ) : view === 'table' ? (
              <ProjectTable projects={filtered} onOpen={openProject} sort={sort} setSort={setSort} />
            ) : (
              <ProjectCards projects={filtered} onOpen={openProject} />
            )}
          </section>
        </main>
      </div>

      {open && !form && !confirming && (
        <ProjectDrawer project={open} onClose={() => setOpenId(null)} onEdit={() => setForm({ mode: 'edit', id: open.id })} onDelete={() => setConfirmId(open.id)} />
      )}
      {form && <ProjectForm initial={editing} onCancel={() => setForm(null)} onSave={save} />}
      {confirming && (
        <Modal
          title={`Eliminare ${confirming.cliente}?`} width="max-w-md" onClose={() => setConfirmId(null)}
          footer={<>
            <Button onClick={() => setConfirmId(null)}>Annulla</Button>
            <Button variant="danger" onClick={() => { remove(confirming.id); flash(`${confirming.cliente} eliminato`); setConfirmId(null); setOpenId(null) }}>Elimina progetto</Button>
          </>}
        >
          <p className="text-sm text-zinc-600">Il progetto verrà rimosso dal portfolio. L’operazione non si può annullare.</p>
        </Modal>
      )}
      {toast && (
        <div role="status" className="animate-pop fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-lg bg-ink px-4 py-2.5 text-sm text-white shadow-lg">{toast}</div>
      )}
    </div>
  )
}
