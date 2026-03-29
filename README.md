# 🍌 Banana Notes

A web-based note-taking app with Apple Notes feature parity and a
playful banana theme. Built as a demonstration of AI-assisted
development best practices.

---

## Features

- Rich text editing: bold, italic, underline, headings, bullets,
  numbered lists, task lists, tables, blockquotes, code blocks, links
- Create, delete, pin, duplicate notes
- Live search across all notes
- Auto-save (1s debounce)
- Per-user authentication with row-level security

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- A [Supabase](https://supabase.com) account (free tier is fine)
- A [Vercel](https://vercel.com) account for deployment (optional for local)

### Local Setup
```bash
# 1. Clone
git clone https://github.com/[your-username]/banana-notes.git
cd banana-notes

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env.local
# Fill in your Supabase credentials — see Environment Variables below

# 4. Run database migrations
# Paste the contents of supabase/migrations/001_notes.sql
# into the Supabase SQL editor and run it

# 5. Start
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

All variables are documented in `.env.example`.

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anon/public key |

Never add `SUPABASE_SERVICE_ROLE_KEY` to client-accessible variables.

---

## Development

### Commands
```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # ESLint
npm test           # Vitest unit tests
npx tsc --noEmit   # Type check
```

### Architecture

See `CLAUDE.md` for the full architecture rules.
See `PRD.md` for the product spec.
See `DECISIONS.md` for the reasoning behind key technical choices.

### Project structure
```
src/
├── app/
│   ├── (auth)/           ← Login + signup pages
│   ├── dashboard/        ← Protected note-taking app
│   ├── actions/          ← All Server Actions (mutations)
│   └── layout.tsx
├── components/
│   ├── editor/           ← Tiptap editor + toolbar
│   ├── sidebar/          ← Note list + search
│   └── ui/               ← Shared UI components
└── lib/
    ├── config.ts          ← Env vars (only place process.env lives)
    ├── supabase/          ← Supabase client (browser + server)
    └── types/             ← TypeScript types
```

### Adding a feature

1. Check PRD.md — is it in scope?
2. Read CLAUDE.md — follow the architecture rules
3. Create a branch: `feat/[scope]-[description]`
4. Write tests alongside the code
5. Fill out the PR template before asking for review

---

## Deployment

### Vercel

1. Connect this repo to a new Vercel project
2. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy — Vercel auto-deploys on push to main

### Supabase

1. Create project at supabase.com
2. Run migration: SQL editor → paste `supabase/migrations/001_notes.sql`
3. Confirm RLS is enabled on the notes table
4. Auth settings: Dashboard → Authentication → Providers → Email (enabled)

---

## Contributing

This project is built using AI-assisted development.
Every feature ships as a PR. Nothing goes directly to main.
See `CLAUDE.md` for the full workflow.

---

## License

MIT