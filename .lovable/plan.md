

## Vendor breakdown on Kokkuvõte

### Approach

Make each category row expandable using Collapsible. Clicking a category row toggles a vendor breakdown beneath it, showing vendors sorted by amount descending.

### Changes

**`src/pages/Summary.tsx`**

- Import `Collapsible`, `CollapsibleTrigger`, `CollapsibleContent` from `@/components/ui/collapsible`
- Import `ChevronRight` from lucide-react and `useMemo` from React
- Compute a `vendorBreakdown` map: for each category, group expenses by vendor, sum amounts, sort descending
- Replace the static `<TableRow>` per category with a `<Collapsible>` wrapper:
  - The category row becomes `<CollapsibleTrigger>` — shows category name, total, and a chevron icon that rotates on open
  - `<CollapsibleContent>` renders indented sub-rows for each vendor with their subtotal
- Categories with total 0 remain static (no expand)
- Grand total footer row unchanged

### Layout

```text
| ▸ Auto                    | 1 031.60 |
|   Circle K                |   540.20 |  ← expanded
|   Terminal                |   312.50 |
|   Olerex                  |   178.90 |
| ▸ Ehitus                  | 2 450.00 |
| Kokku                     | 5 231.60 |
```

### Technical details

- Vendor breakdown computed via `useMemo`:
  ```typescript
  const vendorBreakdown = useMemo(() => {
    const map: Record<string, { vendor: string; total: number }[]> = {};
    CATEGORIES.forEach(cat => {
      const groups: Record<string, number> = {};
      expenses.filter(e => e.category === cat).forEach(e => {
        groups[e.vendor] = (groups[e.vendor] || 0) + Number(e.amount);
      });
      map[cat] = Object.entries(groups)
        .map(([vendor, total]) => ({ vendor, total }))
        .sort((a, b) => b.total - a.total);
    });
    return map;
  }, [expenses]);
  ```
- Use `<Collapsible>` per category row instead of Accordion to keep table structure simple
- Chevron rotates via `data-[state=open]:rotate-90` transition
- No backend changes — uses existing expense data

