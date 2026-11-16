# Architecture: Kodukulu

*Last updated: 14 June 2026*

## Contents

- [Tech Stack](#tech-stack)
- [Data Model](#data-model)
- [RLS Strategy](#rls-strategy)
- [Navigation and Routing](#navigation-and-routing)
- [Component Structure](#component-structure)
- [Coding Conventions](#coding-conventions)
- [Styling Conventions](#styling-conventions)
- [Auth Strategy](#auth-strategy)
- [Deployment Topology](#deployment-topology)
- [Performance Constraints](#performance-constraints)
- [Testing Conventions](#testing-conventions)
- [Non-Negotiable Rules](#non-negotiable-rules)

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| UI framework | React 18 + TypeScript | Strong ecosystem for component-driven mobile-first UI; compatible with Cursor and Lovable |
| Build tool | Vite | Fast HMR in dev; minimal config overhead |
| Routing | React Router v6 | Declarative routes; URL-based navigation state (e.g. `?highlight=id`) |
| Data fetching | TanStack Query v5 | Automatic cache invalidation on mutation; loading/error states without boilerplate |
| Backend / DB | Supabase (PostgreSQL) | Managed Postgres with built-in Auth, RLS, and Edge Functions; free tier fits constraints |
| Edge functions | Supabase Edge Functions (Deno) | Receipt OCR proxy; keeps Gemini API key off the client |
| AI / OCR | Gemini 3.8 Flash via direct API | Receipt parsing; called server-side through `supabase/functions/parse-receipt`; opt-in only |
| Auth | Supabase Auth | Email/password and Google OAuth; session persistence and token refresh built in |
| Component library | shadcn/ui + Radix UI | Unstyled accessible primitives; copy-in model means full control over styling |
| Styling | Tailwind CSS v3 | Utility-first; consistent spacing and sizing via design tokens |
| Form state | Controlled `useState` | ExpenseForm is the only complex form; avoid React Hook Form unless complexity grows significantly |
| Hosting | Vercel | Git-push deploy; free tier; edge CDN; preview deployments per branch |
| PWA | Vite + `public/manifest.json` | Android home screen install; no service worker (offline not in scope) |

---

## Data Model

All tables are built into a clean final schema. There is no migration from a previous schema.

### `households`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | Auto-generated |
| `created_at` | timestamptz | Auto-set |

One row per household instance. Created automatically on first user signup.

### `household_members`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `household_id` | uuid NOT NULL FK | → `households(id)`, CASCADE DELETE |
| `user_id` | uuid NOT NULL FK | → `auth.users(id)`, CASCADE DELETE |
| `role` | text NOT NULL | `admin` or `member` |
| `invited_by` | uuid nullable FK | → `auth.users(id)`, SET NULL |
| `joined_at` | timestamptz | Auto-set |

Unique constraint: `(household_id, user_id)`.

RLS: members can read all members of their own household. Only admins can insert or delete members.

### `categories`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `household_id` | uuid NOT NULL FK | → `households(id)`, CASCADE DELETE |
| `name` | text NOT NULL | |
| `sort_order` | integer NOT NULL | Controls display order |

Unique constraint: `(household_id, name)`.

Seeded on household creation: Ehitus, Sisustus, Haljastus, Tööriistad/tarvikud, Majapidamine, Auto.

Deletion rule: RESTRICT FK on `expenses.category_id`. UI enforces reassignment before DELETE.

### `expenses`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | Auto-generated |
| `household_id` | uuid NOT NULL FK | → `households(id)`, CASCADE DELETE |
| `user_id` | uuid NOT NULL FK | → `auth.users(id)`, SET NULL on user delete — preserves record |
| `date` | date NOT NULL | Stored as `YYYY-MM-DD`; displayed as `dd.MM.yyyy` |
| `vendor` | text NOT NULL | Free text; autocomplete from household's existing rows |
| `description` | text nullable | Free text; autocomplete from household's existing rows |
| `category_id` | uuid NOT NULL FK | → `categories(id)`, RESTRICT |
| `amount` | numeric(10,2) NOT NULL | Displayed with 2 decimal places + `€` |
| `fuel_quantity` | numeric(6,2) nullable | Litres; only populated when category is Auto |
| `created_at` | timestamptz | Auto-set |
| `updated_at` | timestamptz | Updated via trigger on every UPDATE |

### `tags`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `household_id` | uuid NOT NULL FK | → `households(id)`, CASCADE DELETE |
| `name` | text NOT NULL | |
| `color` | text nullable | Optional hex colour for UI badge |

Unique constraint: `(household_id, name)`.

Deletion rule: RESTRICT FK on `cost_tags.tag_id`. UI enforces reassignment before DELETE.

### `cost_tags`

| Column | Type | Notes |
|---|---|---|
| `cost_id` | uuid NOT NULL FK | → `expenses(id)`, CASCADE DELETE |
| `tag_id` | uuid NOT NULL FK | → `tags(id)`, RESTRICT |

Composite PK: `(cost_id, tag_id)`. No `household_id` — access controlled via join to `expenses`.

### `maintenance_types`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `name` | text NOT NULL UNIQUE | |
| `area` | text nullable | `car`, `house`, `yard`, `systems` |
| `default_interval_months` | integer nullable | For overdue reminders (M-06) |

Shared vocabulary table — no `household_id`. Seeded at deploy time. Read-only for all authenticated users from the app. Starter set: Auto hooldus, Auto rehvivahetus, Kanalisatsiooni tühjendamine, Ventilatsiooni filter.

> Households can add custom maintenance types in Seaded (P2). These will also live in this table with a nullable `household_id` to distinguish shared from custom types, to be implemented in M-05.

### `maintenance_events`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `household_id` | uuid NOT NULL FK | → `households(id)`, CASCADE DELETE |
| `user_id` | uuid NOT NULL FK | → `auth.users(id)`, SET NULL on user delete |
| `date` | date NOT NULL | |
| `maintenance_type_id` | uuid NOT NULL FK | → `maintenance_types(id)`, RESTRICT |
| `description` | text nullable | |
| `service_provider` | text nullable | |
| `cost_id` | uuid nullable FK | → `expenses(id)`, SET NULL on delete |
| `notes` | text nullable | |
| `created_at` | timestamptz | Auto-set |

### `mileage_readings`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `household_id` | uuid NOT NULL FK | → `households(id)`, CASCADE DELETE |
| `user_id` | uuid NOT NULL FK | → `auth.users(id)`, SET NULL on user delete |
| `date` | date NOT NULL | |
| `odometer_km` | integer NOT NULL | Must be positive |
| `notes` | text nullable | |

### `cost_audit_log`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid PK | |
| `cost_id` | uuid NOT NULL | Not a FK — record must survive expense deletion |
| `household_id` | uuid NOT NULL | For RLS scoping; not a FK for same reason |
| `operation` | text NOT NULL | `update` or `delete` |
| `user_id` | uuid nullable | Who made the change; nullable in case user is later deleted |
| `changed_at` | timestamptz NOT NULL | Auto-set |
| `old_values` | jsonb NOT NULL | Full row snapshot before change |
| `new_values` | jsonb nullable | Full row snapshot after change; null for deletes |

Populated by a Postgres trigger on `expenses` for UPDATE and DELETE operations. No `household_id` FK — intentional, so audit records survive household deletion for compliance.

RLS: household members can SELECT their own household's audit records. No INSERT, UPDATE, or DELETE permitted from the application layer.

---

## RLS Strategy

All data tables are scoped to a household. The RLS check pattern across all data tables is:

```sql
household_id IN (
  SELECT household_id FROM household_members
  WHERE user_id = auth.uid()
)
```

This applies to SELECT, INSERT, UPDATE, and DELETE on: `categories`, `expenses`, `tags`, `maintenance_events`, `mileage_readings`, `cost_audit_log`.

For `cost_tags`, which has no `household_id` column:

```sql
cost_id IN (
  SELECT id FROM expenses
  WHERE household_id IN (
    SELECT household_id FROM household_members WHERE user_id = auth.uid()
  )
)
```

For `household_members`:
- SELECT: `household_id IN (SELECT household_id FROM household_members WHERE user_id = auth.uid())`
- INSERT/DELETE: additionally require `role = 'admin'` for the acting user

For `maintenance_types`: SELECT for all authenticated users. No INSERT/UPDATE/DELETE from app layer.

**No table is left without an RLS policy. An absent policy means no access.**

---

## Navigation and Routing

| Path | Page | Description |
|---|---|---|
| `/login` | `Login` | Auth screen — email/password + Google OAuth |
| `/` | `AddExpense` | Lisa kulu — expense entry form |
| `/history` | `History` | Ajalugu — browse, search, filter, sort |
| `/history?highlight=<id>` | `History` | Ajalugu with new entry highlighted and scrolled into view |
| `/summary` | `Summary` | Kokkuvõte — category and vendor breakdown, drill-down |
| `/maintenance` | `Maintenance` | Hoolduspäevik — maintenance diary (P3) |
| `/settings` | `Settings` | Seaded — categories, tags, members, receipt import toggle |
| `/settings/categories` | `CategorySettings` | Manage categories with reassignment flow |
| `/settings/tags` | `TagSettings` | Manage tags with reassignment flow |
| `/settings/members` | `MemberSettings` | Invite and remove household members (P2) |
| `*` | `NotFound` | 404 |

Unauthenticated users are redirected to `/login` from all routes except `/login` itself.

**Bottom navigation tabs:** Lisa kulu, Ajalugu, Kokkuvõte. Hoolduspäevik added as fourth tab in P2. Settings accessible via gear icon in the header — never a bottom tab.

---

## Component Structure

```
src/
  pages/              # One file per route. No business logic — delegate to hooks.
  components/
    ui/               # shadcn/ui generated components. Do not modify directly.
    ExpenseForm/      # Expense entry and edit form. Used in AddExpense and History modal.
    BottomNav/        # Fixed bottom navigation bar.
    CategoryBadge/    # Coloured pill showing category name.
    AutocompleteInput/ # Controlled input with dropdown suggestions.
    FilterPanel/      # Collapsible multi-dimension filter panel for Ajalugu.
    ConfirmDialog/    # Reusable confirmation dialog for destructive actions.
    ReassignDialog/   # Reusable reassignment flow for category/tag/maintenance type deletion.
  hooks/
    useAuth           # Auth state, login, logout, session.
    useHousehold      # Household and member data.
    useExpenses       # CRUD, CSV export, autocomplete suggestions.
    useCategories     # Category CRUD.
    useTags           # Tag CRUD.
    useMaintenanceTypes  # Read maintenance types vocabulary.
    useMaintenanceEvents # Maintenance event CRUD.
    useMileageReadings   # Mileage reading CRUD.
    useReceiptParser  # Calls the parse-receipt Edge Function.
  integrations/
    supabase/
      client.ts       # Supabase client singleton. Reads env vars. Never instantiate elsewhere.
      types.ts        # Auto-generated from Supabase schema. Regenerate after every schema change.
  types/
    index.ts          # Shared TypeScript types derived from Supabase-generated types.
  lib/
    utils.ts          # cn() utility for Tailwind class merging.
```

**Conventions:**
- Pages own layout and local UI state only. All data comes from hooks.
- All Supabase queries live in `src/hooks/`. One hook file per data entity.
- Hooks return TanStack Query results. Mutation success handlers call `queryClient.invalidateQueries`.
- `src/integrations/supabase/types.ts` is auto-generated — regenerate after every schema change. Do not hand-edit it.

---

## Coding Conventions

### State management

Two types of state. Do not blur the boundary between them.

**Server state** — data from Supabase. Lives in TanStack Query (`useQuery`, `useMutation`). Never duplicated in React state. Mutations call `queryClient.invalidateQueries` on success.

**Local UI state** — modal open/closed, filter values, form fields. Lives in `useState` in the page or component that owns it.

No global client state manager. No Zustand, no Redux, no React Context for data. If you reach for a global store, stop and reconsider the component structure.

### Philosophy

Prefer simple, readable code over clever code. If a solution needs a comment to explain what it does, the code is probably wrong.

- Solve the problem directly. No abstraction layers until there is a demonstrated need.
- Do not install a library to solve a problem that is ten lines of code.
- Do not over-fetch. Select only the columns the UI needs.
- Error handling is not optional. Every async operation must have an error state with a message in Estonian.
- No dead code. No commented-out blocks. No TODO comments left in committed files.
- When in doubt about structure, follow the pattern of the nearest existing similar feature.

### Conventions

- Pages own layout and local UI state only. All data comes from hooks.
- Never import `supabase` directly in pages or components — use hooks.
- Never instantiate a second Supabase client — use `src/integrations/supabase/client.ts` only.
- One hook file per data entity. Never mix unrelated entities.
- Mutation success handlers must call `queryClient.invalidateQueries` with the relevant query key.
- `updated_at` on `expenses` is maintained by a Postgres trigger — never set it in application code.

### Incremental implementation

Build and verify one layer before moving to the next.

1. Apply schema migration → verify in Supabase dashboard before writing any code
2. Regenerate types → fix any TypeScript errors before proceeding
3. Write the hook → verify the query returns expected data in the browser before writing UI
4. Write the component → verify it renders correctly before wiring to state
5. Wire state → verify the full flow works end to end
6. Handle error and empty states → verify each one explicitly

---

## Styling Conventions

- Tailwind utility classes only. No custom CSS files.
- Design tokens (colours, radius, spacing) defined in `tailwind.config.ts` and consumed via CSS variables in `globals.css`. Never hardcode hex colours.
- All interactive elements: minimum touch target `h-11` (44px). Form submit buttons use `h-14`.
- Page layout: `mx-auto max-w-lg px-4 pb-24 pt-6`. The `pb-24` clears the fixed bottom nav.
- Destructive actions: use `text-destructive` / `bg-destructive` colour tokens exclusively.
- Category badge colours: driven by a colour assignment algorithm or `categories.color` field — never a hardcoded static map.

---

## Auth Strategy

Supabase Auth with two providers from day one:
- Email and password
- Google OAuth

**Signup flow:**
1. User creates account (email/password or Google)
2. A `households` row is created automatically via a Postgres trigger on `auth.users` INSERT
3. The new user is inserted into `household_members` as `admin`
4. Default categories are seeded into `categories` for the new household
5. User lands on Lisa kulu (main app)

**Login flow:** Standard Supabase Auth. Session persisted in localStorage. Token auto-refreshed.

**Route protection:** An `AuthGuard` component wraps all routes except `/login`. Unauthenticated users are redirected to `/login`. After login, users are redirected to `/`.

**Supabase client configuration:**
```ts
createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})
```

**Google OAuth setup:** Requires a Google Cloud OAuth app with the Supabase callback URL whitelisted. Configured in Supabase dashboard → Authentication → Providers. Credentials never enter the codebase.

---

## Deployment Topology

Two Supabase projects and two deployment environments from day one.

| Environment | Supabase project | Vercel target | When used |
|---|---|---|---|
| Development | `kodukulu-dev` | Preview deployments (per branch) | Local dev, feature branches |
| Production | `kodukulu-prod` | Production deployment (main branch) | Live app |

**Environment variables** (never committed to the repo):

For local development — `.env.local`:
```
VITE_SUPABASE_URL=https://<dev-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<dev-anon-key>
```

For Vercel — set in project dashboard per environment:
- Production: prod Supabase URL and anon key
- Preview: dev Supabase URL and anon key

**Edge Function secrets** (set via Supabase dashboard, not Vercel):
```
GEMINI_API_KEY=<key>
```

The Gemini API key is never exposed to the browser. It lives only in the Edge Function runtime.

---

## Performance Constraints

These constraints apply from the first iteration. Do not defer them as "optimisation to do later."

- **Expense list pagination** — never load all expenses in a single query. Paginate after 100 rows. Use Supabase `.range()` for cursor-based pagination.
- **Route lazy loading** — all page components are imported via React Router's `lazy()` + `Suspense`. No page component is eagerly imported in the router definition.
- **TanStack Query stale times** — set per query type, not left at default:
  - `categories`, `tags`, `maintenance_types`: `staleTime: 5 * 60 * 1000` (5 minutes — these change rarely)
  - `expenses`, `maintenance_events`, `mileage_readings`: `staleTime: 30 * 1000` (30 seconds — these change often)
  - `household_members`: `staleTime: 60 * 1000` (1 minute)
- **No N+1 queries** — do not issue Supabase queries inside loops or inside component render cycles. Fetch all needed data in one query using joins or separate parallel `useQuery` calls.
- **Select only needed columns** — use `.select('id, date, vendor, amount, category_id')` rather than `.select('*')` where the full row is not needed.
- **No premature memoisation** — do not add `useMemo` or `useCallback` without a demonstrated render performance problem. Add when needed, not by default.

---

## Testing Conventions

Framework: Playwright (E2E only — no unit tests).

**File location:** `tests/` at the repo root. One file per feature ID: `tests/e01-add-expense.spec.ts`.

**Test naming:** Test names must map directly to Gherkin scenario titles:
```ts
test('Happy path — save a basic expense', async ({ page }) => { ... })
test('Save fails when required fields are missing', async ({ page }) => { ... })
```

**Base URL:** Set in `playwright.config.ts` as `http://localhost:5173` (Vite dev server).

**Authentication:** Use Playwright's `storageState` to persist a logged-in session across tests. A `tests/global-setup.ts` file handles login once before the suite runs and writes auth state to `tests/.auth/user.json`. Individual test files load this state via `use: { storageState }` in the config.

**Minimum coverage per ticket:** Happy path + one error or destructive flow. The implementing session writes these as the final step of every implementation plan. QA Mode 2 adds gap coverage after implementation if scenarios remain untested.

**Test data:** Tests use the dev Supabase project. Each test is responsible for setting up the data it needs and should not rely on state left by other tests.

---

## Non-Negotiable Rules

These rules apply to every feature in every iteration. Do not deviate without explicit instruction.

1. **Every user-facing data table must have `household_id`** — uuid FK to `households(id)`, CASCADE DELETE. This is the RLS scope unit.

2. **Every data table must have an RLS policy** — using the household membership check pattern defined in the RLS Strategy section. No policy = no access. No exceptions.

3. **`supabase` client is imported only from `src/integrations/supabase/client.ts`** — never instantiated inline in components, pages, or hooks.

4. **All Supabase queries live in hooks** — pages and components never call `supabase` directly.

5. **Deletion of categories, tags, and maintenance types requires prior reassignment** — FK is RESTRICT; the UI must complete the reassignment flow before the DELETE is issued. Hard deletes only. No soft deletes anywhere.

6. **Two Supabase projects always** — dev and prod. Test data must never reach the production database.

7. **No secrets in the repository** — Supabase keys go in Vercel environment variables. Gemini API key goes in Supabase Edge Function secrets. `.env.local` is gitignored.

8. **`src/integrations/supabase/types.ts` must be regenerated after every schema change** — run `supabase gen types typescript --project-id <id> > src/integrations/supabase/types.ts`. Stale types cause silent runtime errors.

9. **Estonian language throughout the UI** — all labels, placeholders, validation errors, empty states, confirmation dialogs, and toast messages must be in Estonian.

10. **Minimum 44px touch target on all interactive elements** — enforce via Tailwind `h-11` or `h-12`. Form submit buttons use `h-14`. Destructive and non-destructive actions must never be within the same fingertip reach.

11. **Receipt import is opt-in** — the Gemini Edge Function must only be callable when the user has enabled receipt import in Seaded. The upload button must not render when the setting is off.

12. **`updated_at` on `expenses`** — maintained by a Postgres trigger. Never set manually in application code.
