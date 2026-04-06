# Architecture: Kodukulu

*Last updated: 06 April 2026*

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| UI framework | React 18 + TypeScript | Lovable's native environment; strong ecosystem for component-driven mobile-first UI |
| Build tool | Vite | Fast HMR in dev; minimal config overhead |
| Routing | React Router v6 | Declarative routes; URL-based navigation state (e.g. `?highlight=id`) |
| Data fetching | TanStack Query v5 | Automatic cache invalidation on mutation; loading/error states without boilerplate |
| Backend / DB | Supabase (PostgreSQL) | Managed Postgres with built-in Auth, RLS, and Edge Functions; free tier fits constraints |
| Edge functions | Supabase Edge Functions (Deno) | Used for receipt OCR proxy; keeps API keys off the client |
| AI / OCR | Gemini 2.5 Flash via Lovable AI Gateway | Receipt parsing; invoked server-side through `supabase/functions/parse-receipt` |
| Component library | shadcn/ui + Radix UI | Unstyled accessible primitives; copy-in model means full control over styling |
| Styling | Tailwind CSS v3 | Utility-first; consistent spacing and sizing via design tokens |
| Form state | Controlled `useState` (no RHF on main form) | ExpenseForm is the only complex form; RHF is available but not used — keep it that way unless form complexity grows significantly |
| Hosting | Vercel | Git-push deploy; free tier; edge CDN |
| PWA | Vite + `public/manifest.json` | Android home screen install; no service worker yet (offline not in scope) |

---

## Data Model

### Current schema (production)

#### `expenses`
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | Auto-generated |
| `date` | date | ISO format `YYYY-MM-DD` stored; displayed as `dd.MM.yyyy` |
| `vendor` | text NOT NULL | Free text; autocomplete derived from existing rows |
| `description` | text nullable | Optional; autocomplete derived from existing rows |
| `category` | text NOT NULL | **Currently a hardcoded string** — values from `CATEGORIES` in `src/types/expense.ts` |
| `amount` | numeric NOT NULL | Stored as decimal; displayed with 2 decimal places + `€` |
| `fuel_quantity` | numeric nullable | Litres; only populated when `category = 'Auto'` |
| `created_at` | timestamptz | Auto-set by Supabase |

**Missing:** `user_id`. No RLS. Category is free text with no FK constraint.

---

### Target schema (Iteration 2 migration)

> Items marked **[new]** are new tables. Items marked **[alter]** require a migration on the existing `expenses` table.

#### `expenses` [alter]
Add two columns:
- `user_id` uuid NOT NULL → FK to `auth.users(id)`, CASCADE DELETE
- `category_id` uuid NOT NULL → FK to `categories(id)`, RESTRICT (no orphaned costs)

Remove: the text `category` column (after backfill via migration).

RLS policy: `user_id = auth.uid()` for SELECT, INSERT, UPDATE, DELETE.

#### `categories` [new]
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid NOT NULL FK | → `auth.users(id)`, CASCADE DELETE |
| `name` | text NOT NULL | |
| `sort_order` | integer NOT NULL | Controls display order |

Unique constraint: `(user_id, name)`.

Seeded on account creation with the current hardcoded list: Ehitus, Sisustus, Haljastus, Tööriistad/tarvikud, Majapidamine, Auto.

RLS: `user_id = auth.uid()`.

Deletion rule: if any `expenses.category_id` references this category, the user must reassign all of them first. Enforce with `RESTRICT` FK; the UI handles the reassignment flow before DELETE.

#### `tags` [new]
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid NOT NULL FK | → `auth.users(id)`, CASCADE DELETE |
| `name` | text NOT NULL | |
| `color` | text nullable | Optional hex color for UI badge |

Unique: `(user_id, name)`.

RLS: `user_id = auth.uid()`.

Same deletion pattern as categories: RESTRICT FK; UI requires reassignment.

#### `cost_tags` [new]
| Column | Type | Notes |
|---|---|---|
| `cost_id` | uuid NOT NULL FK | → `expenses(id)`, CASCADE DELETE |
| `tag_id` | uuid NOT NULL FK | → `tags(id)`, RESTRICT |

Composite PK: `(cost_id, tag_id)`.

No `user_id` here — RLS inherited through `cost_id` join. However, Supabase RLS on this table should verify `cost_id` belongs to `auth.uid()` via a subquery or permissive policy using `expenses`.

