

## Three UX Fixes

### 1. Toast position — show at top instead of bottom

The Sonner `<Toaster>` component defaults to bottom-right, which overlaps with the bottom navigation. Fix: add `position="top-center"` prop to the `<Toaster>` in `src/components/ui/sonner.tsx` (or in `src/App.tsx` where it's used).

**File: `src/App.tsx`** — change `<Toaster />` to `<Toaster position="top-center" />`

### 2. Edit modal "Tühista" button should close the dialog

The `ExpenseForm` has a "Tühista" (Cancel/Reset) button that only resets form fields. When used inside the edit dialog, it should close the dialog instead.

**File: `src/components/ExpenseForm.tsx`** — add an optional `onCancel` prop. When provided, the "Tühista" button calls `onCancel` instead of `handleReset`.

**File: `src/pages/History.tsx`** — pass `onCancel={() => setEditingExpense(null)}` to the `ExpenseForm` inside the edit dialog.

### 3. Sentence-case conversion for AI-parsed receipt data

When the receipt parser returns ALL CAPS text for vendor/description, convert to sentence case (first letter uppercase, rest lowercase).

**File: `src/components/ExpenseForm.tsx`** — add a `toSentenceCase` helper function and apply it to `result.vendor` and `result.description` in `handleFileSelect`.

```typescript
function toSentenceCase(str: string): string {
  if (!str) return str;
  if (str !== str.toUpperCase()) return str; // only convert if ALL CAPS
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
```

