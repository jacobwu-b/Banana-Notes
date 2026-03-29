# Phase 3 — Note List (Sidebar)

Read CLAUDE.md and PRD.md before responding.
Phase 2 (db-schema) must be merged and migration must be run
before starting this phase.

## Task
Build the sidebar note list with all note management actions.
The note editor is NOT part of this phase — clicking a note
should navigate to /dashboard/notes/[id] which can be a
placeholder page for now.

## Branch
feat/note-list

## Scope

### Layout
src/app/dashboard/layout.tsx:
- Two-column layout: fixed sidebar (left) + main content (right)
- Sidebar width: ~260px, fixed, scrollable note list
- Apply banana theme to sidebar chrome (see PRD Section 3)
- Header area: 🍌 Banana Notes logo + signed-in user email
- Sign out button or menu

### Server Actions
src/app/actions/notes.ts:

createNote(title?: string)
- Inserts new note for current user
- Returns the new note
- Default title: "New Note"
- Default body: empty Tiptap document JSON
- Default body_text: ''

deleteNote(id: string)
- Sets deleted_at = now()
- Verifies user_id matches authenticated user
- Returns { data, error }

pinNote(id: string, isPinned: boolean)
- Toggles is_pinned
- Verifies ownership
- Returns { data, error }

duplicateNote(id: string)
- Fetches original, creates copy with title "Copy of [original title]"
- New note gets current timestamp, is_pinned = false
- Returns the new note

All actions:
- Auth-guarded (derive user from session, never trust input)
- Return { data, error }
- Never throw

### Note list component
src/components/sidebar/Sidebar.tsx (Server Component):
- Fetches all notes for user (deleted_at IS NULL)
- Sorted: pinned first, then by updated_at DESC
- Renders NoteListItem for each

src/components/sidebar/NoteListItem.tsx:
- Shows: title (or "Untitled" if empty), first line of body_text,
  relative timestamp (e.g. "2 hours ago")
- Pinned indicator (📌 or styled pin icon)
- Right-click or ⋯ menu with: Pin/Unpin, Duplicate, Delete
- Delete triggers a confirmation dialog before calling deleteNote
- Active state: highlighted when this note is selected

### New Note button
- Prominent "+ New Note" button at top of sidebar
- Creates note and navigates to /dashboard/notes/[newId]

### Empty state
When user has no notes:
- Show banana character illustration
- Friendly copy: "Nothing here yet — go bananas! 🍌"
- Big "Create your first note" button

### Placeholder editor page
src/app/dashboard/notes/[id]/page.tsx:
- Fetches note by ID for the current user
- If not found or not owned: redirect to /dashboard
- For now: just render the note title as an <h1>
- This will be replaced in Phase 4

## Testing
src/app/actions/notes.test.ts:
- createNote: creates with defaults, returns new note
- deleteNote: sets deleted_at, rejects wrong user
- pinNote: toggles correctly, rejects wrong user
- duplicateNote: creates copy with correct title, not pinned
Mock Supabase client.

## Before writing code
1. Confirm branch name
2. List all files to create/modify
3. Describe the component data flow in plain English
4. Wait for my approval