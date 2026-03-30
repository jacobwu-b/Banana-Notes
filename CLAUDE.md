# Banana Notes — Claude Code Instructions

## 0. Before You Write Any Code

1. Read this entire file
2. Read PRD.md — know the full scope before touching anything
3. Confirm the current phase you are working on with me
4. State your understanding of the task in 2-3 sentences
5. Propose a branch name and implementation plan (bullet points)
6. List every file you will create or modify
7. Wait for my explicit approval before writing a single line of code

---

## 1. Project Context

**What this is:** A web note-taking app with Apple Notes feature parity
and a playful banana theme. Built primarily to demonstrate AI-assisted
development best practices.

**Spec:** PRD.md — read it. All feature decisions trace back to it.

**Current phase:** See PRD.md Section 8 — Build Plan.
Do not work ahead. Do not combine phases.

**Stack:**
- Framework: Next.js (App Router), TypeScript strict
- Styling: Tailwind CSS v4
- Database + Auth: Supabase (Postgres + Supabase Auth + RLS)
- DB client: Supabase JS client (@supabase/ssr for server, @supabase/supabase-js for client)
- Rich text: Tiptap
- Testing: Vitest
- Hosting: Vercel

---

## 2. Architecture Rules

### These are non-negotiable. Violating them requires my explicit approval.

#### Data Access
- All Supabase queries involving user data must be scoped to the
  authenticated user. Never query without a user context.
- Server Components and Server Actions fetch data server-side using
  the Supabase server client (from @supabase/ssr).
- Client Components may use the browser Supabase client only for
  real-time subscriptions or optimistic UI. All mutations go through
  Server Actions.
- Never expose Supabase service role key to the client. Ever.

