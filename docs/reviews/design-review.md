## Design Review: Kodukulu — current implementation (pre-Settings/Maintenance)
*Reviewed: 2026-07-09*
*Screens reviewed: Login (`src/pages/Login.tsx`), Reset Password (`src/pages/ResetPassword.tsx`), Lisa kulu / Add Expense (`src/pages/AddExpense.tsx`, `src/components/ExpenseForm.tsx`, `src/components/AutocompleteInput.tsx`), Ajalugu / History (`src/pages/History.tsx`, `src/components/CategoryBadge.tsx`), Kokkuvõte / Summary (`src/pages/Summary.tsx`), Bottom Navigation (`src/components/BottomNav.tsx`), 404 (`src/pages/NotFound.tsx`)*

Note: Settings (Seaded), Maintenance diary (Hoolduspäevik), and the header/gear-icon pattern described in the design brief do not exist in the codebase yet (`src/App.tsx` has no header component and no `/settings` route). Their absence is a feature gap, not a design defect, and is out of scope for this review — but I flag downstream consequences where the *current* screens already show symptoms of that gap.

---

### Login (`Login.tsx`) / Reset Password (`ResetPassword.tsx`)

**Must fix**
- Sub-44px tap targets on all text links: The "Unustasid parooli?" (forgot password), "Loo konto" / "Logi sisse" toggle, and "Tagasi sisselogimisele" links are bare `<button>`/inline text with `text-sm` and no padding (`Login.tsx:97-105`, `119-140`). Actual hit area is roughly the text's own line-height (~20px), well under the 44px minimum the project's own architecture doc mandates (`h-11`/`h-12`). On a phone these are easy to mis-tap or fail to hit, forcing repeated attempts — the opposite of "speed over features." Fix: wrap in a button with `min-h-11` and adequate horizontal padding, even if visually still text-styled.
- Same issue in `ResetPassword.tsx` is avoided (no small links there), but `NotFound.tsx`'s "Return to Home" has the identical problem — see below.

**Should fix**
- No Google OAuth button is rendered despite the design brief calling for one on this exact screen — this is a missing feature, not a design defect, so it's out of scope for this review, but flagging so it isn't lost.
- Validation feedback is toast-only. A wrong password or "email already registered" error appears as a transient toast and then vanishes; there's no persistent inline state on the field itself. On a slow mobile connection a user who glances away will miss the toast and be left staring at a form that silently did nothing. Consider adding a lightweight inline error under the field in addition to the toast.

**Consider**
- The screen is visually minimal (no card, no border) — appropriate for the "clean and functional, not corporate" tone in the design brief. This restraint is done well and should be the template for other screens once a header is introduced.

---

### Lisa kulu / Add Expense (`AddExpense.tsx`, `ExpenseForm.tsx`)

**Must fix**
- Receipt upload button renders unconditionally at the very top of the form (`ExpenseForm.tsx:172-205`), with no opt-in gate. This directly contradicts the product's own stated principle, "Privacy by default — receipt import is off by default," and the non-negotiable rule that the upload button must not render when the setting is off. Visually, it also means the single most speed-critical screen in the app opens with a full-width `h-14` secondary action sitting above every primary field (date, vendor, amount) — the opposite of "the add expense flow must feel instant." Fix: gate rendering behind the household's receipt-import setting, and when shown, place it below or visually subordinate to the core fields (e.g. a smaller ghost/link-style action), not as the first thing the eye hits.
- This same unconditional button also appears inside the Edit-expense modal (History.tsx renders `ExpenseForm` for editing), so a user editing a past record is shown "upload a new receipt" at the top of an edit dialog — confusing, since re-uploading during an edit isn't a flow described anywhere in the brief.

**Should fix**
- No inline reason is given when Save is disabled. `isFormValid = vendor && categoryId && amount` silently disables the button (`ExpenseForm.tsx:168`, `327`) with no visible hint about which required field is missing. A user who fills amount and category but not vendor sees a dead button with no explanation. Add a short helper line or highlight the missing field.
- Numeric field labelling is inconsistent with the rest of the app's density: the form uses `text-base font-semibold` labels throughout, but the receipt-upload helper caption ("PDF, JPG või PNG") is centered while every other helper/description text in the app is left-aligned — a small but noticeable pattern break.

**Consider**
- Good practice: amount and fuel-quantity inputs use `type="text"` with `inputMode="decimal"` rather than `type="number"`, avoiding the native spinner and locale decimal-separator problems common on mobile. Worth keeping as the pattern for all numeric entry.
- Good practice: date field pairs a typed text input with a calendar-icon popover button, both `h-12` — gives both fast typists and tap-to-pick users a good one-handed path.

---

### Ajalugu / History (`History.tsx`)

