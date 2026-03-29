# Phase 4 — Note Editor

Read CLAUDE.md and PRD.md before responding.
Phase 3 (note-list) must be merged before starting this phase.

## Task
Replace the placeholder editor page with a full Tiptap rich text
editor supporting all formatting in PRD Section 4.1.

## Branch
feat/note-editor

## New dependencies needed (confirm with me before installing)
- @tiptap/react
- @tiptap/starter-kit
- @tiptap/extension-table
- @tiptap/extension-table-row
- @tiptap/extension-table-cell
- @tiptap/extension-table-header
- @tiptap/extension-task-list
- @tiptap/extension-task-item
- @tiptap/extension-link
- @tiptap/extension-underline
- @tiptap/extension-strike
- @tiptap/extension-code-block

Propose the exact package versions before installing.

## Scope

### Editor component
src/components/editor/NoteEditor.tsx ("use client"):
- Tiptap editor initialized with all required extensions
- Receives: note (Note type), onSave callback
- On change: debounce 1000ms, then call onSave with updated
  title + body JSON + body_text (plaintext extraction)
- Title is a plain text input above the editor, part of the
  same auto-save cycle
- Editor area: clean, neutral, no banana theme styling
- Comfortable reading width (~700px max), centered

### Toolbar
src/components/editor/Toolbar.tsx ("use client"):
- Fixed toolbar above the editor (not floating)
- All controls from PRD Section 4.1:
  Bold | Italic | Underline | Strikethrough | Code
  — separator —
  H1 | H2 | H3 | Paragraph
  — separator —
  Bullet list | Numbered list | Task list
  — separator —
  Blockquote | Code block | Horizontal rule
  — separator —
  Table (insert) | Link (insert/edit)
  — separator —
  Indent | Outdent
- Icons: use lucide-react (confirm install)
- Active state: button highlighted when format is active at cursor
- Tooltips on hover showing the keyboard shortcut

### Keyboard shortcuts
These must work (most are Tiptap defaults — verify each):
- Cmd/Ctrl+B — Bold
- Cmd/Ctrl+I — Italic
- Cmd/Ctrl+U — Underline
- Cmd/Ctrl+Z — Undo
- Cmd/Ctrl+Shift+Z — Redo
- Cmd/Ctrl+K — Insert/edit link (open a small popover)

### Auto-save
- Debounced save: 1 second after last change
- Update both body (JSON) and body_text (extracted plaintext)
- Show save indicator: "Saving…" while in-flight, "Saved ✓" on success
  (src/components/ui/SaveIndicator.tsx)
- On error: show subtle error state

### Page
src/app/dashboard/notes/[id]/page.tsx:
- Server Component
- Fetches note (owner check: redirect if not found or not theirs)
- Passes note to NoteEditor
- updateNote Server Action handles saves

### updateNote Server Action
Add to src/app/actions/notes.ts:
updateNote(id: string, updates: { title?: string, body?: object, body_text?: string })
- Verifies ownership
- Sets updated_at = now()
- Returns { data, error }

### What NOT to style
The editor textarea itself must stay clean:
- White or near-white background
- Neutral font (system-ui or Inter)
- No banana colors inside the editor area
- Standard cursor behavior
- Comfortable line height (1.6 or similar)

## Testing
Add to src/app/actions/notes.test.ts:
- updateNote: updates title, updates body+body_text,
  rejects wrong user, returns { data, error }

src/lib/utils/extractText.test.ts should already exist from Phase 2.
Verify all existing tests still pass.

## Before writing code
1. Confirm branch name
2. Confirm the exact Tiptap packages and versions you plan to use
3. Describe how auto-save will be implemented (hooks, state, etc.)
4. Wait for my approval on the approach before writing code