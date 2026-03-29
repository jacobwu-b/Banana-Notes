# Banana Notes — Architecture Decisions

A running log of significant technical decisions.
Update this file when a decision is made. Never retroactively.

---

## Template

### [YYYY-MM-DD] Title

**Context:** What problem required a decision.
**Decision:** What was decided.
**Reasoning:** Why this over alternatives.
**Rejected alternatives:** What else was considered and why it lost.
**Consequences:** What this enables, forecloses, or defers.

---

## Decisions

### 2026-03-29 Tiptap for rich text editing

**Context:** Need a rich text editor supporting all formatting in PRD
Section 4.1, including tables, task lists, and links. Must store content
in a format queryable for search and renderable server-side.

**Decision:** Tiptap with ProseMirror JSON storage.

**Reasoning:** Headless (no imposed styling), TypeScript-native,
extensible via extensions, active community, ProseMirror JSON is
structured and portable.

**Rejected alternatives:**
- Quill — older, less TypeScript-friendly, harder to extend
- Slate — more low-level, more work to implement all features
- ContentEditable + custom — too much custom work, fragile

**Consequences:** Note body stored as JSONB in Postgres. A separate
body_text column must be maintained for search (JSONB is not
searchable with ILIKE). Tiptap is a client-side dependency — editor
must be "use client".

---

### 2026-03-29 body_text column for full-text search

**Context:** body is stored as ProseMirror JSON (JSONB). Postgres
ILIKE cannot search inside arbitrary JSON structures without
custom functions.

**Decision:** Maintain a body_text TEXT column updated on every save
containing a plaintext extraction of the note body.

**Reasoning:** Simple, performant for the scale of this app. Search
queries use ILIKE against title and body_text.

**Rejected alternatives:**
- Postgres full-text search with tsvector — more powerful but
  more setup; ILIKE is sufficient for v1 note volumes
- Search only in title — does not meet PRD requirements
- Parse JSON in the query — fragile and slow

**Consequences:** Every save operation must extract plaintext from
Tiptap JSON and update body_text. This logic lives in a utility
function (src/lib/utils/extractText.ts) with unit tests.

---

### 2026-03-29 Supabase client only, no Prisma

**Context:** Need a data access layer.

**Decision:** Use Supabase JS client directly. No Prisma.

**Reasoning:** The data model is a single table (notes). Supabase
client is sufficient. Prisma adds type generation, migration
management, and query building that are all handled more simply
by Supabase at this scale.

**Rejected alternatives:**
- Prisma — overhead not justified for one table

**Consequences:** No generated types from schema. Types in
src/lib/types/note.ts must be maintained manually when schema
changes. Migrations written in raw SQL in supabase/migrations/.

---

### 2026-03-29 Soft delete with deleted_at

**Context:** Note deletion strategy.

**Decision:** Soft delete: set deleted_at = now(). All queries
filter WHERE deleted_at IS NULL.

**Reasoning:** Preserves data. Enables potential undo feature (v2).
Low complexity — just a timestamp column and a query filter.

**Rejected alternatives:**
- Hard delete — simpler but unrecoverable, forecloses undo v2
- Separate deleted_notes table — unnecessary complexity

**Consequences:** Every note query must include the deleted_at IS
NULL filter. This must be enforced in all Server Actions. Claude
must not write note queries without this filter.

---

### 2026-03-29 Auto-save debounced at 1 second

**Context:** How and when to persist note changes.

**Decision:** Debounce saves — trigger a save 1 second after the
user stops typing.

**Reasoning:** Balance between data safety and Supabase request
volume. 1 second feels instant to users. Saves on every keystroke
would generate dozens of requests per second.

**Rejected alternatives:**
- Save on blur / navigate away — too risky, data loss if tab closes
- Every 5 seconds — too slow, feels unsafe
- Every keystroke — too many requests

**Consequences:** The editor component manages a debounced save
function. A "Saving…" / "Saved ✓" indicator gives feedback.
There is a ~1 second window of potential data loss on hard crash.

---

### 2026-03-29 Flat note list (no folders or tags) for v1

**Context:** Apple Notes supports folders. Should Banana Notes?

**Decision:** No folders, no tags in v1. Flat list only.

**Reasoning:** Scope control. Search handles discoverability at
the scale of notes a single user has. Folders add data model
complexity (folder table, folder_id FK, nested structure).

**Rejected alternatives:**
- Folders — PRD explicitly defers this to v2

**Consequences:** All notes appear in one flat list. Pinned notes
sort to the top. Search is the primary navigation tool.
Folders are a v2 candidate (add to PRD).