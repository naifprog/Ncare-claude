# Ncare Dashboard

Salon management dashboard UI, built from the Figma design at
`Ncare-Dashboard` (file key `MayyXiGQdyLPLj3lcama5C`). The current phase is
**frontend + mock data**: all three dashboard contexts (single salon,
multi-branch owner, Ncare super admin) with demo sign-in and a
permission-aware UI — no backend, database, or real authentication yet.

## Stack

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS v4** (CSS-first theme in `src/app/globals.css`, tokens
  extracted from the Figma file: colors, radii, shadows)
- **Iconify (`@iconify/react` + `@iconify-json/solar`)** — icons are
  rendered to inline SVG on the server (`src/components/ui/Icon.tsx`),
  no runtime icon fetching. The Solar set is used as a close visual
  match for the "vuesax" icons used in the design.
- **Recharts** — charts of the Super Admin dashboard and accounting
  summary.

## What's implemented

The sections below describe the single-salon screens; the multi-branch
owner (`/main`, designs 26–47) and super admin (`/admin`, designs 49–91)
dashboards follow the same patterns. Figma screen 71 (mobile customer app)
is out of scope; screens 28 and 50 are absent from the design source.

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
- **Add / Edit request** (`/requests/add`, `/requests/[id]/edit`) and
  **Request details** (`/requests/[id]`) — status-specific actions
  (Accept/Reject, Pending + Edit/Delete, Completed, Incompleted), special
  requests show the customer address, "Print bill".
- **Workers** (`/workers`) — search, Nationality/Position filters, earnings
  sort; **Add/Edit worker** and **Worker profile** with the "Important
  documents" list and add-document state.
- **Services** (`/services`) — search, Category filter; **Add/Edit
  service** and **Service details**.
- **Salon Settings** — profile with work time + ratings and an edit mode
  (`/settings`), **Change password** (`/settings/password`).

Sidebar sections have the submenus from the design. Saves/deletes are local
UI state only (no backend yet).

Mock data lives in `src/lib/mock-data.ts` (single salon),
`src/lib/mock-main.ts` (multi-branch owner) and `src/lib/mock-admin.ts`
(super admin); users are in `src/lib/access/directory.ts`.

## Demo access (DEMO ONLY)

Sign in at `/login` or `/admin/login` (either screen accepts every demo
account and opens that account's dashboard). This is **not authentication**:
the credentials are hard-coded mock accounts and the "session" is only the
demo user id kept in the browser's localStorage.

| Username     | Password   | Opens                                   | Demonstrates |
|--------------|------------|-----------------------------------------|--------------|
| `salon`      | `ncare123` | Single salon dashboard (`/`)            | Full salon manager |
| `owner`      | `ncare123` | Multi-branch owner dashboard (`/main`)  | All branches, branch powers, positions |
| `admin`      | `ncare123` | Super admin dashboard (`/admin`)        | Everything, incl. users & powers |
| `manager`    | `ncare123` | `/main`, branches 1–2 only              | Branch manager (restricted, multi-branch) |
| `accountant` | `ncare123` | `/admin`, accounting + reports only     | Custom "Accountant" account type |
| `reception`  | `ncare123` | `/`, requests + read-only lists         | Receptionist (restricted staff) |

"Log out" (sidebar) returns to the login screen of that context, so
`salon → owner → admin` can be tried without editing URLs.

## Access model (frontend only)

The UI hides what a user may not use; **it does not secure anything**. The
same model is meant to be enforced by the backend later.

- **Dashboard context** (`salon` / `main` / `admin`) only sets which dashboard
  a user signs into (`src/lib/roles.ts`).
- **Permissions** are string keys (`requests.edit`, `accounting.bills`, …)
  grouped in `src/lib/access/permissions.ts`.
- **Presets** (roles such as Branch manager, Accountant, Receptionist) are
  permission bundles. **Account types** and **positions** point at a preset;
  a user may also have their own preset or individual permissions.
  Resolution order: individual → user preset → position → account type.
- **Branch access**: `branchIds` is a list of branch ids or `"all"`. A branch
  keeps `managerIds` (zero, one or many managers).
- **Branch powers** (Main → Powers) cap what branch-limited staff may do in
  that branch; owners with all branches are not capped.
- `src/lib/access/access.ts` resolves users, checks permissions
  (`hasPermission`, optionally per branch), maps routes to permissions
  (`canAccessPath`) and filters navigation (`navFor`).
  `src/components/auth/AccessProvider.tsx` exposes it to components
  (`useAccess().can(...)`), redirects signed-out users and shows "No access"
  for pages outside a user's permissions.

Edits made on the Powers / Positions / Users screens apply to the current
browser session only (in memory) so their effect can be tried by signing in
as the edited user; a page reload resets them. Created / edited / deleted
records are likewise not persisted.

## Exports and print

- **Excel (CSV)** downloads a real `.csv` file.
- **Print / PDF** opens the browser print dialog; choose "Save as PDF".
- **Word (HTML)** downloads an HTML table with a `.doc` extension (an
  approximation that Word opens, not a native `.docx`).
- Reports (Super Admin → Reports) are generated from the mock data; bills
  are generated from the bill row and can be printed or saved as `.html`.
- Worker documents from the mock data have no file behind them (no storage
  in this phase); documents uploaded in the session can be viewed and
  downloaded until reload.

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
