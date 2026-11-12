import { useCallback, useEffect, useState } from 'react'
import seed from './data/seed.json'
import type { Project, ProjectInput } from './types'
import { readJSON, writeJSON } from './lib/storage'

/**
 * Persistenza su localStorage. Per migrare a Supabase basta sostituire
 * load/save con chiamate alla tabella `projects` mantenendo la stessa API.
 */
const KEY = 'uxb-portfolio-projects-v1'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() =>
    readJSON<Project[]>(KEY, seed as Project[]),
  )

  useEffect(() => writeJSON(KEY, projects), [projects])

  const add = useCallback((input: ProjectInput) => {
    const p: Project = {
      ...input,
      id: crypto.randomUUID(),
      dataInserimento: new Date().toISOString(),
    }
    setProjects((ps) => [...ps, p])
    return p
  }, [])

  const update = useCallback((id: string, input: ProjectInput) => {
    // id e dataInserimento non vengono mai sovrascritti
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...input, id: p.id, dataInserimento: p.dataInserimento } : p)))
  }, [])

  const remove = useCallback((id: string) => {
    setProjects((ps) => ps.filter((p) => p.id !== id))
  }, [])

  const reset = useCallback(() => setProjects(seed as Project[]), [])

  return { projects, add, update, remove, reset }
}