**Must fix**
- Edit and delete icon buttons sit immediately next to each other in the card header, separated by only `ml-2` (~8px), both at `p-2` around a 16px icon (~32px effective tap target) (`History.tsx:279-292`). This is a direct violation of the design brief's own explicit rule: "Destructive actions (delete) and safe actions (edit) must never be within the same fingertip reach of each other," and the accompanying screen spec, "Edit and delete buttons — separated far enough to avoid accidental taps." On a real phone, a slightly imprecise tap intended for "edit" can land on "delete," which then does require a confirm dialog, but the near-miss risk is exactly what the brief is designed to prevent. Fix: move delete to the opposite corner of the card (e.g. bottom-right, separate from vendor/edit), enlarge to `h-11 w-11`, and consider requiring a deliberate reveal (swipe or overflow menu) before delete is even tappable.
- The same two icon buttons are also under the 44px minimum tap target required everywhere else in the app (`h-11`/`h-12` convention) — at `p-2` with a `h-4 w-4` icon they resolve to roughly 32×32px.
- Three filter `Select` dropdowns (Year, Category, Vendor) are packed into one `flex` row, each `flex-1`, next to a `h-11 w-11` sort icon button (`History.tsx:191-243`). On a 375px-wide phone this leaves roughly 90–100px per dropdown after padding and gaps. Labels like "Kategooria" (10 characters) and real vendor names will truncate almost immediately, and three near-simultaneous horizontal dropdowns are hard to scan and tap accurately one-handed. The design brief explicitly suggested a "collapsible panel" for this reason. Fix: stack filters into two rows, or make the filter area collapsible with a badge showing active filter count, as specified in the brief.

**Should fix**
- Empty state ("Kulusid ei leitud") states the fact but gives no next step, contradicting the brief's "honest empty states ... with a short prompt on what to do next." Add a one-line suggestion, e.g. to adjust filters or add the first expense.
- Delete confirmation dialog is generic ("Kas oled kindel? See tegevus on pöördumatu...") and doesn't name what's being deleted (`History.tsx:344-349`). Given this is real financial/household data, showing the vendor, date, and amount in the confirmation text would materially reduce the chance of an unintended delete.
- Active filters aren't rendered as removable chips and there's no "filter count" badge, both explicitly requested in the brief for exactly this cramped-row scenario. This is a feature gap rather than a pure visual defect, so it's flagged here as context for the "Must fix" cramping finding above rather than as its own line item.

**Consider**
- The post-save highlight (`ring-2 ring-primary bg-primary/5` with a `duration-700` transition, cleared after 3s, auto-scrolled into view) is implemented well and matches the brief precisely — good execution, keep as the reference pattern for future "landed here after an action" states.
- CSV export button is icon-only with a `title` tooltip, which is invisible on touch devices; the Download icon alone is a reasonably universal affordance so this is low risk, but consider a visible label or accessible description if usage data shows confusion.

---

### Kokkuvõte / Summary (`Summary.tsx`)

**Should fix**
- The category-color system this screen depends on (via `CategoryBadge`, also used in History) is a hardcoded name→class lookup (`CategoryBadge.tsx:4-11`) keyed on exact Estonian category strings ("Ehitus", "Sisustus", etc.). Any household that renames a category or adds a new one gets an unstyled/default badge with no distinguishing color — breaking the "color used meaningfully" principle for anyone who customizes categories, which the product explicitly supports. This also contradicts the project's own styling convention that category colors must be data-driven, not a static map. Visually, this will present as a silently "broken" looking badge the first time a household edits their category list.

