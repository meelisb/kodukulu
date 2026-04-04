

## Post-save redirect to Ajalugu with highlighted entry

### Changes

**1. `src/pages/AddExpense.tsx`**
- Import `useNavigate` from react-router-dom
- On successful save, navigate to `/history?highlight={newExpenseId}` instead of just showing a toast
- The new expense ID comes from the mutation's `onSuccess` data
- Keep error handling as-is (stay on form, show error)

**2. `src/pages/History.tsx`**
- Read `highlight` query param via `useSearchParams`
- Store highlighted ID in state, clear the query param on mount (so refreshing doesn't re-highlight)
- When rendering expense cards, apply a highlight style (e.g. `ring-2 ring-primary bg-primary/5`) to the matching card
- Use `useEffect` with a 3-second `setTimeout` to clear the highlight state, causing the ring to fade
- Add a CSS transition (`transition-all duration-700`) on the card wrapper so the highlight fades smoothly
- Auto-adjust the year filter: if the `highlight` param is present, extract the year from the new expense (via the expenses data) and set the year filter accordingly so the entry is visible
- Use `useRef` + `scrollIntoView` to scroll the highlighted card into view

### Technical details

- The `useAddExpense` mutation already returns the created record (`select().single()`), so the ID is available in `onSuccess(data)`
- Year filter adjustment: on mount, if highlight param exists, find the expense in the data and set year filter to match; reset category/vendor/search to ensure visibility
- Highlight fade: `setTimeout(() => setHighlightId(null), 3000)` with cleanup in useEffect
- Card class: `cn("rounded-lg border ...", expense.id === highlightId && "ring-2 ring-primary bg-primary/5 transition-all duration-700")`