#### `maintenance_types` [new]
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name` | text NOT NULL | |
| `area` | text | `car`, `house`, `yard`, `systems` |
| `default_interval_months` | integer nullable | For future overdue reminders |

No `user_id` — this is a shared vocabulary table, not user-owned. Starter set seeded at deploy time. RLS: read-only for all authenticated users; write restricted to admin (or no writes from app initially).

> **Decision:** Maintenance types are shared (not per-user) because the vocabulary is stable and small. Per-user customisation is deferred to Iteration 4+.

#### `maintenance_events` [new, Iteration 3]
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid NOT NULL FK | → `auth.users(id)`, CASCADE DELETE |
| `date` | date NOT NULL | |
| `maintenance_type_id` | uuid NOT NULL FK | → `maintenance_types(id)`, RESTRICT |
| `description` | text nullable | |
| `service_provider` | text nullable | |
| `cost_id` | uuid nullable FK | → `expenses(id)`, SET NULL on delete |
| `notes` | text nullable | |
| `created_at` | timestamptz | |

RLS: `user_id = auth.uid()`.

#### `mileage_readings` [new, Iteration 3]
| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `user_id` | uuid NOT NULL FK | → `auth.users(id)`, CASCADE DELETE |
| `date` | date NOT NULL | |
| `odometer_km` | integer NOT NULL | |
| `notes` | text nullable | |

RLS: `user_id = auth.uid()`.

---

### Schema migration plan: text category → FK

The `expenses.category` column is currently a freetext string. The migration to `category_id` FK must happen in one coordinated step:

1. Create the `categories` table.
2. Seed default categories for the existing user.
3. Add `category_id` as nullable FK to `expenses`.
4. Run a backfill: `UPDATE expenses SET category_id = (SELECT id FROM categories WHERE name = expenses.category)`.
5. Set `category_id` NOT NULL.
6. Drop the text `category` column.
7. Update `src/integrations/supabase/types.ts` to reflect the new schema.
8. Update all TypeScript references (`CATEGORIES` constant, `ExpenseForm`, `History` filters, `Summary` aggregation).

This is a breaking migration and must be done in a single deploy window, not incrementally.

---

## Navigation & Routing

Current routes:

| Path | Page | Description |
|---|---|---|
| `/` | `AddExpense` | Lisa kulu — expense entry form |
| `/history` | `History` | Ajalugu — browse, search, filter, sort |
| `/history?highlight=<id>` | `History` | Ajalugu with new entry highlighted + scrolled into view |
| `/summary` | `Summary` | Kokkuvõte — category (+ upcoming vendor) breakdown |
| `*` | `NotFound` | 404 |

Planned additions (Iteration 2+):

| Path | Page | Description |
|---|---|---|
| `/maintenance` | `Maintenance` | Hoolduspäevik — maintenance diary |
| `/settings` | `Settings` | Seaded — category, tag, account management |
| `/settings/categories` | `CategorySettings` | Manage categories with reassignment flow |
| `/settings/tags` | `TagSettings` | Manage tags with reassignment flow |

Bottom nav currently has 3 tabs: Lisa kulu, Ajalugu, Kokkuvõte. Will grow to 4 tabs in Iteration 3 (add Hoolduspäevik). Settings accessible via a gear icon in the header — not a bottom tab.

---

## Component Structure

```
src/
  pages/           # One file per route. No business logic — delegate to hooks.
  components/      # Shared UI components.
    ui/            # shadcn/ui generated components. Do not modify directly.
    ExpenseForm    # The expense entry/edit form. Reused in AddExpense and History (edit modal).
    BottomNav      # Fixed bottom navigation bar.
    CategoryBadge  # Coloured pill showing category name.
    AutocompleteInput # Controlled input with dropdown suggestions.
  hooks/           # Data access and business logic.
    useExpenses    # CRUD + CSV export. All Supabase calls for expenses live here.
    useAutocompleteSuggestions # Vendor and description suggestions from existing data.
    useReceiptParser # Calls the parse-receipt edge function.
  integrations/
    supabase/
      client.ts    # Supabase client singleton. Reads env vars. Do not instantiate elsewhere.
      types.ts     # Auto-generated from Supabase schema. Regenerate after schema changes.
  types/
    expense.ts     # Expense type (derived from Supabase types) + CATEGORIES constant.
  lib/
    utils.ts       # cn() utility for Tailwind class merging.
