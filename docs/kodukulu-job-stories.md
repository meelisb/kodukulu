# Kodukulu — Job Stories & Product Scope

**Version 1.1 • April 2026**

---

## Product Vision

Kodukulu is a personal home and vehicle expense management system that gives its owner a clear, searchable, and always-available record of household spending, purchase history, and maintenance activities.

The app serves three core outcomes:

**Outcome 1 — Cost Awareness.** Understand actual spending by category, year, vendor, and custom groupings, including detailed fuel and per-kilometre driving cost analysis.

**Outcome 2 — Purchase Memory.** Retrieve specific facts about past purchases: who sold what, when, at what price, what variety, and how many times.

**Outcome 3 — Maintenance Awareness.** Know when maintenance tasks were last performed, by whom, and maintain a living log that builds automatically from cost entries where possible.

---

## Priority Levels

- **P0** — Build now. Immediate improvements to cost reading and data entry feedback.
- **P1** — Build into schema now, expose in UI next. Tags and maintenance data model.
- **P2** — Build later. Car analytics, maintenance diary UI, advanced data entry.
- **P3** — Future. Nice-to-have features; design decisions should not block them.

---

## Area 1: Cost Reading & Browsing

Improving the Ajalugu view so that existing cost data becomes findable, sortable, and summarisable.

| Priority | ID | Job Story | Notes |
|---|---|---|---|
| **P0** | R-01 | When I remember a specific purchase but cannot find it by scrolling, I want to search costs by vendor name or description text, so that I can locate any cost entry within seconds. | Free-text search. Works in combination with existing year/category filters. |
| **P0** | R-02 | When I want to see my most recent or oldest costs first, I want to toggle the sort order of the cost list by date (ascending or descending), so that I can orient the list to my current task. | Default: descending (newest first). Consider making sort generic to support amount sort later. |
| **P0** | R-03 | When I want to understand how much I have paid a specific vendor, I want to filter costs by vendor and see a summary total for that vendor within the active year and category filters, so that I get a quick financial picture per vendor. | Vendor list derived from existing data. Summary shows count + total. |
| **P1** | R-04 | When I want to analyse a cross-cutting spending group (e.g. all fuel costs, or all garden planting costs), I want to filter and summarise costs by one or more tags, so that I can understand spending on topics that do not align with a single category. | Tags are many-to-many. A cost can have multiple tags. Tags span categories. |
| **P1** | R-05 | When I want to combine multiple filter dimensions at once (year + category + vendor + tag + search text), I want a filter panel that scales to additional dimensions without cluttering the main view, so that the interface remains usable on mobile as filters grow. | Collapsible filter panel or bottom sheet. Active filters shown as removable chips. |
| **P3** | R-06 | When I want to find my largest or smallest expenses, I want to sort costs by amount, so that I can spot outliers quickly. | Depends on generic sort mechanism from R-02. |

---

## Area 2: Data Entry & Feedback

Closing the feedback loop after creating a cost entry, and preparing for future advanced data entry features.

| Priority | ID | Job Story | Notes |
|---|---|---|---|
| **P0** | E-01 | When I save a new cost, I want to see the fully rendered cost card in context among my other entries, so that I can immediately confirm the data is correct without navigating manually. | Preferred: redirect to Ajalugu with the new entry highlighted. Alternative: show rendered card inline on the entry form. |
| **P0** | E-02 | When I have just confirmed a saved cost and want to add another, I want a quick way to return to an empty entry form, so that batch entry of multiple receipts stays efficient. | Floating action button or prominent link back to Lisa kulu from Ajalugu. |
| **P2** | E-03 | When I receive a multi-line invoice (e.g. a supermarket receipt), I want to review each line and decide per line whether to add it as a separate cost, group it with other lines, or skip it, so that I capture the right level of detail without manual re-entry. | Requires receipt OCR output as structured line items. Each line gets add/group/skip controls. |
| **P2** | E-04 | When I create a cost that also represents a maintenance event (e.g. car service, sewage emptying), I want the option to simultaneously create a linked maintenance diary entry with pre-filled data, so that I do not have to enter the same information twice. | Toggle or checkbox during cost entry. Pre-fills date, vendor, description into maintenance event. |

---

## Area 3: Tags & Custom Groupings

A flexible classification layer that enables cross-category analysis and prepares the ground for travel cost handling and other future grouping needs.

