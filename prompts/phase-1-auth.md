# Phase 1 — Authentication

Read CLAUDE.md and PRD.md before responding.
Phase 0 (scaffold) must be merged before starting this phase.

## Task
Implement sign up, sign in, sign out, and route protection.
No note functionality yet.

## Branch
feat/auth

## Scope

### Pages to create
- /login — email + password sign in form
- /signup — email + password sign up form

### Behavior
- Sign up: creates Supabase auth user, redirects to /dashboard
- Sign in: authenticates, redirects to /dashboard
- Sign out: clears session, redirects to /login
- /dashboard (and all sub-routes): protected.
  Unauthenticated users redirect to /login.
- /login and /signup: if already authenticated, redirect to /dashboard

### Server Actions
src/app/actions/auth.ts:
- signIn(formData) — email + password
- signUp(formData) — email + password
- signOut()

### Styling
Apply the banana theme to the auth pages:
- Logo: 🍌 Banana Notes (use the emoji for now — a real SVG logo
  is Phase 6)
- Background: banana-cream color
- Card: white with rounded corners, subtle shadow
- Button: banana-yellow background, dark text, rounded
- The page should feel warm and inviting, not corporate

### Error handling
- Invalid credentials: show inline error message
- Existing email on signup: show inline error
- All errors from Supabase auth must be surfaced to the user

### What NOT to build
- OAuth / social login
- Magic link
- Password reset (v2 candidate)
- Email verification flow (disable email confirm in Supabase for now)

## Testing
src/app/actions/auth.test.ts:
- signIn: success case, invalid credentials case
- signUp: success case, existing email case
- signOut: clears session
Mock the Supabase client.

## External steps I need to take
List in the PR description exactly what I need to do in the
Supabase dashboard to make auth work.

## Before writing code
1. Confirm the branch name
2. List every file you will create or modify
3. Describe the implementation approach in 5 bullets
4. Wait for my approval