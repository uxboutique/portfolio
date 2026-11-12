/**
 * Credenziali di accesso (solo build di produzione).
 * Temporanee: da sostituire con Supabase Auth.
 * Nota: in un'app solo-frontend queste credenziali finiscono nel bundle JS,
 * quindi proteggono dall'accesso casuale, non da un attacco mirato.
 */
export const authConfig = {
  users: [{ username: 'admin', password: 'uxboutique2026' }],
  sessionKey: 'uxb-portfolio-session',
  /** In sviluppo locale (npm run dev) il login viene saltato. */
  requireAuth: import.meta.env.PROD && import.meta.env.VITE_SKIP_AUTH !== '1',
}
