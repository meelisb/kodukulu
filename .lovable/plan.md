

## Vendor filter and summary on Ajalugu

### What changes

**1. `src/pages/History.tsx`**

- Add `vendor` state (string, default `""`)
- Derive vendor list from `expenses` array: `useMemo` to extract unique vendor names, sorted alphabetically — this ensures the list reflects active year/category filters automatically
- Add a third `<Select>` for vendor in the filters row (between category and sort button)
- Extend `filteredExpenses` logic: after search filtering, also filter by selected vendor
- When a vendor is selected, show a summary card above the list: `"{vendor}: {count} kulu, kokku {total} €"` — computed from the final filtered list
- When vendor is cleared (set to "all"), hide the summary

**2. Layout (mobile, 390px)**

```text
[🔍 Otsi saaja või kirjelduse järgi...        ]
[Aasta ▾] [Kategooria ▾] [Saaja ▾] [↕] [⬇]
[Circle K: 3 kulu, kokku 146.05 €           ]  ← only when vendor selected
[expense cards...]
```

The three selects share flex space equally; sort and CSV remain icon buttons.

**3. No backend changes** — vendor list is derived client-side from already-fetched expenses. No new queries, no RLS changes.

### Technical details

- Vendor list derived via `useMemo(() => [...new Set(expenses.map(e => e.vendor))].sort(), [expenses])` — updates automatically when year/category filters change the fetched data
- Filtering chain: `expenses` → vendor filter → search filter → `filteredExpenses`
- Summary computed via `useMemo` on `filteredExpenses` when vendor is active: count + sum of amounts
- Clearing vendor filter: reset to `""`, summary hidden via conditional render

