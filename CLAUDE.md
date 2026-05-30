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
- Page routing is controlled by `page` state in the root component via `setPage()`
- Nav items are defined in `NAV_ITEMS` array — add new pages there
- Currently active pages: home, prayer, qibla, zakat, inheritance, dateconverter, library

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