```

**Conventions:**
- Pages own only layout and local UI state (modals, selected filters). They call hooks for data.
- All Supabase queries go through hooks in `src/hooks/`. Pages do not import `supabase` directly.
- Hooks return TanStack Query results (`useQuery`, `useMutation`). Mutation success handlers call `queryClient.invalidateQueries` to keep the cache fresh.
- When a new data entity is added (tags, categories, maintenance), create a dedicated hook file: `useTags.ts`, `useCategories.ts`, etc.
- `src/types/expense.ts` will be refactored in Iteration 2 as `CATEGORIES` moves from a hardcoded constant to a DB-derived list.

---

## Styling Conventions

- Tailwind utility classes only. No custom CSS files.
- Design tokens (colours, radius, spacing) are set in `tailwind.config.ts` and consumed via CSS variables in `globals.css`. Do not hardcode hex colours.
- All interactive elements: minimum touch target `h-11` (44px) or `h-12` (48px). Form submit buttons use `h-14`.
- Page layout: `mx-auto max-w-lg px-4 pb-24 pt-6`. The `pb-24` clears the fixed bottom nav.
- Destructive actions (delete): use `text-destructive` / `bg-destructive` colour tokens, never ad-hoc red.
- Category badge colours: defined in `CategoryBadge.tsx` as a static map. When categories become dynamic (Iteration 2), the colour map must be driven from `categories.color` or a default assignment algorithm.

---

## Auth Strategy

**Current:** No auth. Single user, anonymous access to Supabase with `anon` key.

**Iteration 2 target:** Supabase Auth with email/password.

Implementation plan:
1. Enable Supabase Auth in the project dashboard.
2. Add `AuthProvider` wrapping `App.tsx` using `@supabase/auth-helpers-react` or the built-in `supabase.auth` listener.
3. Add a login page (`/login`). Unauthenticated users redirect here from all other routes.
4. Add `user_id` to all data tables and enable RLS policies (see Data Model above).
5. `supabase/client.ts` already configures `persistSession: true` and `autoRefreshToken: true` — no changes needed there.

No OAuth providers, no magic link, no social login in scope. Email/password only until G-05 drives a reason to expand.

---

## Deployment Topology

**Current:** Single Supabase project, single Vercel deployment. No environment separation.

**Iteration 2 target (I-02):**

| Environment | Supabase project | Vercel deployment | When used |
|---|---|---|---|
| Development | `kodukulu-dev` | Lovable preview / `vercel --env dev` | Local dev and Lovable AI builds |
| Production | `kodukulu-prod` | `kodukulu.vercel.app` (or custom domain) | Live app |

Environment variables required per deployment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

These are set in Vercel's environment variable UI (not committed to the repo). The `supabase/functions/parse-receipt` function reads its own env vars server-side (Gemini API key never exposed to the browser).

---

## S-02: Vendor Breakdown in Kokkuvõte (next feature)

**What to build:** Add a category filter to the Summary page. When a category is selected, display a vendor subtable showing each vendor's count and total within that category + year selection.

**Data:** No new Supabase queries or schema changes needed. The existing `useExpenses` hook already fetches all expenses for the selected year. The vendor breakdown is a client-side `reduce` over the filtered array — same pattern as the existing category totals.

**Implementation sketch:**
- Add `category` state to `Summary.tsx` (mirrors the pattern in `History.tsx`).
- When a category is selected: filter `expenses` to that category, group by `vendor`, compute `{ count, total }` per vendor, sort descending by total.
- Render a second table below the category summary table, visible only when a category is selected.
- Keep the grand total row in the category table always visible.

**No architectural changes required for this feature.**

---

## Non-Negotiable Rules

These rules apply to every feature, in every iteration. Lovable (or any developer) must not deviate from them without explicit override.

1. **Every data table must have `user_id`** — uuid FK to `auth.users(id)`, with CASCADE DELETE.
2. **Every data table must have an RLS policy** — enabling SELECT/INSERT/UPDATE/DELETE only for the row's owner (`user_id = auth.uid()`). No policy = no access.
3. **`supabase` client is only imported from `src/integrations/supabase/client.ts`** — never instantiated inline in components or pages.
4. **All Supabase queries live in hooks** — pages do not call `supabase` directly.
5. **Deletion of categories, tags, and maintenance types requires prior reassignment** — FK is set to RESTRICT; the UI enforces the reassignment flow. Hard deletes only; no soft deletes.
6. **Two Supabase projects** (dev + prod) from Iteration 2 onward — test data must never appear in production.
7. **No secrets in the repository** — Supabase keys and API keys go in Vercel environment variables or Supabase Edge Function secrets only.
8. **`src/integrations/supabase/types.ts` must be regenerated after every schema change** — stale types cause silent runtime errors.
9. **Estonian language throughout the UI** — all labels, placeholders, error messages, empty states.
10. **All buttons and inputs: minimum 44px touch target** — enforce via Tailwind `h-11` / `h-12` minimum.
