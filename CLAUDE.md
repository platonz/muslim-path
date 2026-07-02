# Muslims Path — Standing Instructions

## Design Tokens (use these exact values, always)
```
BG       = "#F9F8F6"   // page background
SURFACE  = "#FFFFFF"   // card background
BORDER   = "#E5E7EB"
GREEN    = "#2D6A4F"   // primary accent
GREEN_L  = "#EAF4EE"   // green tint / highlights
GOLD     = "#B45309"   // secondary accent
TEXT     = "#111827"
MUTED    = "#6B7280"
```

## Code Patterns
- Define palette constants at the top of the file, same block as above
- Use inline styles with those constants — no CSS classes, no Tailwind
- Reuse the shared primitives already in the file: `Card`, `PageTitle`, `Input`, `Select`, `Btn`
- New components go as named functions in MuslimsPath.jsx (not separate files, not inline in App)

## Component Style Rules
- Cards use `<Card>` wrapper — never raw `<div>` with manual card styles
- Page headers use `<PageTitle icon=... title=... sub=... />`
- Buttons use `<Btn>` — variant "primary" (green fill) or "outline" (bordered)
- Inputs use `<Input label=... />` and `<Select label=... options=... />`
- Border radius: 10–12px for cards, 8px for inputs/buttons
- Font: inherit (Inter from parent) — no font overrides unless Arabic text (use Amiri)

## Arabic Text
- Always set `dir="rtl"` and `fontFamily: "Amiri, serif"` on Arabic text elements
- Arabic font size should be ~1.15–1.25× the surrounding Latin text

## Nav & Routing
- Page routing is controlled by `page` state in `src/App.jsx` via `navigate(pageId)`; slugs are mapped in `src/lib/routing.js` (`VALID_PAGES`, `slugToPage`, `pageToUrl`)
- Currently active pages: home, quran, dua, asma, tasbeeh, namaz, howpray, library, audio, zakat, inheritance, calendar, dates, profile, admin
- The real 12-book catalogue (id, title, icon, per-book gradient colors) lives in `SHELVES` in `src/components/LibraryRoom.jsx` — reuse it, don't duplicate it, when any new UI needs to list/link the app's features
- Every non-home page is wrapped in `<main>` with the sticky `BookHeader` (also in `LibraryRoom.jsx`) for back/title/search chrome

## Home Dashboard (Nur Al-Ilm)
- Home (`page === "home"`) renders `src/components/NurDashboard.jsx` — a sidebar dashboard, not the old door/bookshelf metaphor (removed)
- This page intentionally uses its **own** token and font system, scoped via CSS custom properties on its root div (`src/styles/nur-dashboard.css` holds only keyframes + real `:hover` states; the palette itself lives inline in `NurDashboard.jsx`) — fonts: `Bricolage Grotesque` (display), `Hanken Grotesk` (body), `Space Mono` (numerals/kbd), plus `Amiri` for Arabic
- This is a deliberate exception — the global `BG/SURFACE/GREEN/GOLD/TEXT/MUTED/SERIF/SANS` constants above are unchanged and still govern every other page; do not migrate other pages to the dashboard's tokens without being asked
- All nav items, quick-tool links, and feature cards on this page must map to real routes via `SHELVES`/`navigate()` — no fabricated content (progress %, streaks, AI Q&A, etc.)

## Skills — when to use them on this project
- `/diagnose` — prayer time calculation wrong, Qibla direction off, or any logic bug
- `/prototype` — testing a new screen layout before building it properly
- `/zoom-out` — when MuslimsPath.jsx gets hard to navigate (it's one big file)
- `/improve-codebase-architecture` — when ready to extract inline pages into separate components
- `/simplify` — after adding a new section or screen

## What NOT to do
- Do not introduce new dependencies without asking
- Do not add TypeScript, CSS modules, or Tailwind
- Do not split into multiple files unless explicitly asked
- Do not add comments explaining what the code does — only add one if the WHY is non-obvious
