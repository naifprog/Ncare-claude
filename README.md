# Ncare Dashboard

Salon management dashboard UI, built from the Figma design at
`Ncare-Dashboard` (file key `MayyXiGQdyLPLj3lcama5C`). This first phase
implements the salon-manager role's core screens with mock data — no
backend, database, or real authentication yet.

## Stack

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS v4** (CSS-first theme in `src/app/globals.css`, tokens
  extracted from the Figma file: colors, radii, shadows)
- **Iconify (`@iconify/react` + `@iconify-json/solar`)** — icons are
  rendered to inline SVG on the server (`src/components/ui/Icon.tsx`),
  no runtime icon fetching. The Solar set is used as a close visual
  match for the "vuesax" icons used in the design.
- **Recharts** — installed and ready for the Accounting/Reports screens
  in a later phase; not used yet since the current screens have no
  charts in the source design.

## What's implemented

- **Sidebar** — brand mark, nav items with active state, expandable
  "Requests" submenu, log out action. Collapses to an off-canvas drawer
  below the `lg` breakpoint.
- **Header** — page title, notifications popover, messages popover,
  user menu, mobile menu toggle.
- **Dashboard** (`/`) — stat cards, "Workers sort by most earnings",
  "Most requested services", and the "New requests" side panel with
  working Accept/Reject state per card.
- **Requests** (`/requests`) — toolbar (search, date range, "New
  request"), 4 tabs (New / Pending / Completed / Incomplete) each with
  their own accent color, a data table with per-status row actions, and
  pagination.
- **Workers / Services / Salon Settings** — placeholder shells (sidebar
  + header already wired) for the next build phase.

All data comes from `src/lib/mock-data.ts`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # eslint
```
