# Phase 7 — Hardening

Read CLAUDE.md and PRD.md before responding.
Phase 6 (polish) must be merged before starting this phase.

## Task
Close all error paths, add loading states, verify RLS, and
ensure the app handles edge cases gracefully.

## Branch
feat/hardening

## Scope

### Error boundaries
- Add a root error boundary (error.tsx) for unexpected crashes
- Add a not-found page (not-found.tsx) for /dashboard/notes/[id]
  when note doesn't exist
- Error pages should be on-theme (banana character, friendly copy)

### Auth edge cases
- Session expiry mid-session: Supabase middleware handles
  token refresh — verify this works correctly
- Accessing /dashboard/notes/[id] for a note you don't own:
  redirects to /dashboard (verify this is already implemented
  from Phase 3/4)

### Data edge cases
- Very long note title: truncated correctly in sidebar,
  not broken in editor
- Empty note (no title, no body): renders correctly,
  saves correctly, shows "Untitled" in list
- Note with only whitespace title: treated as "Untitled"
- Rapid note switching: no race condition on save
  (the in-flight save should be cancelled or handled)

### Network / save errors
- If auto-save fails: show a persistent error indicator
  ("Save failed — check your connection")
- Retry logic: attempt save again after 5 seconds on failure

### Performance
- Note list with 50+ notes: does not feel slow
- Large note body: editor does not lag

### Final audit
Go through the entire PRD Section 4.1 feature list and
verify every item works. Report anything that is broken
or missing.

### CHANGELOG.md
Update with all phases completed.

### README.md
Verify the setup instructions actually work from scratch.
Update anything that is outdated.

## Testing additions
- Add any missing unit test coverage surfaced during the audit
- Verify: npm test runs clean with no skipped or failing tests

## Before writing code
1. Confirm branch name
2. Do the full PRD audit first — list every feature and
   its current status (working / broken / missing)
3. Prioritize the list with me before fixing anything
4. Wait for my go-ahead