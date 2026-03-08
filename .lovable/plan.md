

# Kodukulu — Implementation Plan

The app hasn't been built yet (only boilerplate exists). The key clarification: **database/backend uses English naming**, **UI displays Estonian text**.

## Database (Supabase via Lovable Cloud)

**Table: `expenses`** (English column names)
- `id` (uuid, PK)
- `date` (date, default today)
- `vendor` (text)
- `description` (text)
- `category` (text — one of: Ehitus, Sisustus, Haljastus, Tööriistad/tarvikud, Majapidamine, Auto)
- `amount` (numeric)
- `fuel_quantity` (float, nullable — only for Auto)
- `created_at` (timestamptz, default now)

RLS disabled (no auth).

## File Structure

```
src/
  lib/supabase.ts          — Supabase client
  types/expense.ts         — TypeScript types (English)
  hooks/useExpenses.ts     — CRUD hooks with react-query
  components/
    BottomNav.tsx           — Tab bar (Estonian labels)
    ExpenseForm.tsx         — Add expense form
    ExpenseList.tsx         — History list item
    CategoryBadge.tsx       — Colored category badge
  pages/
    AddExpense.tsx          — "Lisa kulu" screen
    History.tsx             — "Ajalugu" screen
    Summary.tsx             — "Kokkuvõte" screen
```

## Implementation Steps

1. **Supabase setup** — Create `expenses` table with English column names, no RLS
2. **Types & client** — `Expense` interface with English fields, Supabase client init
3. **Data hooks** — `useExpenses` (fetch with filters), `useAddExpense` (insert), CSV export utility
4. **Bottom tab navigation** — 3 tabs with Estonian labels (Lisa kulu, Ajalugu, Kokkuvõte), routes at `/`, `/history`, `/summary`
5. **Add Expense page** — Form with Estonian labels mapping to English fields (e.g., "Kuupäev" label → `date` field). Conditional fuel field when category is "Auto"
6. **History page** — List sorted by date desc, year + category filters (Estonian labels), CSV download of filtered rows
7. **Summary page** — Category totals table with year filter, grand total row
8. **PWA manifest** — Estonian app name "Kodukulu", icons, service worker via vite-plugin-pwa
9. **Styling** — Mobile-first, high contrast, large fonts, large tap targets

## Key Pattern: English Backend, Estonian UI

All code variables, types, DB columns, and function names stay in English. Estonian appears only in:
- UI labels, placeholders, button text, toasts
- Category values (these are display values stored as-is: Ehitus, Sisustus, etc.)
- Page titles and navigation labels
- PWA manifest name