| Priority | ID | Job Story | Notes |
|---|---|---|---|
| **P1** | T-01 | When I create or edit a cost, I want to assign one or more tags from a managed list, so that I can classify costs along dimensions beyond category and vendor. | Tags table + junction table. Managed vocabulary prevents duplicates/typos. |
| **P1** | T-02 | When I want to understand fuel spending specifically, I want to tag fuel costs and view a tag-filtered summary, so that I can separate fuel from other Auto costs without changing categories. | Retroactively tag existing fuel entries. Immediate value once tag filter ships. |
| **P1** | T-03 | When I add a new category (e.g. Reisimine/Traveling), I want tags to resolve the overlap where a single cost belongs to multiple conceptual groups (e.g. fuel purchased during a trip), so that I do not have to choose between accurate categorisation and accurate trip cost tracking. | Category = primary financial domain. Tags = cross-cutting concerns. A fuel cost during a trip: category Auto, tags: Kütus + Reisimine. |
| **P1** | T-04 | When I want to manage my tags, I want to create, rename, and delete tags, so that my classification vocabulary stays clean over time. | Tag management UI. Deletion requires reassignment of affected costs to another tag (same pattern as category and maintenance type deletion). |
| **P3** | T-05 | When I want to see spending on a tag over time, I want the Kokkuvõte view to offer a tag-based breakdown alongside the category breakdown, so that I get both perspectives in one place. | Extends Kokkuvõte with a tag dimension toggle. |

---

## Area 4: Car Cost Analysis

Dedicated analytics for vehicle ownership costs, fuel consumption, and per-kilometre driving cost.

| Priority | ID | Job Story | Notes |
|---|---|---|---|
| **P2** | C-01 | When I want to understand my annual fuel consumption, I want to see total litres purchased and total fuel cost per year, so that I can track fuel spending trends. | Requires fuel entries tagged with Kütus and litres field populated. |
| **P2** | C-02 | When I want to know my average fuel consumption, I want to see litres per 100 km per year, so that I can monitor vehicle efficiency. | Requires mileage readings to calculate driven distance per period. |
| **P2** | C-03 | When I want to know the true cost of driving, I want to see average cost per kilometre per year (total Auto costs ÷ driven km), so that I can make informed decisions about vehicle use. | Total Auto category costs (not just fuel) divided by driven km. |
| **P2** | C-04 | When I fill up or service my car, I want to record an odometer reading on that date, so that the system can calculate driven distances between readings. | Separate mileage_readings table: date + km. Can be entered standalone or during cost entry. |
| **P3** | C-05 | When I want a comprehensive car dashboard, I want to see fuel, maintenance, insurance, and total ownership costs in one view with year-over-year trends, so that I have a complete picture of vehicle economics. | Aggregates Auto category by tags: Kütus, Hooldus, Kindlustus, etc. |

---

## Area 5: Maintenance Diary (Hoolduspäevik)

A living log of home and vehicle maintenance activities, linked to costs where applicable, enabling recall of past service events and tracking of recurring tasks.

| Priority | ID | Job Story | Notes |
|---|---|---|---|
| **P1** | M-01 | When I want to know when a specific maintenance task was last done and by whom, I want to look up the most recent event of that type, so that I can plan the next occurrence or contact the same provider. | Core query: latest event per maintenance type. Shows date, provider, linked cost if any. |
| **P2** | M-02 | When I want to see the full history of a recurring maintenance task (e.g. all sewage emptyings or all filter replacements), I want to browse all events of a given type in chronological order, so that I can see patterns and frequencies. | List view filtered by maintenance type. |
| **P2** | M-03 | When I perform a maintenance task that has no associated cost (e.g. replacing a ventilation filter from existing stock), I want to create a standalone maintenance event manually, so that the diary stays complete even without a cost trigger. | Manual creation form: date, type, description, provider (optional), no cost link. |
| **P2** | M-04 | When a cost entry automatically creates a linked maintenance event, I want to see the link from both sides: the cost shows its maintenance record, and the maintenance event shows its cost, so that I can navigate between financial and operational views of the same real-world event. | Bidirectional navigation via cost_id FK. |
| **P1** | M-05 | When I want a consistent vocabulary for maintenance activities, I want a managed list of maintenance types with pre-defined names and optional default intervals, so that lookup and grouping works reliably. | maintenance_types table. Starter set: auto hooldus, auto rehvivahetus, kanalisatsiooni tühjendamine, ventilatsiooni filter, etc. |
| **P3** | M-06 | When a maintenance task is overdue based on its typical interval, I want a visual indicator or reminder, so that I do not forget recurring tasks. | Depends on default_interval_months in maintenance_types. Future notification system. |

