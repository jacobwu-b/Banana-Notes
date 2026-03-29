# Banana Notes — Product Requirements Document

**Version:** 1.0
**Status:** Active
**Last updated:** 2026-03-29

---

## 1. What Is This

Banana Notes is a web-based note-taking app with feature parity to Apple Notes
(core features only) wrapped in a playful, cartoonic banana theme. The visual
identity is vibrant and characterful but never distracting — the writing
experience is always the priority.

This project exists primarily as a demonstration and practice environment for
AI-assisted development best practices. Code quality, process discipline, and
auditability are as important as the product itself.

---

## 2. Target User

Anyone who wants a note-taking app. For the purposes of this build, assume a
single developer (the builder) as the primary user during development. Multi-
user support is required via auth — each user sees only their own notes.

---

## 3. Design Direction

**The vibe:** Duolingo-meets-Notion. Friendly, confident, slightly silly.
The banana is a mascot, not a distraction.

**Color palette (suggested starting point — final call is yours):**
- Primary: Banana yellow (#FFE135 or similar warm yellow)
- Accent: Leafy green (#4CAF50 range)
- Background: Warm off-white or very light cream — never stark white
- Text: Near-black (#1a1a1a) — high contrast, always readable
- Sidebar: Slightly darker cream or soft tan

**Typography:**
- UI chrome: A rounded, friendly sans-serif (e.g. Inter, Plus Jakarta Sans)
- Note body: Clean, readable serif or neutral sans — user's words get a
  neutral canvas; the personality lives in the chrome

**Banana character:** A simple cartoon banana can appear in empty states,
loading states, and as the app icon/logo. It should feel hand-drawn or
chunky-illustrated, not clip art. It does not appear inside notes.

**What the theme applies to:**
- App logo, favicon
- Sidebar and toolbar chrome
- Empty states ("No notes yet — go bananas!")
- Buttons, hover states, focus rings
- Toasts and notifications

**What the theme does NOT apply to:**
- The note editor area — this stays clean and neutral
- Font choices inside notes — the user controls that

---

## 4. Feature Scope

### 4.1 In Scope (v1)

#### Authentication
- Email + password sign up and sign in
- Sign out
- Row-level security: users can only read/write their own notes
- No OAuth, no magic link (v2 candidate)

#### Note Management
- **Create** a new note (blank, instant, named "New Note" by default)
- **Delete** a note (with confirmation — soft delete preferred,
  hard delete acceptable for v1)
- **Edit** a note — title and body, auto-saved
- **Pin** a note (pinned notes appear at top of list, marked visually)
- **Duplicate** a note (creates a copy with "Copy of [title]" as name)
- **Search** — live search across all notes (title + body text)

#### Note List (Sidebar)
- List of all user's notes, sorted by: pinned first, then last modified
- Shows: note title, first line of body, last modified timestamp
- Active/selected note highlighted
- Search bar at top of sidebar
- "New note" button prominent

#### Note Editor
Rich text editing via a well-supported library (Tiptap recommended).
Supported formatting:

**Text styles:**
- Bold, Italic, Underline, Strikethrough
- Inline code

**Headings:**
- Heading 1, Heading 2, Heading 3
- Body text (paragraph)

**Structure:**
- Bulleted list
- Numbered list
- Task list (checkbox items)
- Blockquote
- Code block (monospace, syntax-highlighted background)
- Horizontal rule

**Indentation:**
- Indent / outdent on list items

**Tables:**
- Insert table
- Add/remove rows and columns
- Basic cell editing

**Links:**
- Insert hyperlink (URL + display text)
- Click to open in new tab

**Editor toolbar:**
- Floating or fixed toolbar with all the above controls
- Clear, icon-based, tooltips on hover

#### Auto-save
- Note saves automatically as the user types
- Debounced — no save on every keystroke, save after ~1s of inactivity
- Visual indicator: "Saving…" → "Saved" (subtle, not intrusive)

#### Keyboard Shortcuts
Standard shortcuts must work:
- Cmd/Ctrl+B — Bold
- Cmd/Ctrl+I — Italic
- Cmd/Ctrl+U — Underline
- Cmd/Ctrl+Z — Undo
- Cmd/Ctrl+Shift+Z — Redo
- Cmd/Ctrl+K — Insert link
- Cmd/Ctrl+N — New note (app-level)
- Cmd/Ctrl+F — Focus search

### 4.2 Explicitly Out of Scope (v1)

The following will not be built. Do not stub, reference, or plan for these:

- Note sharing or collaboration
- Note locking or passwords
- Attachments (images, files, audio, sketches)
- Apple Intelligence / AI features
- Folders or tags (flat note list only for v1)
- Multi-device sync UI (data is always in the cloud — this means no
  offline mode, no device-specific features)
- Export (PDF, Markdown, etc.)
- Dark mode
- Mobile-specific UI (responsive is fine, but no native mobile features)
- iCloud, AirDrop, Handoff, or any Apple-ecosystem integrations

### 4.3 Use Your Judgment

For anything not mentioned above, apply this test: does it make the core
note-taking experience meaningfully better without adding significant
complexity? If yes, include it. If no or uncertain, skip it and note it
as a v2 candidate in DECISIONS.md.

---

## 5. Data Model

### users
Managed by Supabase Auth. No custom users table needed unless profile
data is required (it is not for v1).

### notes
| Column | Type | Notes |
|---|---|---|
| id | uuid | Primary key, default gen_random_uuid() |
| user_id | uuid | FK to auth.users.id, NOT NULL |
| title | text | Default empty string |
| body | jsonb | Tiptap ProseMirror JSON document |
| body_text | text | Plaintext extraction of body for search |
| is_pinned | boolean | Default false |
| created_at | timestamptz | Default now() |
| updated_at | timestamptz | Updated on every save |
| deleted_at | timestamptz | Soft delete — null means not deleted |

**RLS policies:**
- SELECT: user_id = auth.uid()
- INSERT: user_id = auth.uid()
- UPDATE: user_id = auth.uid()
- DELETE: user_id = auth.uid()
(Supabase RLS handles this — no backend logic needed)

---

## 6. Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router) | Consistent with best-practice template |
| Language | TypeScript (strict) | Type safety, AI-friendly |
| Database | Supabase (Postgres) | Auth + DB + RLS in one, free tier |
| Auth | Supabase Auth | Built-in, pairs with RLS |
| ORM / DB client | Supabase JS client | Direct, no Prisma needed for this scale |
| Rich text editor | Tiptap | Headless, extensible, ProseMirror-based |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration |
| Hosting | Vercel | Zero-config Next.js |
| Testing | Vitest | Fast, co-located unit tests |

---

## 7. Application Layout
```
┌─────────────────────────────────────────────────────────────┐
│  🍌 Banana Notes                              [User] [Sign out] │
├────────────────────┬────────────────────────────────────────┤
│                    │                                         │
│  [Search bar]      │  [Note title — large, editable]         │
│                    │                                         │
│  [+ New Note]      │  [Toolbar: B I U ... H1 H2 • 1. ☑ "]   │
│                    │  ─────────────────────────────────────  │
│  📌 Pinned         │                                         │
│  > Meeting notes   │  [Note body — rich text editor]         │
│  > Project ideas   │                                         │
│                    │                                         │
│  All Notes         │                                         │
│  > Grocery list    │                                         │
│  > Random thought  │                                         │
│  > ...             │                  [Saved ✓]              │
│                    │                                         │
└────────────────────┴────────────────────────────────────────┘
```

---

## 8. Build Plan

Each phase is one PR. No phase starts until the previous one is merged.

| Phase | Scope | Branch | Checkpoint |
|---|---|---|---|
| 0 | Project scaffold: Next.js, Tailwind, Supabase client, CI, env setup | feat/scaffold | App loads, env vars documented, CI passes |
| 1 | Auth: sign up, sign in, sign out, protected routes | feat/auth | Can create account, sign in, sign out, /dashboard redirects to /login if unauthed |
| 2 | Database: notes table, RLS policies, Supabase migration | feat/db-schema | Table exists, RLS verified in Supabase dashboard |
| 3 | Note list: sidebar with create, list, select, delete, pin, duplicate | feat/note-list | Can create/delete/pin/duplicate notes, list renders correctly |
| 4 | Note editor: Tiptap integration, all formatting, auto-save | feat/note-editor | All formatting tools work, auto-save confirmed |
| 5 | Search: live search across title + body_text | feat/search | Search returns correct results, clears correctly |
| 6 | Polish: banana theme, empty states, keyboard shortcuts, responsive | feat/polish | Theme applied, shortcuts work, looks good |
| 7 | Hardening: error states, loading states, edge cases, final QA | feat/hardening | No obvious broken states, CI green |

---

## 9. Decisions Log

| Date | Decision | Rationale |
|---|---|---|
| 2026-03-29 | Tiptap for rich text | Headless, TypeScript-native, extensible, active community. ProseMirror-based so body stored as JSON. |
| 2026-03-29 | body_text column for search | Full ProseMirror JSON is not searchable with ILIKE. Maintain a plaintext extraction for search queries. Updated on every save. |
| 2026-03-29 | Soft delete (deleted_at) | Preserves data, enables potential undo. All queries filter WHERE deleted_at IS NULL. |
| 2026-03-29 | No Prisma | Supabase JS client is sufficient for this data model. Prisma adds overhead without benefit at this scale. |
| 2026-03-29 | Flat note list (no folders/tags) | Scope control. Apple Notes folders are a v2 candidate. |
| 2026-03-29 | Auto-save debounced at 1s | Balance between data safety and request volume. |

---

## 10. Success Criteria

The project succeeds when:
1. A user can sign up, create notes, format them richly, pin them, search them, and sign out — with no data loss
2. Every feature is on a separate auditable PR with tests
3. The banana theme makes someone smile without getting in the way
4. A new engineer could clone the repo and understand the codebase from the README alone