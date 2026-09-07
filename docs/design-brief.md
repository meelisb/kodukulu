# Kodukulu — Design Brief

This document is input for UI/UX design and prototyping. It covers the product purpose, design principles, navigation structure, and what each screen needs to accomplish. Acceptance criteria are excluded — this is about intent and user need, not implementation detail.

---

## What is Kodukulu

A personal home and vehicle expense tracking app for a household. Built as a mobile-first PWA — installable on Android home screen, also usable in a desktop browser. Primary use case: entering an expense within 30 seconds on a phone, at the point of purchase.

The app serves three jobs:
- Record and retrieve household expenses (purchase memory)
- Understand where money goes — by category, vendor, tag, and year
- Track when recurring maintenance tasks were last done and by whom

Language: Estonian throughout.

---

## Design Principles

- **Speed over features.** Every interaction should require the minimum possible taps. The add expense flow must feel instant.
- **Large touch targets.** All buttons and inputs sized for one-handed use on a phone. Destructive actions (delete) and safe actions (edit) must never be within the same fingertip reach of each other.
- **Minimal chrome.** Four main sections accessible via a fixed bottom navigation bar. Settings via a gear icon in the header. No hamburger menus. No nested navigation beyond settings sub-pages.
- **Honest empty states.** When a list or section has no data, say so clearly in Estonian with a short prompt on what to do next.
- **Confirmation before destruction.** Every delete action requires an explicit confirmation dialog before the record is removed.
- **Reassignment before deletion.** When deleting a category, tag, or maintenance type that is in use, the user must reassign all affected records to a replacement before deletion completes. This is a mandatory flow, not a warning.
- **Context-aware defaults.** Date defaults to today when adding a new expense. When editing, date defaults to the saved date — never today.
- **Privacy by default.** Receipt import is off by default and requires an explicit opt-in with a disclosure about data being sent to Google.

---

## Navigation Structure

**Bottom navigation bar (always visible):**
- Lisa kulu (Add expense) — the default/home screen
- Ajalugu (History)
- Kokkuvõte (Summary)
- Hoolduspäevik (Maintenance diary) — added in a later iteration

**Header:** App name or current section title on the left. Gear icon for Settings on the right.

**Settings** is not a bottom tab — accessed via the header gear icon. Contains sub-sections: categories, tags, family members, receipt import toggle.

---

## Screens and Their Jobs

### Login
Single screen. Email/password form. Google OAuth button. No registration flow visible on the same screen — "Create account" is a secondary action.

---

### Lisa kulu (Add Expense)

The most-used screen. Optimised for speed. Fields:
- **Date** — date picker, defaults to today
- **Vendor** (saaja) — text input with autocomplete from previously entered vendors
- **Description** (kirjeldus) — text input with autocomplete, optional
- **Category** (kategooria) — dropdown from household's category list
- **Amount** (summa) — numeric input, euros
- **Fuel litres** (kütusekogus) — numeric input, only visible when category is Auto
- **Tags** — multi-select from household's tag list, optional
- **Receipt import button** — only visible when user has opted in to receipt import in settings

Primary action: Salvesta (Save). Secondary: Tühista (Cancel — resets form).

On successful save: redirect to Ajalugu with the new entry highlighted.

---

### Ajalugu (History)

The browse and find screen. Long list of expense cards with filtering on top.

**Filters (collapsible panel or top area):**
- Year dropdown
- Category dropdown
- Vendor dropdown (populated from data)
- Tag filter
- Text search (searches vendor + description)
- Sort control: date ascending/descending (later: amount ascending/descending)

Active filters shown as removable chips. Filter count badge when panel is collapsed.

**Expense card shows:** Date, vendor, category badge, description (if present), amount, tags (if any). Edit and delete buttons — separated far enough to avoid accidental taps.

**Edit** opens the same form as Lisa kulu in a modal, pre-filled with saved values.

**Delete** triggers a confirmation dialog before removing the record.

Empty state when no results match filters.

---

### Kokkuvõte (Summary)

The analysis screen. Shows where money went.

**Default view:** Category summary table for the selected year. Each category row shows total amount. Grand total at the bottom. All categories shown even if total is zero.

**Drill-down:** Tapping a category row expands or navigates to a vendor breakdown for that category — each vendor with their total and entry count. Tapping a vendor in the breakdown navigates to Ajalugu with that vendor and year pre-filtered.

**Year-over-year view (P1):** Switchable view showing category totals in columns per year.

Year selector at the top.

---

### Hoolduspäevik (Maintenance Diary) — P2

The operational memory screen. "When was the car last serviced and who did it?"

**Default view:** List of maintenance types, each showing the date of the most recent event. Overdue items visually flagged when a default interval is set and exceeded.

**Type detail:** Tap a type to see its most recent event (date, provider, cost link). Option to view full history.

**Full history:** Chronological list of all events for that type.

**Add event:** Form with type selector, date, service provider (optional), description, link to cost (optional).

---

### Seaded (Settings)

Management screen. Accessed via gear icon in header.

**Sections:**
- **Kategooriad** — list of household categories with drag-to-reorder, rename, delete (with reassignment flow if in use), add new
- **Sildid** (Tags) — same pattern as categories
- **Perekonnaliikmed** (Family members) — list of current household members, invite by email, remove
- **Kviitungi import** — toggle to enable/disable receipt import with Google Gemini; disclosure shown on first enable

---

## Key Interaction Patterns

**Reassignment flow** (triggered when deleting a category/tag/type that is in use):
1. User taps delete
2. Dialog: "X records are assigned to [name]. Choose a replacement before deleting."
3. Dropdown to pick replacement (current item excluded from options)
4. Confirm → reassign all records → delete original
5. Cancel → nothing changes

**Post-save highlight in Ajalugu:**
After saving a new expense, user lands on Ajalugu. The new entry is visually highlighted (e.g. subtle background colour or border). Highlight fades after ~3 seconds. Entry is scrolled into view automatically.

**Receipt import flow:**
1. User taps upload button on Lisa kulu
2. File picker opens (PDF, JPG, PNG)
3. Loading state while Gemini processes
4. Form pre-filled with extracted values — all fields remain editable
5. User reviews, adjusts if needed, saves normally

**Vendor drill-down from Kokkuvõte:**
1. User is in Kokkuvõte, year selected, viewing category breakdown
2. Taps a vendor name
3. Navigates to Ajalugu with vendor and year filter pre-applied
4. Filter chips visible — user can clear them
5. Back navigation returns to Kokkuvõte at the same position

---

## Visual Tone

The app handles real financial data for a household. The visual tone should be:
- Clean and functional — not playful, not corporate
- Easy to scan — the expense list is the core experience; information density matters
- Calm — neutral colours, clear hierarchy, nothing shouting for attention
- Estonian context — no anglicised UI patterns that feel foreign

Current implementation is described as "dull" — there is room for a considered visual identity without adding complexity.