---

## Area 6: Summaries & Analytics (Kokkuvõte)

Extending the existing summary view with additional dimensions and deeper drill-down.

| Priority | ID | Job Story | Notes |
|---|---|---|---|
| **P0** | S-01 | When I view the Kokkuvõte for a year and category, I want to also see a vendor breakdown within that selection, so that I understand where money goes at a more granular level than category alone. | Vendor subtotals within category. Extends current category-only view. |
| **P1** | S-02 | When I want to compare spending across years, I want to see year-over-year totals by category side by side, so that I can identify trends. | Multi-year comparison. Table or simple bar chart. |
| **P3** | S-03 | When I want a visual spending overview, I want chart-based representations (bar, pie) of category and tag breakdowns, so that patterns are easier to spot than in a number table. | Data visualisation layer on top of existing aggregation queries. |

---

## Area 7: Settings & Configuration

User-manageable settings for categories, and preparation for multi-user and public release.

| Priority | ID | Job Story | Notes |
|---|---|---|---|
| **P1** | G-01 | When I want to adapt the app to my specific household, I want to create, rename, and reorder cost categories, so that the category list reflects my actual spending domains. | Settings view. Categories are user-defined, not hardcoded. New users get a default starter set. |
| **P1** | G-02 | When I delete a category that has costs assigned to it, I want to be required to reassign those costs to another category before deletion completes, so that no cost is left without a category and reporting stays consistent. | Deletion flow: select replacement category → bulk reassign → delete. Same pattern for tag deletion (T-04) and maintenance type deletion. |
| **P1** | G-03 | When I use the app, I want to authenticate with my account, so that my data is private and no one else can see or modify my costs. | Supabase Auth (email/password minimum). RLS policies on all tables. user_id column on every data table. |
| **P1** | G-04 | When I am a new user setting up the app for the first time, I want to start with a sensible default set of categories, so that I can begin entering costs immediately and customise later. | Seed default categories on account creation. Current set: Auto, Majapidamine, Toidukaubad, etc. Localise or make language-neutral. |
| **P3** | G-05 | When I want to stop using the app, I want to export all my data and delete my account, so that I retain ownership of my information and comply with my rights under GDPR. | Full data export (JSON/CSV). Account deletion cascades to all user-owned rows. |
| **P3** | G-06 | When I want to try the app before creating an account, I want to access a public demo version with sample data, so that I can evaluate the app without commitment. | Demo environment with pre-seeded data. Read-heavy, resets periodically or uses a shared demo account. |

---

## Area 8: Public Release & Infrastructure

Environment separation, installability, and operational concerns for making the app available to others.

| Priority | ID | Job Story | Notes |
|---|---|---|---|
| **P1** | I-01 | When I develop the app, I want separate development and production databases, so that test data never appears in my live app and I can experiment safely. | Two Supabase projects with environment variables. Dev in Lovable preview, prod at public URL. |
| **P2** | I-02 | When I want to use the app on my Android phone, I want to install it to my home screen as a native-feeling app, so that I can access it with one tap without opening a browser. | PWA: manifest.json + service worker. Installable on Android and iOS. No app store needed initially. |
| **P3** | I-03 | When I want to share the app with others as open source, I want a public code repository with setup instructions, so that anyone can deploy their own instance. | Public repo (GitHub). README with Supabase setup guide. No credentials in code. |
| **P3** | I-04 | When the app is publicly available, I want protection against abuse (spam entries, excessive API calls), so that the service remains stable for all users. | Supabase RLS prevents cross-user access. Application-level rate limiting for write operations. |
| **P3** | I-05 | When the app handles personal financial data for multiple users, I want GDPR compliance including data portability and right to erasure, so that the app is legally operable in the EU. | Covers G-05 (export + delete). Also requires privacy policy page and data processing transparency. |

---

## Data Model Overview

Entities and key relationships that support the full scope. Schema should be created in Supabase. Items marked with * should be created now even if the UI comes later.

### Existing (to keep, with modifications)

**costs** — id, user_id*, date, vendor, description, amount, category_id* (FK, replacing text category), litres (nullable). Already in production; user_id and category_id FK to be added.

### New entities

