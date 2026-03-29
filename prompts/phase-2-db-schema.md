# Phase 2 — Database Schema

Read CLAUDE.md and PRD.md before responding.
Phase 1 (auth) must be merged before starting this phase.

## Task
Create the notes table, RLS policies, and TypeScript types.
No UI yet — this phase is purely data layer.

## Branch
feat/db-schema

## Scope

### Migration file
supabase/migrations/001_notes.sql

Create the notes table exactly as specified in PRD.md Section 5:
- id (uuid, primary key)
- user_id (uuid, FK to auth.users, NOT NULL)
- title (text, default '')
- body (jsonb, default '{}')
- body_text (text, default '')
- is_pinned (boolean, default false)
- created_at (timestamptz, default now())
- updated_at (timestamptz, default now())
- deleted_at (timestamptz, nullable)

### RLS policies
In the same migration file, enable RLS and create four policies:
- SELECT: auth.uid() = user_id
- INSERT: auth.uid() = user_id (also enforce user_id = auth.uid() in WITH CHECK)
- UPDATE: auth.uid() = user_id
- DELETE: auth.uid() = user_id
(Soft-delete means we use UPDATE to set deleted_at, not actual DELETE —
but include the DELETE policy for completeness.)

### Updated_at trigger
Create a trigger that sets updated_at = now() on every UPDATE.

### TypeScript types
src/lib/types/note.ts:
```typescript
export type Note = {
  id: string
  user_id: string
  title: string
  body: Record<string, unknown> // ProseMirror JSON
  body_text: string
  is_pinned: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export type NoteInsert = Omit<Note, 'id' | 'created_at' | 'updated_at'>
export type NoteUpdate = Partial<Omit<Note, 'id' | 'user_id' | 'created_at'>>
```

### Utility function
src/lib/utils/extractText.ts:
A function that takes a Tiptap/ProseMirror JSON document and
returns a plaintext string. This will be called on every save.

Write unit tests for this function with real Tiptap JSON samples.

## What NOT to build
- No Server Actions yet
- No UI yet
- Do not use Prisma

## Testing
src/lib/utils/extractText.test.ts:
- Empty document returns empty string
- Simple paragraph returns correct text
- Nested structure (heading + paragraphs) returns concatenated text
- Handles null/undefined input gracefully

## External steps I need to take
In the PR description, tell me exactly:
1. Where to run the migration SQL (Supabase SQL editor)
2. How to verify RLS is enabled
3. How to verify the table was created correctly

## Before writing code
1. Confirm the branch name
2. Show me the SQL you plan to write before writing the file
3. Wait for my approval on the SQL
4. Then proceed