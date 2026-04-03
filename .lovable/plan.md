

## Plan: Add search and compact CSV button to Ajalugu

### What changes

**1. `src/pages/History.tsx`**
- Add `searchQuery` state
- Add a search `<Input>` with placeholder "Otsi saaja või kirjelduse järgi..." placed above the filter row
- Filter expenses client-side: `expenses.filter(e => vendor or description includes searchQuery, case-insensitive)`
- Replace the full-width CSV download `<Button>` with a small icon-only button (place it inline next to the sort toggle)
- Ensure the sort toggle (from previous story) and search all work together — search filters the already-fetched data, sort and year/category filters drive the query

**2. `src/hooks/useExpenses.ts`** — No changes needed. Search is client-side filtering on already-fetched results.

### Layout (mobile)

```text
[🔍 Otsi saaja või kirjelduse järgi...     ]
[Aasta ▾]  [Kategooria ▾]  [↕] [⬇]
[expense cards...]
```

- Search input: full width
- Filters row: two selects + sort toggle + compact CSV icon button, all in one row
- No horizontal scrolling needed

### Security
- No new database queries or RLS changes — search is purely client-side filtering of data already authorized by existing queries.

