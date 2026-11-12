import { PUB_STATUS, WORK_STATUS, type Project } from '../types'
import { formatDate } from './format'

// Stesse intestazioni del foglio Excel, più la data di inserimento in coda.
const COLUMNS: [string, (p: Project) => string][] = [
  ['Cliente', (p) => p.cliente],
  ['Tip.', (p) => (p.tipologia === 'Gara' ? 'Gara' : '')],
  ['Settore', (p) => p.settore],
  ['Tag', (p) => p.tags.join(', ')],
  ['Slide pptx caso studio completo', (p) => WORK_STATUS[p.slidePptx].emoji],
  ['Portfolio sito caso studio completo', (p) => WORK_STATUS[p.caseStudy].emoji],
  ['Portfolio sito solo screenshot', (p) => WORK_STATUS[p.screenshot].emoji],
  ['Stato pubblicazione nel sito UX', (p) => PUB_STATUS[p.statoPubblicazione].emoji],
  ['Logo sito UX', (p) => p.logo],
  ['Tag Best of sito UX', (p) => (p.bestOf ? '🟢 Best of' : '')],
  ['Progetto in Home sito UX', (p) => (p.inHome ? '🟢 fatto' : '')],
  ['In collab. con', (p) => p.collab],
  ['Mockup', (p) => WORK_STATUS[p.mockup].emoji],
  ['Chi ha seguito il progetto', (p) => p.seguitoDa],
  ['Chi fa il mockup', (p) => p.mockupDa],
  ['Cartella Drive', (p) => p.drive],
  ['Pagina portfolio / nota', (p) => p.notaPubblicazione],
  ['Data inserimento', (p) => formatDate(p.dataInserimento)],
]

const esc = (v: string) => (/[",\n;]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

export function exportCSV(projects: Project[]) {
  const rows = [COLUMNS.map(([h]) => h), ...projects.map((p) => COLUMNS.map(([, f]) => f(p)))]
  const csv = '﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  const d = new Date()
  a.href = url
  a.download = `portfolio-uxboutique-${d.toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
