# Phase 5 — Search

Read CLAUDE.md and PRD.md before responding.
Phase 4 (note-editor) must be merged before starting this phase.

## Task
Implement live search across all notes (title + body text).

## Branch
feat/search

## Scope

### Search behavior
- Search bar at top of sidebar (already present as placeholder)
- User types → results filter in real-time (client-side filter
  or server query — propose your approach)
- Matches against: note title and body_text
- Case-insensitive
- Empty search: show all notes (default state)
- No results: show empty state ("No notes match "[query]" 🍌")
- Search does not navigate away — the note list filters in place

### Implementation approach
Propose one of these and justify your choice before writing code:
A) Client-side: fetch all notes once, filter in JS
B) Server-side: debounced fetch with query param

For v1 note volumes (< 1000 notes), option A is likely fine.
State your reasoning.

### Keyboard shortcut
Cmd/Ctrl+F should focus the search input.

### Search component
src/components/sidebar/SearchBar.tsx ("use client"):
- Controlled input
- Clear button (×) when query is non-empty
- Accessible: label, aria attributes

## Testing
Unit test the search filter logic (if client-side):
- Matches on title
- Matches on body_text
- Case-insensitive
- Empty query returns all notes
- No match returns empty array

## Before writing code
1. Confirm branch name
2. Propose and justify client-side vs server-side search
3. Wait for my approval on the approach