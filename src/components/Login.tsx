import { useState, type FormEvent } from 'react'
import { Button, Field, fieldCls } from './ui'

export function Login({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [error, setError] = useState('')
  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!onLogin(u.trim(), p)) setError('Nome utente o password non corretti.')
  }
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas p-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-line bg-white p-8">
        <h1 className="text-xl font-bold tracking-tight">UX Boutique</h1>
        <p className="mt-1 text-sm text-mute">Accedi al portfolio progetti</p>
        <div className="mt-6 space-y-4">
          <Field label="Nome utente"><input className={fieldCls} autoComplete="username" value={u} onChange={(e) => setU(e.target.value)} autoFocus /></Field>
          <Field label="Password"><input type="password" className={fieldCls} autoComplete="current-password" value={p} onChange={(e) => setP(e.target.value)} /></Field>
          {error && <p role="alert" className="text-sm text-ko">{error}</p>}
          <Button variant="primary" type="submit" className="h-10 w-full">Accedi</Button>
        </div>
      </form>
    </main>
  )
}
