# Phase 0 — Project Scaffold

Read CLAUDE.md and PRD.md before responding.

## Task
Bootstrap the Banana Notes project with the complete project
structure, tooling, and CI — but no application logic yet.

## Branch
feat/scaffold

## Deliverables

### Repository structure
Create the full directory structure from CLAUDE.md Section 3,
with empty placeholder files where content is not yet relevant.

### Dependencies to install
Initialize with:
- next (latest stable, App Router)
- typescript (strict)
- tailwindcss v4
- @supabase/ssr
- @supabase/supabase-js
- vitest
- @vitejs/plugin-react (for vitest)
- eslint + eslint-config-next

Do not install Tiptap yet (Phase 4).
Confirm each package with me before adding it.

### Files to create
- next.config.ts — standard config
- tsconfig.json — strict TypeScript
- tailwind.config.ts — base config, add banana yellow + cream
  to the color palette as custom colors (banana-yellow, banana-cream,
  leaf-green)
- postcss.config.mjs
- .env.example — with all required env vars, none filled in
- src/lib/config.ts — reads env vars, throws if missing required ones
- src/lib/supabase/client.ts — browser Supabase client
- src/lib/supabase/server.ts — server Supabase client using cookies
- src/middleware.ts — session refresh middleware (Supabase pattern)
- src/app/layout.tsx — root layout, sets <html lang="en">
- src/app/globals.css — Tailwind imports
- src/app/page.tsx — redirects to /dashboard
- .github/workflows/ci.yml — runs tsc, eslint, vitest on every PR
- vitest.config.mts — with @ path alias
- README.md — from the template in the project docs
- DECISIONS.md — from the project docs
- CHANGELOG.md — empty, first entry "Unreleased"

### What NOT to create yet
- Any auth pages
- Any dashboard pages
- Any database files
- Any application components

## Before writing code
1. Confirm the branch name
2. List every file you will create
3. List every package you will install
4. Wait for my go-ahead

## Definition of done
- `npm run dev` starts without errors
- `npm run build` succeeds
- `npx tsc --noEmit` passes
- `npm run lint` passes
- `npm test` runs (0 tests is fine — just confirm the runner works)
- CI workflow file is present and would pass on GitHub
- .env.example documents all required variables