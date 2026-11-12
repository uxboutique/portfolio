# UX Boutique · Portfolio

Strumento interno per gestire, monitorare e cercare i progetti dei clienti di UX Boutique.
Sostituisce il foglio “_Elenco_Clienti_Portfolio_Mockup”.

## Avvio

```bash
npm install
npm run dev      # sviluppo locale, senza login
npm run build    # build di produzione (con login)
```

## Stack

Vite + React + TypeScript, Tailwind CSS v4, icone Lucide.

## Dati

- Salvati in `localStorage` del browser (chiave `uxb-portfolio-projects-v1`).
- Al primo avvio vengono caricati i 235 progetti importati dall’Excel (`src/data/seed.json`, aggiornato al 04/11/2026).
- Tutta la persistenza passa da `src/store.ts`: per migrare a Supabase basta sostituire lettura/scrittura lì.

Note sull’import dall’Excel:
- La colonna G dell’Excel (“Portfolio sito solo screenshot”) contiene in realtà lo stato di pubblicazione
  (fatto / non pubblicabile / in attesa / pubblicabile), quindi è stata mappata su **Stato pubblicazione**.
- Lo stato **Screenshot** è stato dedotto: pubblicato → fatto; pubblicabile o in attesa → da fare; non pubblicabile → da non fare.
- Il testo della colonna H (URL della pagina o note come “da pubblicare logo”) è conservato nel campo **Pagina portfolio / nota**.
- Corretti i tag “Banding” → Branding e “App (gara)” → App.
- La data di inserimento dei progetti importati è il 04/11/2026 (data dell’ultimo aggiornamento del foglio).

## Accesso

Credenziali in `src/auth.config.ts`. Il login è attivo solo nella build di produzione.
Essendo un’app solo-frontend le credenziali finiscono nel bundle: è una protezione dall’accesso casuale,
da sostituire con Supabase Auth.

## Pubblicazione

Da definire: Cloudflare Pages + Cloudflare Access (consigliato) oppure Vercel/Netlify con password. GitHub Pages non è adatto perché il sito resterebbe pubblico.
