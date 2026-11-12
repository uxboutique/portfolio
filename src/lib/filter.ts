import type { Filters, Project } from '../types'

export function applyFilters(ps: Project[], f: Filters) {
  const q = f.q.trim().toLowerCase()
  const who = f.seguitoDa.trim().toLowerCase()
  return ps.filter(
    (p) =>
      (!q || p.cliente.toLowerCase().includes(q)) &&
      (!f.settore || p.settore === f.settore) &&
      (f.tags.length === 0 || f.tags.every((t) => p.tags.includes(t))) &&
      (!f.pub || p.statoPubblicazione === f.pub) &&
      (!f.mockup || p.mockup === f.mockup) &&
      (!f.bestOf || p.bestOf) &&
      (!who || p.seguitoDa.toLowerCase().includes(who)),
  )
}

export function activeFilterCount(f: Filters) {
  return [f.q.trim(), f.settore, f.pub, f.mockup, f.seguitoDa.trim()].filter(Boolean).length +
    f.tags.length + (f.bestOf ? 1 : 0)
}