#### Auth
- Every route under /dashboard/* is protected. Unauthenticated users
  redirect to /login.
- Use Supabase proxy (src/proxy.ts) for route protection.
  Note: Next.js 16 renamed "middleware" to "proxy". The file is src/proxy.ts,
  the exported function is named `proxy`, and the config export is named `config`.
- Never trust user input for user_id. Always derive it from the
  authenticated session server-side.

#### Server Actions
- All mutations (create, update, delete) are Server Actions.
- Every Server Action validates input before touching the database.
- Every Server Action returns { data, error } — never throw.
- Every Server Action is in src/app/actions/[domain].ts.

#### State
- Server Components by default.
- "use client" only when you need: browser APIs, event handlers,
  local UI state (e.g. editor state, optimistic updates).
- No global client state library. useState + Server Actions only.

#### Configuration
- All environment variables are read from src/lib/config.ts.
- No process.env anywhere else.
- .env.example must stay in sync with every new env var added.

#### Data Integrity
- Soft deletes only: set deleted_at = now(). Never run DELETE.
- All note queries filter WHERE deleted_at IS NULL.
- Auto-save is debounced (1 second). Do not save on every keystroke.
- body_text (plaintext) must be updated every time body (JSON) is saved.

#### Code Style
- TypeScript strict. No `any` without a comment explaining why.
- Named exports for components and utilities.
- Default exports for pages and layouts only.
- No console.log in committed code.
- No TODO comments without a GitHub issue number.

---

## 3. Project Structure
```
banana-notes/
├── .github/
│   └── workflows/
│       └── ci.yml              ← CI: typecheck, lint, test
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx    ← Sign in page
│   │   │   └── signup/
│   │   │       └── page.tsx    ← Sign up page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx      ← Protected layout, sidebar lives here
│   │   │   ├── page.tsx        ← Redirects to first note or empty state
│   │   │   └── notes/
│   │   │       └── [id]/
│   │   │           └── page.tsx ← Note editor view
│   │   ├── actions/
│   │   │   ├── auth.ts         ← signIn, signUp, signOut Server Actions
│   │   │   └── notes.ts        ← createNote, updateNote, deleteNote,
│   │   │                          pinNote, duplicateNote Server Actions
│   │   ├── globals.css
│   │   └── layout.tsx          ← Root layout
│   ├── components/
│   │   ├── editor/
│   │   │   ├── NoteEditor.tsx  ← Tiptap editor wrapper ("use client")
│   │   │   └── Toolbar.tsx     ← Editor toolbar ("use client")
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx     ← Note list container
│   │   │   ├── NoteListItem.tsx ← Individual note preview
│   │   │   └── SearchBar.tsx   ← Search input ("use client")
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── EmptyState.tsx  ← Banana character empty states
│   │       └── SaveIndicator.tsx ← "Saving…" / "Saved ✓"
│   ├── lib/
│   │   ├── config.ts           ← All env vars. No process.env elsewhere.
│   │   ├── supabase/
│   │   │   ├── client.ts       ← Browser Supabase client
│   │   │   └── server.ts       ← Server Supabase client (cookies)
│   │   └── types/
│   │       └── note.ts         ← Note type definitions
│   └── proxy.ts                ← Route protection (Supabase session refresh)
│                                  Next.js 16: was middleware.ts, now proxy.ts
├── supabase/
│   └── migrations/
│       └── 001_notes.sql       ← Notes table + RLS policies
├── .env.example                ← All required env vars documented
├── CLAUDE.md                   ← This file
├── PRD.md                      ← Product spec
├── DECISIONS.md                ← Architecture decision log
├── CHANGELOG.md                ← What shipped in each phase
└── README.md                   ← Setup, env vars, how to run/test
```

**Files Claude must read before touching related code:**
- `PRD.md` — before any feature work
- `src/lib/config.ts` — before adding any env var
- `src/lib/types/note.ts` — before any note-related code
- `supabase/migrations/` — before any schema change

---

## 4. Git Workflow

### Rules
1. Never commit to main. No exceptions.
2. One branch per phase (see PRD.md Section 8).
3. Confirm branch name before starting.
4. One logical commit per meaningful unit of work within a phase.
5. All tests must pass before a PR is marked ready.
6. Generate the full PR description before asking me to review.

### Branch naming
```
feat/scaffold
feat/auth
feat/db-schema
feat/note-list
feat/note-editor
feat/search
feat/polish
feat/hardening
fix/{scope}-{short-description}
chore/{short-description}
test/{short-description}
```

### Commit message format
```
{type}({scope}): {imperative description}

[optional body]
```

Types: feat | fix | chore | test | docs | refactor
Scopes: scaffold | auth | db | notes | editor | search | ui | config | ci

**Examples:**
```
feat(db): add notes table with RLS policies

feat(editor): integrate Tiptap with basic formatting toolbar

fix(auth): redirect to /login when session expires mid-session

test(notes): add unit tests for createNote Server Action
```

### Commit hygiene within a branch

Within a feature branch, commit often. These commits are
working notes — they do not need to be clean or meaningful.
They will be squashed on merge.

What matters:
- The PR title (becomes the squash commit on main)
- The PR description (becomes the squash commit body)

The PR title must follow Conventional Commits format.
Claude is responsible for generating a correct PR title
and complete PR description before asking for review.

---

## 5. Testing Requirements

### What to test
| Code | Test type |
|---|---|
| Server Actions (notes.ts, auth.ts) | Unit — mock Supabase client |
| Utility functions (text extraction, etc.) | Unit |
| Editor logic (if extracted) | Unit |
| UI | Manual — documented in PR "How to Test" |

### Test conventions
- Test file co-located: `src/app/actions/notes.test.ts`
- Mock Supabase: `vi.mock('@/lib/supabase/server')`
- Run: `npm test`
- All tests must pass before PR is ready

---

## 6. PR Description Template

Claude generates this for every PR. Do not skip it.
```markdown
## What
[2-3 sentences: what was built and why it matters for this phase]

## Changes
- `path/to/file` — [what changed]
- `path/to/file` — [what changed]

## How to Test
<!-- Numbered steps. Be specific. -->
1. [Step]
2. [Step]
3. Verify: [exact expected outcome]

## External Steps Required
<!-- Steps I need to take in Supabase dashboard, Vercel, etc. -->
- [ ] [e.g. "Run migration in Supabase: paste SQL from supabase/migrations/001_notes.sql"]
- [ ] [e.g. "Add NEXT_PUBLIC_SUPABASE_URL to Vercel environment variables"]

## Test Coverage
- [ ] [test file]: [scenarios covered]
- [ ] All existing tests pass: `npm test`

## Screenshots
[Required for any UI change]

## Notes & Follow-up
[Omissions, edge cases deferred, v2 candidates surfaced during this phase]

## Checklist
- [ ] Tests written and passing
- [ ] No process.env outside config.ts
- [ ] All mutations are Server Actions returning { data, error }
- [ ] All note queries filter deleted_at IS NULL
- [ ] body_text updated whenever body is saved
- [ ] .env.example updated if new env vars added
- [ ] No console.log committed
- [ ] PR title follows conventional commits format
```

---

## 7. What NOT to Do

- Do not build anything in PRD Section 4.2 (out of scope)
- Do not combine multiple phases into one PR
- Do not add new npm packages without confirming with me first
- Do not modify supabase/migrations/ files after they have been run
  (create a new migration instead)
- Do not expose SUPABASE_SERVICE_ROLE_KEY to the browser
- Do not hard-delete notes (use deleted_at)
- Do not save on every keystroke (debounce at 1 second)
- Do not put the banana theme inside the note editor area
- Do not generate placeholder copy using Lorem Ipsum —
  use realistic note content in any demo/seed data
- Do not mention Claude or Claude code in any commit or commit messages, for example, this is banned: "Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

---

## 8. Supabase Setup Checklist

When Phase 0 (scaffold) is complete, I need to:
- [ ] Create a new Supabase project at supabase.com
- [ ] Copy Project URL and anon key to .env.local
- [ ] Enable Email auth in Supabase Dashboard → Authentication → Providers
- [ ] Disable email confirmation for development
  (Dashboard → Auth → Settings → "Confirm email" → off)
- [ ] Run migration SQL when Phase 2 (db-schema) is complete

Claude must flag in the PR description every time a Supabase manual step is required.

---

## 9. Vercel Setup Checklist

When scaffold is deployed:
- [ ] Connect GitHub repo to Vercel
- [ ] Add environment variables:
  - NEXT_PUBLIC_SUPABASE_URL
  - NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Confirm preview deployment passes CI
