export const SETTORI = [
  'Arts, Education & Culture',
  'Fashion & Luxury',
  'Automotive, Transportation & Mobility',
  'Utilities',
  'Retail & Consumer Goods',
  'Banking, Finance & Insurance',
  'Information Technology',
  'Food & Beverage',
  'Media & Publishing',
  'Beauty, Healthcare & Pharmaceuticals',
  'Industry, B2B & Manufacturing',
  'GDO',
  'Travel, Tourism & Real Estate',
] as const

export const TAGS = [
  'Branding', 'Website', 'Ecommerce', 'App', 'Software', 'AI',
  'Intranet', 'Formazione', 'Email', 'Landing', 'Libro',
] as const

export const TIPOLOGIE = ['Progetto', 'Gara'] as const

export type Tipologia = (typeof TIPOLOGIE)[number]
export type WorkStatus = 'fatto' | 'da_fare' | 'da_non_fare'
export type PubStatus = 'fatto' | 'non_pubblicabile' | 'in_attesa' | 'pubblicabile'
export type Tone = 'green' | 'red' | 'yellow' | 'black' | 'greenOutline'

export const WORK_STATUS: Record<WorkStatus, { label: string; emoji: string; tone: Tone }> = {
  fatto: { label: 'Fatto', emoji: '🟢 fatto', tone: 'green' },
  da_fare: { label: 'Da fare', emoji: '🔴 da fare', tone: 'red' },
  da_non_fare: { label: 'Da non fare', emoji: '⚫ da non fare', tone: 'black' },
}

export const PUB_STATUS: Record<PubStatus, { label: string; emoji: string; tone: Tone }> = {
  fatto: { label: 'Pubblicato', emoji: '🟢 fatto', tone: 'green' },
  pubblicabile: { label: 'Pubblicabile', emoji: '✅ pubblicabile', tone: 'greenOutline' },
  in_attesa: { label: 'In attesa', emoji: '🟡 in attesa', tone: 'yellow' },
  non_pubblicabile: { label: 'Non pubblicabile', emoji: '🔴 non pubblicabile', tone: 'red' },
}

export interface Project {
  id: string
  cliente: string
  tipologia: Tipologia
  settore: string
  tags: string[]
  slidePptx: WorkStatus
  caseStudy: WorkStatus
  screenshot: WorkStatus
  statoPubblicazione: PubStatus
  /** Testo libero dalla colonna H dell'Excel (URL della pagina o nota). */
  notaPubblicazione: string
  logo: string
  bestOf: boolean
  inHome: boolean
  collab: string
  mockup: WorkStatus
  seguitoDa: string
  mockupDa: string
  drive: string
  /** ISO 8601, impostata all'inserimento e mai modificata. */
  dataInserimento: string
}

export type ProjectInput = Omit<Project, 'id' | 'dataInserimento'>

export interface Filters {
  q: string
  settore: string
  tags: string[]
  pub: PubStatus | ''
  mockup: WorkStatus | ''
  bestOf: boolean
  seguitoDa: string
}

export const EMPTY_FILTERS: Filters = {
  q: '', settore: '', tags: [], pub: '', mockup: '', bestOf: false, seguitoDa: '',
}
