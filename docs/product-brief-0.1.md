# Product Brief: Kodukulu

*Last updated: 05 April 2026*

---

## Problem

Estonian homeowners tracking household and vehicle running costs have no convenient way to record expenses at the point of purchase. Existing solutions like Excel work for analysis but fail at data entry — the friction of opening a spreadsheet, navigating to the right sheet, and typing on a phone means entries get skipped and the habit dies. Receipts pile up, memory fades, and the historical record becomes unreliable.

## Product Vision

Kodukulu is a mobile-first personal expense tracker for home and vehicle costs. It makes data entry fast enough to complete before leaving the shop, and gives its owner a clear, searchable record of household spending with basic analysis by category and year.

## Target Users

A single Estonian homeowner managing household and vehicle running costs across multiple categories (construction, garden, interior, tools, housekeeping, car). Currently the sole user. No multi-user or family sharing in scope.

## Goals

1. A new expense can be entered in under 30 seconds on a mobile phone
2. Any past expense can be found by scrolling or filtering within the app
3. Category and year totals are always visible without leaving the app
4. Digital receipts can be imported with minimal manual input
5. All data can be exported as CSV for further analysis in Excel

## Non-Goals

- Multi-user access or family sharing
- Full personal finance tracking — only home and vehicle categories are in scope
- In-app charts or advanced analytics beyond category/year totals
- Bulk historical data import
- Tagging or cross-category grouping
- Offline mode
- Native Android or iOS app — PWA only
- Duplicate receipt detection
- Multi-line invoice splitting

## Success Criteria

1. User completes a single-line expense entry in under 30 seconds on an Android phone
2. User can locate any specific past expense by filtering by year and category within 60 seconds
3. Kokkuvõte shows correct category totals for any selected year immediately after an entry is saved
4. A PDF receipt uploaded to the app pre-fills vendor, date, amount, and fuel liters correctly without manual correction in at least 8 out of 10 cases
5. CSV export contains exactly the rows matching the active filter selection and opens correctly in Excel with Estonian locale
6. App is installable as a PWA on Android and accessible via home screen icon

## Constraints

- Estonian language UI throughout
- Mobile-first — all core flows must be usable one-handed on a phone
- Free hosting tier — no recurring infrastructure costs
- Single user — no authentication required in current iteration
- Lovable as primary build environment
- Gemini 2.5 Flash via Lovable AI Gateway for receipt parsing

## Design Principles

- **Speed over features** — every interaction requires the minimum possible taps
- **Large touch targets** — all buttons and inputs sized for one-handed mobile use; destructive and non-destructive actions never within the same fingertip reach
- **Minimal chrome** — bottom tab navigation for three primary sections, no hamburger menus, no nested navigation
- **Honest empty states** — when no data exists, say so clearly in Estonian
- **Confirmation before destruction** — all delete actions require explicit confirmation dialog
- **Context-aware defaults** — form fields default to the most useful value for the context (today's date on creation, saved date on edit)

## Tech Stack

React, Supabase, Vercel, Lovable. PWA manifest for Android home screen installation.