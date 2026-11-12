import { useState, type FormEvent } from 'react'
import {
  PUB_STATUS, SETTORI, TAGS, TIPOLOGIE, WORK_STATUS,
  type Project, type ProjectInput, type PubStatus, type WorkStatus,
} from '../types'
import { Button, Field, Modal, fieldCls } from './ui'

const BLANK: ProjectInput = {
  cliente: '', tipologia: 'Progetto', settore: '', tags: [],
  slidePptx: 'da_fare', caseStudy: 'da_fare', screenshot: 'da_fare',
  statoPubblicazione: 'in_attesa', notaPubblicazione: '', logo: '',
  bestOf: false, inHome: false, collab: '', mockup: 'da_fare',
  seguitoDa: '', mockupDa: '', drive: '',
}

function WorkSelect({ id, value, onChange }: { id: string; value: WorkStatus; onChange: (v: WorkStatus) => void }) {
  return (
    <select id={id} className={fieldCls} value={value} onChange={(e) => onChange(e.target.value as WorkStatus)}>
      {(Object.keys(WORK_STATUS) as WorkStatus[]).map((k) => <option key={k} value={k}>{WORK_STATUS[k].emoji}</option>)}
    </select>
  )
}

export function ProjectForm({ initial, onCancel, onSave }: { initial?: Project; onCancel: () => void; onSave: (v: ProjectInput) => void }) {
  const [v, setV] = useState<ProjectInput>(() => {
    if (!initial) return BLANK
    const { id: _id, dataInserimento: _d, ...rest } = initial
    return rest
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const upd = <K extends keyof ProjectInput>(k: K, val: ProjectInput[K]) => setV((s) => ({ ...s, [k]: val }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!v.cliente.trim()) errs.cliente = 'Inserisci il nome del cliente.'
    if (!v.settore) errs.settore = 'Scegli un settore.'
    if (v.drive && !/^https?:\/\//.test(v.drive.trim())) errs.drive = 'Il link deve iniziare con https://'
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave({ ...v, cliente: v.cliente.trim(), drive: v.drive.trim() })
  }

  const err = (k: string) => errors[k] && <span role="alert" className="mt-1 block text-xs text-ko">{errors[k]}</span>
  const editing = Boolean(initial)

  return (
    <Modal
      title={editing ? `Modifica ${initial!.cliente}` : 'Nuovo progetto'}
      subtitle={editing ? 'La data di inserimento non cambia.' : 'I campi con * sono obbligatori.'}
      onClose={onCancel}
      footer={<>
        <Button onClick={onCancel}>Annulla</Button>
        <Button variant="primary" type="submit" form="project-form">{editing ? 'Salva modifiche' : 'Aggiungi progetto'}</Button>
      </>}
    >
      <form id="project-form" onSubmit={submit} noValidate className="space-y-6">
        <fieldset className="grid grid-cols-[1fr_180px] gap-4">
          <Field label="Cliente" required>
            <input className={fieldCls} value={v.cliente} onChange={(e) => upd('cliente', e.target.value)} aria-invalid={!!errors.cliente} />
            {err('cliente')}
          </Field>
          <Field label="Tipologia">
            <select className={fieldCls} value={v.tipologia} onChange={(e) => upd('tipologia', e.target.value as ProjectInput['tipologia'])}>
              {TIPOLOGIE.map((t) => <option key={t}>{t}</option>)}
            </select>
          </Field>
          <div className="col-span-2">
            <Field label="Settore" required>
              <select className={fieldCls} value={v.settore} onChange={(e) => upd('settore', e.target.value)} aria-invalid={!!errors.settore}>
                <option value="" disabled>Scegli un settore</option>
                {SETTORI.map((s) => <option key={s}>{s}</option>)}
              </select>
              {err('settore')}
            </Field>
          </div>
          <div className="col-span-2">
            <span className="mb-1.5 block text-sm font-medium">Tag</span>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Tag">
              {TAGS.map((t) => {
                const on = v.tags.includes(t)
                return (
                  <button key={t} type="button" aria-pressed={on}
                    onClick={() => upd('tags', on ? v.tags.filter((x) => x !== t) : [...v.tags, t])}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${on ? 'border-ink bg-ink text-white' : 'border-line text-ink hover:border-zinc-400'}`}
                  >{t}</button>
                )
              })}
            </div>
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-2 gap-4 border-t border-line pt-5">
          <legend className="mb-3 text-sm font-semibold">Avanzamento</legend>
          <Field label="Stato pubblicazione nel sito">
            <select className={fieldCls} value={v.statoPubblicazione} onChange={(e) => upd('statoPubblicazione', e.target.value as PubStatus)}>
              {(Object.keys(PUB_STATUS) as PubStatus[]).map((k) => <option key={k} value={k}>{PUB_STATUS[k].emoji}</option>)}
            </select>
          </Field>
          <Field label="Mockup"><WorkSelect id="mockup" value={v.mockup} onChange={(x) => upd('mockup', x)} /></Field>
          <Field label="Slide PPTX caso studio"><WorkSelect id="slide" value={v.slidePptx} onChange={(x) => upd('slidePptx', x)} /></Field>
          <Field label="Case study sito"><WorkSelect id="case" value={v.caseStudy} onChange={(x) => upd('caseStudy', x)} /></Field>
          <Field label="Screenshot sito"><WorkSelect id="shot" value={v.screenshot} onChange={(x) => upd('screenshot', x)} /></Field>
          <Field label="Logo sito UX"><input className={fieldCls} value={v.logo} onChange={(e) => upd('logo', e.target.value)} placeholder="Es. 🟢 fatto" /></Field>
          <Field label="Best of">
            <select className={fieldCls} value={v.bestOf ? '1' : ''} onChange={(e) => upd('bestOf', e.target.value === '1')}>
              <option value="">—</option><option value="1">🟢 Best of</option>
            </select>
          </Field>
          <Field label="In home sito UX">
            <select className={fieldCls} value={v.inHome ? '1' : ''} onChange={(e) => upd('inHome', e.target.value === '1')}>
              <option value="">—</option><option value="1">🟢 fatto</option>
            </select>
          </Field>
          <div className="col-span-2">
            <Field label="Pagina portfolio o nota" hint="URL della pagina sul sito o una nota, es. “da pubblicare quando concluso”">
              <input className={fieldCls} value={v.notaPubblicazione} onChange={(e) => upd('notaPubblicazione', e.target.value)} />
            </Field>
          </div>
        </fieldset>

        <fieldset className="grid grid-cols-2 gap-4 border-t border-line pt-5">
          <legend className="mb-3 text-sm font-semibold">Persone e risorse</legend>
          <Field label="Chi ha seguito il progetto" hint="Separa più nomi con una virgola">
            <input className={fieldCls} list="people" value={v.seguitoDa} onChange={(e) => upd('seguitoDa', e.target.value)} />
          </Field>
          <Field label="Chi fa il mockup">
            <input className={fieldCls} list="people" value={v.mockupDa} onChange={(e) => upd('mockupDa', e.target.value)} />
          </Field>
          <Field label="In collab. con"><input className={fieldCls} value={v.collab} onChange={(e) => upd('collab', e.target.value)} placeholder="Agenzia partner" /></Field>
          <Field label="Cartella Drive">
            <input type="url" className={fieldCls} value={v.drive} onChange={(e) => upd('drive', e.target.value)} placeholder="https://drive.google.com/…" aria-invalid={!!errors.drive} />
            {err('drive')}
          </Field>
        </fieldset>
      </form>
    </Modal>
  )
}