**Consider**
- Table-based category/vendor drill-down is clean and readable, consistent row height comfortably clears 44px (`table.tsx` uses `p-4` cells), and zero-total categories are shown dimmed rather than hidden — this matches "all categories shown even if total is zero" precisely. Good.
- Vendor breakdown rows are not tappable to jump to a pre-filtered Ajalugu view (per brief's drill-down spec), but they also carry no `cursor-pointer` or hover affordance, so there's no false promise of interactivity — the missing behavior is a feature gap, not a misleading visual, so it's out of scope here.

---

### Bottom Navigation (`BottomNav.tsx`)

**Must fix**
- "Logi välja" (sign out) is rendered as a fourth item with equal visual weight, equal width, and no separation from the three real navigation tabs (`BottomNav.tsx:19-44`). The design brief is explicit that the bottom bar is reserved for the app's core sections (with Hoolduspäevik arriving as a fourth tab later) and that all other actions belong behind the header's gear icon. Conflating "go to a section" with "end my session" in the same row, same styling, same tap gesture is a navigation-model violation: a mis-tap here doesn't just change screens, it logs the user out mid-task. It will also make the row overcrowded the moment Hoolduspäevik ships (5 equal-weight items in one row on a 375px screen). Fix: move sign-out into a settings/account surface, not the primary nav bar.

**Consider**
- No persistent header component exists yet anywhere in the app (confirmed in `App.tsx` — pages render their own `h1` instead). This isn't broken today since each page's title is clear and consistently styled (`text-2xl font-bold`), but there is currently nowhere for the gear/Settings icon the brief calls for, and no scaffolding for it. Worth building the header shell now, even before Settings itself ships, so it isn't a late retrofit.

---

### 404 / Not Found (`NotFound.tsx`)

**Must fix**
- Screen is in English ("Oops! Page not found", "Return to Home") while the design brief and architecture doc both state Estonian throughout the UI with no exceptions. This is clearly a leftover scaffold screen but it is a real, reachable screen a household member could land on.

**Should fix**
- Background uses `bg-muted` while every other screen in the app uses `bg-background` — a visible, unexplained inconsistency in a very small app that otherwise keeps its palette disciplined.
- "Return to Home" is a bare underlined text link with no padding — same sub-44px tap target problem flagged on the Login screen.

---

### Visual Identity — Color Palette & Typography (cross-cutting)

**Must fix**
- Category badge colors are not calm and actively contradict the brief's own visual-tone principle. `CategoryBadge.tsx:4-11` hardcodes six full-saturation hues — orange, blue, green, yellow, purple, red — one per category, each at Tailwind's `100/800` pairing. The rest of the app follows a genuinely restrained token system: `index.css:6-45` defines background/foreground/card/border as variations on a single low-saturation blue-gray (hue 220), with exactly one accent color (`--primary`, also hue 220) used anywhere for emphasis. Against that backdrop, History renders a scrolling list where every card carries a different, unrelated hue at meaningfully higher saturation than anything else on screen. The brief states the tone must be "calm — neutral colours, clear hierarchy, nothing shouting for attention," in a screen the brief itself calls the core experience where "information density matters." Six competing pastel hues repeating down every row is the visual definition of that principle being violated, even though no single badge looks garish in isolation.
- Red is double-booked for two unrelated meanings. `--destructive` (`index.css:28`) is red and is used for delete actions throughout the app. `CategoryBadge.tsx:10` independently assigns `red-100/800` to the "Auto" category. On a History card, that puts a delete button and a red "Auto" badge in close proximity with no relationship to each other — a semantic collision where red sometimes means "this will destroy data" and sometimes just means "car expense." Fix: reserve red exclusively for destructive/error states; pick category colors from a palette that excludes it.
- Badge colors don't come from the app's own design-token system. Every other component pulls color from the CSS custom properties (`bg-card`, `text-muted-foreground`, `bg-primary`, etc.); `CategoryBadge` is the one place that reaches for raw Tailwind palette classes instead. This is both the source of the calmness problem above and the reason it silently fails for a renamed/custom category (see the data-driven-color finding under Kokkuvõte). Fix: derive badge color from 2-3 low-saturation tones (or a small color dot rather than a full colored chip, keeping label text in the neutral `foreground` color) generated from a per-category `color` field expressed as an HSL token, consistent with how the rest of the theme is built.

**Consider**
- No typeface has been deliberately chosen. `tailwind.config.ts` and `index.css` define no `fontFamily`, so the app runs on the browser's default `ui-sans-serif`/system-font stack. That's not wrong for "clean and functional, not playful, not corporate," but it is also the literal absence of a decision. The brief notes the current implementation reads as "dull" and that "there is room for a considered visual identity without adding complexity" — picking one legible sans-serif and setting deliberate weight/size steps for hierarchy is the lowest-effort lever available for addressing that complaint without touching layout or adding UI complexity.
- The base palette (backgrounds, borders, the single primary blue) is genuinely calm and on-brief, and should be treated as the template — the category badges are the one surface where the app breaks its own restraint, and they happen to be the highest-visibility surface (every row, every screen) for it to happen on.

---

### Summary

The core "type it in fast" screen (Lisa kulu) and the browse screen (Ajalugu) are the two most-used flows and both currently violate the product's own headline design principles — Ajalugu's edit/delete adjacency and touch-target size undercut the explicit "never within the same fingertip reach" rule, and Lisa kulu's unconditional, top-of-form receipt button undercuts both "privacy by default" and "must feel instant." Positives are real: the post-save highlight, the numeric input handling, and the overall restrained visual tone are executed well and should be the template going forward. This is not ready to build further features on top of as-is — the edit/delete separation and the History filter row cramping should be fixed before Hoolduspäevik adds a fourth nav tab and a fourth data-entry form, since both problems compound with more content in the same tight mobile layout. I'd class this as needing a short, targeted design pass (roughly a day of rework) rather than a full redesign.
