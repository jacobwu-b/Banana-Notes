# Phase 6 — Polish

Read CLAUDE.md and PRD.md before responding.
Phase 5 (search) must be merged before starting this phase.

## Task
Apply the banana theme fully, add keyboard shortcuts, refine
empty states, and make the overall experience feel complete.

## Branch
feat/polish

## Scope

### Banana theme pass
Review every page and component. Apply consistently:
- Logo: replace the emoji placeholder with a proper text logo
  styled with the banana-yellow color and a 🍌 emoji mark
  (no custom SVG needed unless you have a simple one)
- Sidebar background: banana-cream
- New Note button: banana-yellow, bold, rounded, hover state
- Active note in list: left accent bar in banana-yellow
- Pinned indicator: warm gold/yellow
- Buttons throughout: consistent styling
- Focus rings: banana-yellow (not the default browser blue)
- Scrollbar: styled (thin, banana-cream track, yellow thumb)

### Empty states
Ensure all empty states use the banana character and
friendly copy:
- No notes at all: "Nothing here yet — go bananas! 🍌"
- No search results: "No notes match that search 🍌"
- (The banana character can be a large emoji or a simple
  ASCII/Unicode banana face — no SVG required)

### Keyboard shortcuts
Verify and implement:
- Cmd/Ctrl+N — create new note (works from anywhere in /dashboard)
- Cmd/Ctrl+F — focus search bar
- Escape — clear search / blur search
- Up/Down arrows in note list — navigate notes (nice to have,
  flag if too complex)

### Loading states
- Note list: skeleton loading state while fetching
- Note editor: subtle loading indicator when navigating to a note
- Save indicator: visible but not distracting

### Responsive
- The layout should not break on a window narrower than 1024px
- Sidebar can collapse or become scrollable — propose approach
- We are not optimizing for mobile (< 768px)

### Favicon and metadata
- Favicon: 🍌 emoji (use emoji favicon technique)
- <title>: "Banana Notes"
- <meta description>: brief description

### Typography
- Set up a consistent type scale in Tailwind
- Note list item titles: medium weight, truncated
- Note body: comfortable reading styles in the editor

## What NOT to do in this phase
- Do not refactor working logic from previous phases
- Do not add new features not listed above
- Do not add dark mode

## Before writing code
1. Confirm branch name
2. Do a pass through the existing components and list
   every specific change you plan to make with the theming
3. Wait for my approval