**users** — managed by Supabase Auth. user_id referenced across all tables for row-level security.

**categories*** — id, user_id (FK), name, sort_order. User-defined cost categories. Default set seeded on account creation.

**tags*** — id, user_id (FK), name, color (optional). Managed vocabulary for cross-cutting cost classification.

**cost_tags*** — cost_id (FK), tag_id (FK). Junction table enabling many-to-many tagging.

**maintenance_types*** — id, name, area (car/house/yard/systems), default_interval_months (nullable). Master list of trackable activities.

**maintenance_events** — id, date, maintenance_type_id (FK), description, service_provider, cost_id (nullable FK), notes, created_at. The diary entries.

**mileage_readings** — id, date, odometer_km, notes (optional). Standalone readings for driving distance calculation.

### Key design decisions

Every data table carries a user_id column and is protected by Supabase Row Level Security policies. This is foundational and should be implemented early to avoid a painful migration later.

Categories move from a hardcoded text field to a user-owned categories table with a foreign key on costs. This enables per-user customisation and the reassignment-on-deletion pattern.

Deletion of categories, tags, and maintenance types all follow the same pattern: if the entity is in use, the user must reassign affected records to a replacement before deletion proceeds. No orphaned records, no soft deletes.

Maintenance events are a separate entity from costs, not a view or flag on costs. The link is optional and can be one-to-many (one bulk purchase → multiple maintenance events over time).

Tags and maintenance types are both classification systems but serve different purposes: tags classify costs for financial analysis; maintenance types classify activities for operational tracking. They remain separate.

Mileage readings are a separate table from maintenance events because the data structure (date + km) and query patterns (interpolation between readings) differ fundamentally from event lookup.

The Reisimine (Traveling) category coexists with Auto by using tags to handle overlap. A fuel purchase during a trip gets category Auto + tag Reisimine, making it visible in both financial views.

---

## Navigation & Information Architecture

The app evolves from three views to five primary sections:

**Lisa kulu** — Data entry. Costs with optional maintenance event creation toggle and optional mileage reading.

**Ajalugu** — Cost browsing. Search, sort, filter (year, category, vendor, tags). Also the post-save landing page with highlighted new entry.

**Kokkuvõte** — Financial summaries. Category, vendor, and tag breakdowns. Car analytics as a sub-section.

**Hoolduspäevik** — Maintenance diary. Grouped by type, showing last-done dates, full history, and linked costs.

**Seaded** — Settings. Category management, tag management, account settings (profile, data export, account deletion).

Mobile navigation: bottom tab bar for the four main views (Lisa kulu, Ajalugu, Kokkuvõte, Hoolduspäevik). Settings accessible via a gear icon in the header or as a fifth tab. Kokkuvõte and Hoolduspäevik could alternatively live under a shared Ülevaade section with segment tabs if five bottom tabs feel crowded.

---

## Iteration Plan

### Iteration 1 — Cost reading & entry feedback (P0)

Scope: R-01, R-02, R-03, E-01, E-02, S-01. Deliver search, sort, vendor filter on Ajalugu. Post-save redirect with highlight. Vendor breakdown on Kokkuvõte.

### Iteration 2 — Tags, categories, auth & schema foundation (P1)

Scope: T-01, T-02, T-03, T-04, R-04, R-05, G-01, G-02, G-03, G-04, I-01, M-05, S-02. Add user_id + RLS to all tables. Supabase Auth. Separate dev/prod databases. Move categories from hardcoded text to user-owned table. Create tags, cost_tags, maintenance_types tables. Tag and category management UI with reassignment-on-deletion. Tag filter and summary. Filter panel redesign. Retroactively tag fuel entries. Year-over-year comparison.

### Iteration 3 — Maintenance diary & car analytics (P2)

Scope: M-01, M-02, M-03, M-04, E-03, E-04, C-01, C-02, C-03, C-04, I-02. Maintenance events table and UI. Hoolduspäevik view. Cost-maintenance linking. Mileage tracking. Car analytics dashboard. Multi-line invoice entry. PWA installability.

### Iteration 4 — Polish, public release & future features (P3)

Scope: R-06, T-05, C-05, M-06, S-03, G-05, G-06, I-03, I-04, I-05. Sort by amount. Tag breakdown on Kokkuvõte. Full car ownership dashboard. Maintenance reminders. Data visualisation charts. GDPR compliance (export + delete). Public demo. Open source repo. Abuse prevention.
