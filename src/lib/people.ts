import type { Project, WorkStatus } from '../types'

/** "Irene + Andrea", "Jacopo, Irene" → ["Irene", "Andrea"] */
export function splitPeople(s: string): string[] {
  return s.split(/[,+/&]| e /).map((x) => x.trim()).filter(Boolean)
}

export function allPeople(projects: Project[]): string[] {
  const set = new Map<string, string>()
  for (const p of projects)
    for (const n of [...splitPeople(p.seguitoDa), ...splitPeople(p.mockupDa)])
      if (!set.has(n.toLowerCase())) set.set(n.toLowerCase(), n)
  return [...set.values()].sort((a, b) => a.localeCompare(b, 'it'))
}

export type TodoKind = 'mockup' | 'slidePptx' | 'caseStudy' | 'screenshot'
export const TODO_LABEL: Record<TodoKind, string> = {
  mockup: 'Mockup',
  slidePptx: 'Slide PPTX',
  caseStudy: 'Case study',
  screenshot: 'Screenshot',
}

const has = (list: string, name: string) =>
  splitPeople(list).some((n) => n.toLowerCase() === name.toLowerCase())

/**
 * Attività "da fare" di una persona:
 * - Mockup → assegnato a chi fa il mockup
 * - Slide, case study, screenshot → assegnati a chi ha seguito il progetto
 */
export function todosFor(p: Project, name: string): TodoKind[] {
  const out: TodoKind[] = []
  const isTodo = (s: WorkStatus) => s === 'da_fare'
  if (isTodo(p.mockup) && has(p.mockupDa, name)) out.push('mockup')
  if (has(p.seguitoDa, name)) {
    if (isTodo(p.slidePptx)) out.push('slidePptx')
    if (isTodo(p.caseStudy)) out.push('caseStudy')
    if (isTodo(p.screenshot)) out.push('screenshot')
  }
  return out
}
