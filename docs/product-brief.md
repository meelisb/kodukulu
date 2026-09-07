# Product Brief: Kodukulu

*Last updated: 09 July 2026*

---

## Problem

Estonian homeowners tracking household and vehicle running costs have no convenient way to record expenses at the point of purchase. Existing solutions like Excel work for analysis but fail at data entry — the friction of opening a spreadsheet, navigating to the right sheet, and typing on a phone means entries get skipped and the habit dies. Receipts pile up, memory fades, and the historical record becomes unreliable. When maintenance tasks recur — car servicing, sewage emptying, filter replacements — there is no structured place to record when they last happened and by whom, leading to repeated searches through old receipts and lost institutional memory.

## Product Vision

Kodukulu is a personal home and vehicle expense management system that gives a household a clear, searchable, and always-available record of spending, purchase history, and maintenance activities. It serves three outcomes:

- understanding actual spending by category, vendor, and custom groupings including per-kilometre driving costs;
- retrieving specific facts about past purchases (purchase memory);
- knowing when maintenance tasks were last performed and by whom.

## Target Users

A household — typically a couple or family — managing home and vehicle running costs across multiple categories (construction, garden, interior, tools, housekeeping, car). Each household member uses their own login. The software is open source and self-hostable: any family can deploy their own instance. A public demo instance allows people to evaluate the app without installation.

## Goals

1. A new expense can be entered in under 30 seconds on a mobile phone
2. Any past expense can be found by scrolling, text search, or multi-dimensional filtering
3. Spending can be analysed by category, vendor, tag, and year — including year-over-year comparison
4. Vehicle fuel consumption and cost per kilometre can be tracked from tagged cost data and odometer readings
5. A maintenance diary records when recurring tasks were last done, by whom, and at what cost
6. Digital receipts can be imported with minimal manual input — opt-in, with clear disclosure
7. All data is private behind authentication, household-scoped, and exportable as CSV
8. Multiple family members can access the same household data with their own logins

## Non-Goals

- Full personal finance tracking — only home and vehicle categories are in scope
- Native Android or iOS app — PWA only
- Bulk historical data import
- Offline mode
- Duplicate receipt detection
- Hosted SaaS with shared infrastructure — each household runs their own instance

## Success Criteria

1. A household member completes a single-line expense entry in under 30 seconds on an Android phone
2. Any specific past expense can be located by text search or filtering within 60 seconds
3. Kokkuvõte shows correct category and vendor totals for any selected year immediately after an entry is saved
4. Year-over-year category comparison is available and accurate across all years with data
5. Car fuel cost, litres/100 km, and cost/km are calculated correctly from tagged cost and mileage data
6. Hoolduspäevik shows the correct last-done date and provider for any maintenance type with at least one linked event
7. A PDF or image receipt pre-fills vendor, date, amount, and fuel litres correctly without manual correction in at least 8 out of 10 cases
8. CSV export contains exactly the rows matching the active filter selection and opens correctly in Excel with Estonian locale
9. App is installable as a PWA on Android and accessible via home screen icon
10. All household data is protected by row-level security; no user outside the household can read or modify it

## Constraints

- Estonian language UI throughout
- Mobile-first — all core flows must be usable one-handed on a phone
- Free hosting tier — no recurring infrastructure costs during personal use
- Authentication required from day one — Supabase Auth with email/password and Google OAuth; RLS on all tables
- Household-scoped data model — all data belongs to a household, not an individual user
- Claude Code (VS Code) as primary build environment; Lovable as optional design and prototyping tool
- Gemini 2.5 Flash for receipt OCR via Supabase Edge Function — opt-in only, with disclosure
- Separate development and production Supabase projects from day one

## Design Principles

- **Speed over features** — every interaction requires the minimum possible taps
- **Large touch targets** — all buttons and inputs sized for one-handed mobile use; destructive and non-destructive actions never within the same fingertip reach
- **Minimal chrome** — bottom tab navigation for four main sections (Lisa kulu, Ajalugu, Kokkuvõte, Hoolduspäevik); Settings accessible via header icon; no hamburger menus; no nested navigation beyond settings sub-pages
- **Honest empty states** — when no data exists, say so clearly in Estonian with a short explanation of what to do
- **Confirmation before destruction** — all delete actions require an explicit confirmation dialog
- **Reassignment before deletion** — categories, tags, and maintenance types that are in use cannot be deleted until all affected records are reassigned to a replacement
- **Context-aware defaults** — form fields default to the most useful value (today's date on creation, saved date on edit)
- **Privacy by default** — receipt import is off by default; users opt in with an explicit disclosure acknowledgement

## Tech Stack

React + TypeScript, Supabase (database, auth, edge functions), Vercel (hosting + preview deployments), Claude Code in VS Code. Supabase Auth for authentication and row-level security. PWA manifest for Android home screen installation. Gemini 2.5 Flash for receipt OCR via Supabase Edge Function.
