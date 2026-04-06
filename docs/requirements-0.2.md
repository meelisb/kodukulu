# Requirements: Kodukulu

*Last updated: 05 April 2026*

---

## Table of Contents

### Built — v0.1

- [E-01: Add Expense](requirements-0.2.md#e-01-add-expense)
- [E-02: Edit Expense](requirements-0.2.md#e-02-edit-expense)
- [E-03: Delete Expense](requirements-0.2.md#e-03-delete-expense)
- [E-04: Import Receipt](requirements-0.2.md#e-04-import-receipt)
- [R-01: Browse and Filter Expenses — Ajalugu](requirements-0.2.md#r-01-browse-and-filter-expenses--ajalugu)
- [R-02: Export Filtered Expenses as CSV](requirements-0.2.md#r-02-export-filtered-expenses-as-csv)
- [S-01: View Spending Summary — Kokkuvõte](requirements-0.2.md#s-01-view-spending-summary--kokkuvõte)
- [I-01: Install App on Android Home Screen](requirements-0.2.md#i-01-install-app-on-android-home-screen)

### Planned — Iteration 1 (P0)

- [E-05: Post-Save Entry Confirmation](requirements-0.2.md#e-05-post-save-entry-confirmation)
- [R-03: Search Expenses by Text](requirements-0.2.md#r-03-search-expenses-by-text)
- [R-04: Sort Expenses by Date](requirements-0.2.md#r-04-sort-expenses-by-date)
- [R-05: Filter and Summarise by Vendor](requirements-0.2.md#r-05-filter-and-summarise-by-vendor)
- [S-02: Vendor Breakdown in Kokkuvõte](requirements-0.2.md#s-02-vendor-breakdown-in-kokkuvõte)

### Planned — Iteration 2 (P1)

- [G-01: Manage Cost Categories](requirements-0.2.md#g-01-manage-cost-categories)
- [G-02: Reassign Before Category Deletion](requirements-0.2.md#g-02-reassign-before-category-deletion)
- [G-03: Account Authentication](requirements-0.2.md#g-03-account-authentication)
- [G-04: Default Categories on Signup](requirements-0.2.md#g-04-default-categories-on-signup)
- [I-02: Separate Dev and Production Databases](requirements-0.2.md#i-02-separate-dev-and-production-databases)
- [M-05: Manage Maintenance Types Vocabulary](requirements-0.2.md#m-05-manage-maintenance-types-vocabulary)
- [R-06: Filter and Summarise by Tag](requirements-0.2.md#r-06-filter-and-summarise-by-tag)
- [R-07: Multi-Dimension Filter Panel](requirements-0.2.md#r-07-multi-dimension-filter-panel)
- [S-03: Year-over-Year Spending Comparison](requirements-0.2.md#s-03-year-over-year-spending-comparison)
- [T-01: Assign Tags to Costs](requirements-0.2.md#t-01-assign-tags-to-costs)
- [T-02: Tag Fuel Costs for Dedicated Analysis](requirements-0.2.md#t-02-tag-fuel-costs-for-dedicated-analysis)
- [T-03: Use Tags to Handle Category Overlap](requirements-0.2.md#t-03-use-tags-to-handle-category-overlap)
- [T-04: Manage Tags](requirements-0.2.md#t-04-manage-tags)

### Planned — Iteration 3 (P2)

- [C-01: Annual Fuel Consumption Summary](requirements-0.2.md#c-01-annual-fuel-consumption-summary)
- [C-02: Litres per 100 km](requirements-0.2.md#c-02-litres-per-100-km)
- [C-03: Cost per Kilometre](requirements-0.2.md#c-03-cost-per-kilometre)
- [C-04: Record Odometer Readings](requirements-0.2.md#c-04-record-odometer-readings)
- [E-07: Multi-Line Invoice Entry](requirements-0.2.md#e-07-multi-line-invoice-entry)
- [E-08: Create Maintenance Event During Cost Entry](requirements-0.2.md#e-08-create-maintenance-event-during-cost-entry)
- [M-01: Look Up Last Maintenance Event](requirements-0.2.md#m-01-look-up-last-maintenance-event)
- [M-02: Browse Full Maintenance History](requirements-0.2.md#m-02-browse-full-maintenance-history)
- [M-03: Create Standalone Maintenance Event](requirements-0.2.md#m-03-create-standalone-maintenance-event)
- [M-04: Navigate Between Linked Cost and Maintenance Event](requirements-0.2.md#m-04-navigate-between-linked-cost-and-maintenance-event)

### Planned — Iteration 4 (P3)

- [C-05: Full Car Ownership Dashboard](requirements-0.2.md#c-05-full-car-ownership-dashboard)
- [G-05: Export Data and Delete Account](requirements-0.2.md#g-05-export-data-and-delete-account)
- [G-06: Public Demo Mode](requirements-0.2.md#g-06-public-demo-mode)
- [I-03: Open Source Repository](requirements-0.2.md#i-03-open-source-repository)
- [I-04: Abuse Prevention](requirements-0.2.md#i-04-abuse-prevention)
- [I-05: GDPR Compliance](requirements-0.2.md#i-05-gdpr-compliance)
- [M-06: Overdue Maintenance Reminders](requirements-0.2.md#m-06-overdue-maintenance-reminders)
- [R-08: Sort Expenses by Amount](requirements-0.2.md#r-08-sort-expenses-by-amount)
- [S-04: Chart-Based Spending Overview](requirements-0.2.md#s-04-chart-based-spending-overview)
- [T-05: Tag Breakdown in Kokkuvõte](requirements-0.2.md#t-05-tag-breakdown-in-kokkuvõte)

---

## E-01: Add Expense

Priority: P0

**Job Story:** When I have just made a purchase, I want to enter the expense details quickly on my phone, so that the record is captured before I leave the shop.

**Notes:** Date defaults to today. Fuel liters field only visible when category is Auto. Vendor and description fields offer autocomplete from previously entered values. Cancel resets the form.

**Acceptance Criteria:**

```gherkin
Feature: Add expense

  Background:
    Given I am on the Lisa kulu screen

  Scenario: Happy path — save a basic expense
    When I enter date "15.03.2025", vendor "Bauhof", description "Krunt", category "Ehitus", amount "34.50"
    And I tap Salvesta
    Then the expense is saved
    And I am returned to Ajalugu
    And the new entry is visible at the top of the list

  Scenario: Date defaults to today
    Then the date field should show today's date

  Scenario: Fuel liters field hidden by default
    Then the kütusekogus field should not be visible

  Scenario: Fuel liters field appears when Auto is selected
    When I select category "Auto"
    Then the kütusekogus field should become visible

  Scenario: Fuel liters field disappears when category changes away from Auto
    Given I have selected category "Auto"
    When I select category "Ehitus"
    Then the kütusekogus field should no longer be visible

  Scenario: Autocomplete suggests previous vendors
    Given I have previously saved an expense with vendor "Circle K"
    When I type "Ci" in the vendor field
    Then "Circle K" should appear as a suggestion

  Scenario: Autocomplete suggests previous descriptions
    Given I have previously saved an expense with description "Bensiin 95"
    When I type "Ben" in the description field
    Then "Bensiin 95" should appear as a suggestion

  Scenario: Save fails when required fields are missing
    When I tap Salvesta without entering vendor, category, or amount
    Then I should see a validation error
    And the form should not be submitted

  Scenario: Cancel resets the form
    Given I have entered some data in the form
    When I tap Tühista
    Then all fields should be reset to their default values

  Scenario: Save failure preserves form data
    When I tap Salvesta
    And the save operation fails due to a network error
    Then I should remain on Lisa kulu
    And I should see an error message
    And all entered data should still be in the form fields

  Scenario: Success message does not block navigation
    When I save an expense successfully
    Then a success message should appear above the navigation bar
    And the bottom navigation tabs should remain tappable
```

---

## E-02: Edit Expense

Priority: P0

**Job Story:** When I have made an error in a saved expense, I want to edit it in place, so that my records stay accurate without deleting and re-entering.

**Notes:** Edit form is identical to add form. Date must default to the saved date, not today. Cancel closes the modal without saving. The fuel liters field follows the same conditional visibility rule as in E-01.

**Acceptance Criteria:**

```gherkin
Feature: Edit expense

  Background:
    Given I am on the Ajalugu screen
    And there is at least one saved expense

  Scenario: Edit button is visible per entry
    Then each expense entry should show an edit button
    And the edit button should not overlap with the delete button

  Scenario: Edit form opens pre-filled
    When I tap the edit button on an expense
    Then a form should open with all fields pre-filled with the saved values

  Scenario: Date pre-fills with saved date not today
    Given a saved expense has date "10.01.2024"
    When I open that expense for editing
    Then the date field should show "10.01.2024"

  Scenario: Save updated expense
    Given I have opened an expense for editing
    When I change the amount to "99.00"
    And I tap Salvesta
    Then the expense should be updated
    And the modal should close
    And the updated amount should be visible in the list

  Scenario: Cancel closes modal without saving
    Given I have opened an expense for editing
    When I change the amount to "999.00"
    And I tap Tühista
    Then the modal should close
    And the original amount should still be shown in the list

  Scenario: Edit Auto expense shows fuel liters field
    Given a saved expense has category "Auto" and kütusekogus "48.5"
    When I open that expense for editing
    Then the kütusekogus field should be visible and show "48.5"

  Scenario: Changing category away from Auto hides fuel liters in edit form
    Given I am editing an Auto expense
    When I change the category to "Majapidamine"
    Then the kütusekogus field should no longer be visible

  Scenario: Edit save failure preserves modal
    Given I have opened an expense for editing
    When I change a field and tap Salvesta
    And the save operation fails due to a network error
    Then the modal should remain open
    And I should see an error message
    And my changes should still be in the form fields
```

---

## E-03: Delete Expense

Priority: P0

**Job Story:** When I have entered a duplicate or incorrect expense, I want to delete it, so that my records stay clean.

**Notes:** Delete button must be physically separated from edit button — not reachable with the same fingertip. Deletion is irreversible. Confirmation dialog is mandatory.

**Acceptance Criteria:**

```gherkin
Feature: Delete expense

  Background:
    Given I am on the Ajalugu screen
    And there is at least one saved expense

  Scenario: Delete button is visible and separated from edit
    Then each expense entry should show a delete button
    And the delete button should be positioned far enough from the edit button that both cannot be tapped simultaneously

  Scenario: Confirmation dialog appears before deletion
    When I tap the delete button on an expense
    Then a confirmation dialog should appear
    And it should contain the text "Kas oled kindel, et soovid selle kulu kustutada?"

  Scenario: Confirming deletion removes the entry
    Given the confirmation dialog is open
    When I confirm deletion
    Then the expense should be removed from the list
    And the confirmation dialog should close

  Scenario: Cancelling deletion preserves the entry
    Given the confirmation dialog is open
    When I tap cancel
    Then the expense should remain in the list
    And the confirmation dialog should close

  Scenario: Deleting last entry shows empty state
    Given there is exactly one expense in the list
    When I delete it and confirm
    Then the list should show an empty state message in Estonian
```

---

## E-04: Import Receipt

Priority: P1

**Job Story:** When I have a digital receipt or a photo of a paper receipt, I want to upload it and have the form pre-filled automatically, so that I avoid manual data entry for routine purchases.

**Notes:** Supports PDF and image files (jpg, png). AI extraction via Gemini 2.5 Flash through Lovable AI Gateway. Category is auto-set to Auto when fuel, car wash, or windshield fluid is detected. All pre-filled fields are editable before saving. Text extracted in all-caps should be converted to sentence case.

**Acceptance Criteria:**

```gherkin
Feature: Import receipt

  Background:
    Given I am on the Lisa kulu screen

  Scenario: Upload button is visible on the form
    Then I should see a button to upload a receipt
    And it should accept PDF, jpg, and png files

  Scenario: Happy path — PDF receipt
    When I upload a receipt PDF
    Then the vendor field should be pre-filled with the station name
    And the date field should be pre-filled with the receipt date
    And the amount field should be pre-filled with the total paid
    And the kütusekogus field should be pre-filled with the fuel liters
    And the category should be set to "Auto"

  Scenario: Happy path — photo of paper receipt
    When I upload a photo of a retail receipt
    Then the vendor, date, amount, and description fields should be pre-filled with extracted values

  Scenario: All-caps text is converted to sentence case
    Given a receipt contains vendor name "BAUHOF"
    When the form is pre-filled from the receipt
    Then the vendor field should show "Bauhof" not "BAUHOF"

  Scenario: User can edit pre-filled fields before saving
    Given the form has been pre-filled from a receipt
    When I change the description field
    And I tap Salvesta
    Then the saved expense should contain my edited description

  Scenario: Category not auto-set for non-Auto receipts
    When I upload a receipt from a hardware store
    Then the category field should remain unset
    And I should be required to select a category before saving

  Scenario: Upload fails gracefully
    When I upload a file that cannot be parsed
    Then I should see an error message in Estonian
    And the form fields should remain empty and editable

  Scenario: Partial extraction still helps
    When the AI can extract vendor and amount but not date
    Then vendor and amount should be pre-filled
    And the date field should default to today
```

---

## R-01: Browse and Filter Expenses — Ajalugu

Priority: P0

**Job Story:** When I want to find a specific past expense, I want to browse and filter my expense history by year and category, so that I can locate any entry without scrolling through everything.

**Notes:** Default sort is newest first. Both filters are independent dropdowns. Empty state shown when no results match. Filters persist while navigating within Ajalugu.

**Acceptance Criteria:**

```gherkin
Feature: Browse and filter expenses

  Background:
    Given I am on the Ajalugu screen
    And I have expenses across multiple years and categories

  Scenario: Expenses shown newest first by default
    Then expenses should be listed in descending date order

  Scenario: Filter by year
    When I select year "2024" from the year filter
    Then only expenses from 2024 should be displayed

  Scenario: Filter by category
    When I select "Auto" from the category filter
    Then only Auto expenses should be displayed

  Scenario: Combined year and category filter
    When I select year "2024" and category "Auto"
    Then only Auto expenses from 2024 should be displayed

  Scenario: Clearing a filter restores broader results
    Given I have filtered by year "2024"
    When I clear the year filter
    Then expenses from all years should be displayed

  Scenario: Empty state when no results match
    When I filter by a year and category combination that has no expenses
    Then I should see an empty state message in Estonian
    And no expense cards should be shown

  Scenario: Empty state on first use
    Given I have no expenses saved
    Then the Ajalugu screen should show an empty state message in Estonian
```

---

## R-02: Export Filtered Expenses as CSV

Priority: P0

**Job Story:** When I want to analyse my expenses in Excel, I want to download a CSV of the currently filtered expenses, so that I get exactly the data I am looking at without manual filtering in Excel.

**Notes:** Export respects active year and category filters. Semicolon separator for Estonian Excel locale. Columns: kuupäev, saaja, kirjeldus, kategooria, summa, kütusekogus.

**Acceptance Criteria:**

```gherkin
Feature: Export expenses as CSV

  Background:
    Given I am on the Ajalugu screen

  Scenario: Download button is visible
    Then I should see a small icon button to download CSV on the Ajalugu screen, with hover text "Laadi alla CSV"

  Scenario: Export contains all expenses when no filter active
    Given no year or category filter is active
    When I tap "Laadi alla CSV"
    Then the downloaded file should contain all saved expenses

  Scenario: Export respects year filter
    Given the year filter is set to "2024"
    When I tap "Laadi alla CSV"
    Then the downloaded file should contain only 2024 expenses

  Scenario: Export respects category filter
    Given the category filter is set to "Auto"
    When I tap "Laadi alla CSV"
    Then the downloaded file should contain only Auto expenses

  Scenario: Export respects combined filters
    Given year filter is "2024" and category filter is "Auto"
    When I tap "Laadi alla CSV"
    Then the downloaded file should contain only Auto expenses from 2024

  Scenario: CSV columns are correct
    When I open the downloaded CSV
    Then it should contain columns: kuupäev, saaja, kirjeldus, kategooria, summa, kütusekogus
    And values should be separated by semicolons

  Scenario: Export with no matching results
    Given the active filters return no expenses
    When I tap "Laadi alla CSV"
    Then the downloaded file should contain only the header row
```

---

## S-01: View Spending Summary — Kokkuvõte

Priority: P0

**Job Story:** When I want to understand how much I have spent by category in a given year, I want to see a summary table grouped by category with a total, so that I get a quick financial overview without opening Excel.

**Notes:** Year filter controls which data is summarised. All categories shown even if total is zero. Grand total shown at the bottom.

**Acceptance Criteria:**

```gherkin
Feature: View spending summary

  Background:
    Given I am on the Kokkuvõte screen

  Scenario: All categories shown with totals
    Given I have expenses in year "2025"
    When I select year "2025"
    Then I should see a row for each category
    And each row should show the category name and total amount in euros

  Scenario: Categories with no expenses show zero
    Given category "Sisustus" has no expenses in "2025"
    When I select year "2025"
    Then "Sisustus" should appear with total "0.00"

  Scenario: Grand total matches sum of category totals
    When I view the summary for any year
    Then the Kokku row should equal the sum of all category totals

  Scenario: Summary updates when year changes
    Given I am viewing the summary for "2025"
    When I change the year filter to "2024"
    Then all category totals should update to reflect 2024 data

  Scenario: Empty state before year is selected
    Given no year filter is selected
    Then the summary should prompt me to select a year
    Or show totals across all years

  Scenario: New expense immediately reflected in summary
    Given I am viewing the summary for "2025"
    When I add a new expense in category "Auto" for "50.00" in year "2025"
    And I return to Kokkuvõte
    Then the Auto total should have increased by "50.00"
```

---

## I-01: Install App on Android Home Screen

Priority: P0

**Job Story:** When I want to use Kodukulu on my phone, I want to install it to my Android home screen as a PWA, so that I can open it with one tap like a native app.

**Notes:** Requires valid PWA manifest with correct icon sizes, background color, and maskable icon support. App name on home screen should be "Kodukulu".

**Acceptance Criteria:**

```gherkin
Feature: PWA installation on Android

  Scenario: App is installable from Chrome on Android
    Given I open the Kodukulu URL in Chrome on Android
    Then Chrome should offer an "Add to Home Screen" option
    Or the browser should show an install prompt

  Scenario: Home screen icon displays correctly
    Given I have installed Kodukulu to my home screen
    Then the icon should display with the correct Kodukulu graphic
    And the icon should not appear as a plain white square

  Scenario: App name shown correctly on home screen
    Then the label under the icon should read "Kodukulu"

  Scenario: App opens full screen without browser chrome
    When I tap the Kodukulu icon on my home screen
    Then the app should open in full screen mode
    And the browser address bar should not be visible
```

---

## E-05: Post-Save Entry Confirmation

Priority: P0

**Job Story:** When I save a new cost, I want to see the fully rendered cost card in context among my other entries, so that I can immediately confirm the data is correct without navigating manually.

**Notes:** Redirect to Ajalugu after save with the new entry highlighted. Highlight should be immediately visible without scrolling. Fades after a few seconds.

**Acceptance Criteria:**

```gherkin
Feature: Post-save entry confirmation

  Background:
    Given I am on the Lisa kulu screen

  Scenario: Redirected to Ajalugu after save
    When I enter a valid expense and tap Salvesta
    Then I should be redirected to the Ajalugu screen

  Scenario: New entry is highlighted in the list
    When I save a new expense
    Then the new entry should be visually highlighted among other entries
    And the highlight should be visible immediately without scrolling

  Scenario: Highlight fades after a short delay
    Given I have just saved an expense and been redirected to Ajalugu
    When approximately 3 seconds pass
    Then the visual highlight should fade out
    And the entry should remain in the list without highlighting

  Scenario: Highlighted entry is the correct entry
    Given I save an expense with vendor "Maxima" for "12.50"
    When I am redirected to Ajalugu
    Then the highlighted entry should show vendor "Maxima" and amount "12.50"

  Scenario: New entry appears in correct position according to current sort order
    Given the Ajalugu sort order is descending (newest first)
    When I save a cost with today's date
    Then the new cost should appear at the top of the list
    And should be highlighted

  Scenario: Ajalugu filters are set to show the new entry
    Given the year filter on Ajalugu was previously set to "2024"
    When I save a cost with date in 2025
    Then the Ajalugu view should adjust filters to show the year of the new cost
    And the new cost should be visible and highlighted

  Scenario: Save failure does not redirect
    When I tap the save button
    And the cost creation fails (e.g. network error)
    Then I should remain on the Lisa kulu view
    And I should see an error message
    And the form data should be preserved
```

---

## R-03: Search Expenses by Text

Priority: P0

**Job Story:** When I remember a specific purchase but cannot find it by scrolling, I want to search costs by vendor name or description text, so that I can locate any cost entry within seconds.

**Notes:** Free-text search. Works in combination with existing year, category, and vendor filters.

**Acceptance Criteria:**

```gherkin
Feature: Search expenses by text

  Background:
    Given I am on the Ajalugu screen
    And I have expenses with various vendors and descriptions

  Scenario: Search field is visible on Ajalugu
    Then I should see a text search field on the Ajalugu screen

  Scenario: Search by vendor name
    Given I have an expense with vendor "Bauhof"
    When I type "Bauhof" in the search field
    Then only expenses matching "Bauhof" in vendor or description should be displayed

  Scenario: Partial match works
    When I type "Bau" in the search field
    Then expenses with vendor "Bauhof" should be included in results

  Scenario: Search is case-insensitive
    When I type "bauhof" in the search field
    Then expenses with vendor "Bauhof" should be included in results

  Scenario: Search combined with year filter
    Given the year filter is set to "2024"
    When I type "Circle K" in the search field
    Then only "Circle K" expenses from 2024 should be displayed

  Scenario: Search combined with category filter
    Given the category filter is set to "Auto"
    When I type "bensiin" in the search field
    Then only Auto expenses containing "bensiin" in vendor or description should be displayed

  Scenario: No results shows empty state
    When I search for text that matches no expenses
    Then I should see an empty state message in Estonian
    And no expense cards should be shown

  Scenario: Clearing search restores filtered list
    Given I have typed a search term
    When I clear the search field
    Then all expenses matching the active year and category filters should be displayed
```

---

## R-04: Sort Expenses by Date

Priority: P0

**Job Story:** When I want to see my most recent or oldest costs first, I want to toggle the sort order of the cost list by date (ascending or descending), so that I can orient the list to my current task.

**Notes:** Default is descending (newest first). Design the sort control generically to support amount sort later (R-08).

**Acceptance Criteria:**

```gherkin
Feature: Sort expenses by date

  Background:
    Given I am on the Ajalugu screen
    And I have expenses on multiple different dates

  Scenario: Default sort is newest first
    Then expenses should be listed in descending date order

  Scenario: Sort toggle is visible
    Then I should see a sort control on the Ajalugu screen

  Scenario: Toggle to ascending order
    When I select ascending date sort
    Then expenses should be listed in ascending date order (oldest first)

  Scenario: Toggle back to descending order
    Given the list is sorted ascending
    When I select descending date sort
    Then expenses should be listed in descending date order (newest first)

  Scenario: Sort persists when filters change
    Given I have switched to ascending sort
    When I apply a year filter
    Then the filtered results should still be in ascending date order

  Scenario: Sort order persists with active search
    Given I have toggled sort to ascending order
    And I have typed "Coop" in the search field
    Then the matching costs should be displayed in ascending date order

  Scenario: Sort indicator shows current direction
    Then the sort control should visually indicate whether the current order is ascending or descending
```

---

## R-05: Filter and Summarise by Vendor

Priority: P0

**Job Story:** When I want to understand how much I have paid a specific vendor, I want to filter costs by vendor and see a summary total for that vendor within the active year and category filters, so that I get a quick financial picture per vendor.

**Notes:** Vendor list derived from existing cost data. Summary shows entry count and total amount.

**Acceptance Criteria:**

```gherkin
Feature: Filter and summarise by vendor

  Background:
    Given I am on the Ajalugu screen
    And I have expenses from multiple vendors

  Scenario: Vendor filter is available
    Then I should see a vendor filter on the Ajalugu screen
    And the vendor list should be populated from vendors present in my cost data

  Scenario: Filter by vendor
    Given I have multiple expenses from "Circle K"
    When I select "Circle K" from the vendor filter
    Then only expenses from "Circle K" should be displayed

  Scenario: Vendor summary shows count and total
    Given I am filtering by vendor "Circle K"
    Then I should see a summary showing the count of "Circle K" entries and their total amount

  Scenario: Vendor filter combined with year filter
    Given the year filter is set to "2024"
    When I select vendor "Circle K"
    Then only "Circle K" expenses from 2024 should be shown
    And the summary should reflect the count and total for 2024 only

  Scenario: Vendor filter combined with category filter
    Given the category filter is set to "Auto"
    When I select vendor "Circle K"
    Then only "Circle K" expenses in category Auto should be shown

  Scenario: Vendor filter works alongside search
    Given I have selected "Circle K" from the vendor filter
    When I type "tankimine" in the search field
    Then only Circle K costs with description containing "tankimine" should be displayed
    And the vendor summary should update to reflect the filtered subset

  Scenario: Vendor list updates when other filters change
    Given the year filter is set to "2024" and category filter is set to "Majapidamine"
    Then the vendor dropdown should only list vendors that have expenses in 2024 and in category "Majapidamine"

  Scenario: Clearing vendor filter restores full list
    Given vendor filter is set to "Circle K"
    When I clear the vendor filter
    Then all expenses matching remaining active filters should be displayed
    And the vendor summary line should no longer be visible
```

---

## S-02: Vendor Breakdown in Kokkuvõte

Priority: P0

**Job Story:** When I view the Kokkuvõte for a year and category, I want to also see a vendor breakdown within that selection, so that I understand where money goes at a more granular level than category alone.

**Notes:** Vendor subtotals within the active year. Extends the existing category-only Kokkuvõte view.

**Acceptance Criteria:**

```gherkin
Feature: Vendor breakdown in spending summary

  Background:
    Given I am on the Kokkuvõte screen
    And I have selected a year

  Scenario: Vendor breakdown is visible within a selected category
    When I view the breakdown for category "Auto"
    Then I should see a vendor breakdown section in this category
    And each vendor should show the total amount spent with them in the selected year

  Scenario: Vendor breakdown respects year filter
    When I change the year filter to "2023"
    Then the vendor breakdown should update to show vendors and totals for 2023 only

  Scenario: Vendors sorted by total descending
    Then vendors in the breakdown should be listed from highest to lowest total

  Scenario: No vendor appears with zero total
    Then only vendors with at least one expense in the selected period should appear in the breakdown

  Scenario: Vendor totals sum to category total
    Given I am viewing category "Auto" for year "2024"
    Then the sum of all vendor totals in the breakdown should equal the Auto category total for 2024

    Scenario: Vendor breakdown does not clutter the default view
    Given I am viewing the Kokkuvõte summary
    Then the vendor breakdown should be accessible per category (e.g. expandable or drill-down)
    And the top-level view should still primarily show category totals
```

---

## G-01: Manage Cost Categories

Priority: P1

**Job Story:** When I want to adapt the app to my specific household, I want to create, rename, and reorder cost categories, so that the category list reflects my actual spending domains.

**Notes:** Categories are user-defined, not hardcoded. New users receive a default starter set on account creation (see G-04).

**Acceptance Criteria:**

```gherkin
Feature: Manage cost categories

  Background:
    Given I am on the Seaded screen

  Scenario: Category list is visible in Settings
    Then I should see a list of my current cost categories

  Scenario: Create a new category
    When I tap to add a new category and enter name "Reisimine"
    And I save
    Then "Reisimine" should appear in the category list
    And it should be available as a category when entering a new expense

  Scenario: Rename a category
    Given category "Sisustus" exists
    When I tap to rename it and enter "Interjöör"
    And I save
    Then "Interjöör" should appear in the category list
    And "Sisustus" should no longer appear
    And existing expenses previously labelled "Sisustus" should now show "Interjöör"

  Scenario: Reorder categories
    When I drag a category to a new position in the list
    Then the category list should reflect the new order
    And the order should persist on next visit

  Scenario: Cannot create duplicate category name
    Given category "Auto" exists
    When I try to create a new category named "Auto"
    Then I should see a validation error
    And the duplicate should not be created

  Scenario: Cannot create category with empty name
    When I try to save a category with an empty name
    Then I should see a validation error
```

---

## G-02: Reassign Before Category Deletion

Priority: P1

**Job Story:** When I delete a category that has costs assigned to it, I want to be required to reassign those costs to another category before deletion completes, so that no cost is left without a category and reporting stays consistent.

**Notes:** Same reassignment pattern applies to tag deletion (T-04) and maintenance type deletion (M-05).

**Acceptance Criteria:**

```gherkin
Feature: Reassign costs before category deletion

  Background:
    Given I am on the Seaded screen

  Scenario: Can delete category with no costs
    Given category "Testkategooria" has no costs assigned
    When I delete "Testkategooria"
    Then the category should be removed immediately without a reassignment step

  Scenario: Deletion of category in use triggers reassignment
    Given category "Aed" has 5 costs assigned
    When I tap delete on "Aed"
    Then I should see a warning that 5 costs will need reassignment
    And I should be prompted to select a replacement category

  Scenario: Reassignment completes deletion
    Given I have chosen "Majapidamine" as the replacement for "Aed"
    When I confirm
    Then all 5 formerly "Aed" costs should now be assigned to "Majapidamine"
    And "Aed" should be removed from the category list

  Scenario: Cannot select the category being deleted as replacement
    When I am on the reassignment screen for "Aed"
    Then "Aed" should not appear as an option in the replacement dropdown

  Scenario: Cancelling deletion leaves everything unchanged
    Given the reassignment dialog is open
    When I tap cancel
    Then the category should not be deleted
    And no costs should have been reassigned
```

---

## G-03: Account Authentication

Priority: P1

**Job Story:** When I use the app, I want to authenticate with my account, so that my data is private and no one else can see or modify my costs.

**Notes:** Supabase Auth with email/password minimum. Row-level security on all tables. user_id on every data table.

**Acceptance Criteria:**

```gherkin
Feature: Account authentication

  Scenario: Unauthenticated user cannot access app data
    Given I am not logged in
    When I navigate to any protected screen
    Then I should be redirected to the login screen

  Scenario: Sign up with email and password
    Given I am on the login screen
    When I tap "Loo konto"
    And I enter a valid email and password and confirm
    Then my account should be created
    And I should be logged in and taken to the main app

  Scenario: Log in with existing credentials
    Given I have an existing account
    When I enter my email and password and tap "Logi sisse"
    Then I should be authenticated
    And I should see my existing data

  Scenario: Invalid credentials show error
    When I enter an incorrect password and tap "Logi sisse"
    Then I should see an error message in Estonian
    And I should remain on the login screen

  Scenario: Users cannot see each other's data
    Given two users A and B each have expenses
    When user A is logged in
    Then user A should see only their own expenses
    And no expenses from user B should be visible or accessible

  Scenario: Log out
    When I log out
    Then I should be taken to the login screen
    And subsequent navigation to protected screens should require login again
```

---

## G-04: Default Categories on Signup

Priority: P1

**Job Story:** When I am a new user setting up the app for the first time, I want to start with a sensible default set of categories, so that I can begin entering costs immediately and customise later.

**Acceptance Criteria:**

```gherkin
Feature: Default categories on signup

  Background:
    Given I have just created a new account

  Scenario: Default categories are present after signup
    When I navigate to the expense entry form
    Then I should see a pre-populated list of default categories including at least: Auto, Majapidamine, Toidukaubad
    And I should not need to create any categories before entering my first expense

  Scenario: Default categories are editable
    When I navigate to Seaded
    Then the default categories should be listed
    And I should be able to rename, reorder, or delete them like any other category

  Scenario: New user has no expenses
    When I navigate to Ajalugu
    Then I should see an empty state message in Estonian
    And no expenses should be shown
```

---

## I-02: Separate Dev and Production Databases

Priority: P1

**Job Story:** When I develop the app, I want separate development and production databases, so that test data never appears in my live app and I can experiment safely.

**Notes:** Two Supabase projects with environment variables. Dev in Lovable preview, prod at public URL.

**Acceptance Criteria:**

```gherkin
Feature: Separate dev and production databases

  Scenario: Development environment uses dev database
    Given the app is running in development or preview mode
    Then all database reads and writes should target the development Supabase project

  Scenario: Production environment uses prod database
    Given the app is deployed to the production URL
    Then all database reads and writes should target the production Supabase project

  Scenario: Dev data does not appear in production
    Given I have added test entries in the dev environment
    When I check the production environment
    Then those test entries should not be present

  Scenario: Environment selected via environment variable
    Then the database connection URL should be configurable via an environment variable
    And no credentials should be hardcoded in the source code
```

---

## M-05: Manage Maintenance Types Vocabulary

Priority: P1

**Job Story:** When I want a consistent vocabulary for maintenance activities, I want a managed list of maintenance types with pre-defined names and optional default intervals, so that lookup and grouping works reliably.

**Notes:** Starter set seeded on account creation: auto hooldus, auto rehvivahetus, kanalisatsiooni tühjendamine, ventilatsiooni filter. Deletion follows the same reassignment pattern as category deletion (G-02).

**Acceptance Criteria:**

```gherkin
Feature: Manage maintenance types vocabulary

  Background:
    Given I am on the Seaded screen

  Scenario: Maintenance types list is visible
    Then I should see a section for maintenance types
    And it should list all currently defined maintenance types

  Scenario: Default maintenance types are present on first use
    Given I have just created a new account
    Then the maintenance types list should include at minimum: auto hooldus, auto rehvivahetus, ventilatsiooni filter

  Scenario: Create a new maintenance type
    When I tap to add a maintenance type and enter name "Katuse kontroll"
    And I optionally set a default interval of "12" months
    And I save
    Then "Katuse kontroll" should appear in the maintenance types list
    And it should be selectable when creating a maintenance event

  Scenario: Edit maintenance type name
    Given maintenance type "Auto rehvivahetus" exists
    When I rename it to "Rehvivahetus"
    Then "Rehvivahetus" should appear in the list
    And existing events of that type should reflect the new name

  Scenario: Set or update default interval
    When I set the default interval on a maintenance type to "6" months
    Then the interval should be saved and shown on the maintenance type

  Scenario: Cannot create duplicate maintenance type name
    When I try to create a maintenance type with a name that already exists
    Then I should see a validation error

  Scenario: Delete maintenance type with no events — immediate
    Given a maintenance type has no linked events
    When I delete it
    Then it should be removed without a reassignment step

  Scenario: Delete maintenance type in use — requires reassignment
    Given maintenance type "Auto hooldus" has linked events
    When I try to delete it
    Then I should be required to choose a replacement type
    And only after confirming reassignment should the type be deleted and events reassigned
```

---

## R-06: Filter and Summarise by Tag

Priority: P1

**Job Story:** When I want to analyse a cross-cutting spending group (e.g. all fuel costs, or all garden planting costs), I want to filter and summarise costs by one or more tags, so that I can understand spending on topics that do not align with a single category.

**Notes:** Tags are many-to-many. A cost can have multiple tags. Tags span categories.

**Acceptance Criteria:**

```gherkin
Feature: Filter and summarise by tag

  Background:
    Given I am on the Ajalugu screen
    And I have expenses with various tags assigned

  Scenario: Tag filter is available
    Then I should see a tag filter option on the Ajalugu screen

  Scenario: Filter by a single tag
    Given I have expenses tagged "Kütus"
    When I select tag "Kütus" from the tag filter
    Then only expenses tagged "Kütus" should be displayed

  Scenario: Filter by multiple tags
    When I select tags "Kütus" and "Reisimine"
    Then expenses tagged with either "Kütus" or "Reisimine" should be displayed

  Scenario: Tag filter combined with category filter
    Given I filter by category "Auto" and tag "Kütus"
    Then only Auto expenses tagged "Kütus" should be shown

  Scenario: Tag summary shown when tag filter is active
    Given I am filtering by tag "Kütus"
    Then I should see a total amount for all expenses matching the active filters

  Scenario: Clearing tag filter restores broader results
    Given tag filter "Kütus" is active
    When I clear the tag filter
    Then all expenses matching remaining active filters should be shown

  Scenario: No results when tag has no matching expenses in current filters
    When I filter by a tag that matches no expenses in the current year and category
    Then I should see an empty state message in Estonian
```

---

## R-07: Multi-Dimension Filter Panel

Priority: P1

**Job Story:** When I want to combine multiple filter dimensions at once (year + category + vendor + tag + search text), I want a filter panel that scales to additional dimensions without cluttering the main view, so that the interface remains usable on mobile as filters grow.

**Notes:** Collapsible filter panel or bottom sheet. Active filters shown as removable chips.

**Acceptance Criteria:**

```gherkin
Feature: Multi-dimension filter panel

  Background:
    Given I am on the Ajalugu screen

  Scenario: Filter panel contains all filter dimensions
    When I open the filter panel
    Then I should see controls for: year, category, vendor, tag, and search text

  Scenario: Filter panel is collapsible
    When I close the filter panel
    Then the filter controls should be hidden from the main view
    And the expense list should take up the full available space

  Scenario: Active filters shown as removable chips
    Given I have applied a year filter and a tag filter
    Then I should see a chip or badge for each active filter
    And each chip should have a remove button

  Scenario: Removing a chip clears that filter
    When I tap the remove button on the year filter chip
    Then the year filter should be cleared
    And the expense list should update accordingly

  Scenario: Clear all filters at once
    Given multiple filters are active
    When I tap to clear all filters
    Then all filters should be cleared simultaneously
    And the full expense list should be shown

  Scenario: Active filter count shown on closed panel
    Given two filters are active and the filter panel is collapsed
    Then the panel toggle should show a count badge of "2"
```

---

## S-03: Year-over-Year Spending Comparison

Priority: P1

**Job Story:** When I want to compare spending across years, I want to see year-over-year totals by category side by side, so that I can identify trends.

**Acceptance Criteria:**

```gherkin
Feature: Year-over-year spending comparison

  Background:
    Given I am on the Kokkuvõte screen
    And I have expenses in at least two different years

  Scenario: Year-over-year comparison is accessible
    Then I should see an option to switch to or access a multi-year comparison view

  Scenario: Category totals shown for multiple years
    When I view the year-over-year comparison
    Then each category should show totals for each available year in columns side by side

  Scenario: Missing year shows zero not blank
    Given category "Aed" has expenses in 2024 but not in 2023
    When I view the comparison
    Then the 2023 column for "Aed" should show "0.00"

  Scenario: Grand total per year is shown
    Then each year column should include a grand total row

  Scenario: New expense is reflected in comparison
    Given I add an expense in category "Auto" for year "2024"
    When I return to the comparison view
    Then the 2024 Auto total should reflect the new entry
```

---

## T-01: Assign Tags to Costs

Priority: P1

**Job Story:** When I create or edit a cost, I want to assign one or more tags from a managed list, so that I can classify costs along dimensions beyond category and vendor.

**Notes:** Tags table + junction table (cost_tags). Managed vocabulary prevents duplicates and typos.

**Acceptance Criteria:**

```gherkin
Feature: Assign tags to costs

  Background:
    Given I have at least one tag defined in Seaded

  Scenario: Tag selector visible on Add Expense form
    When I am on the Lisa kulu screen
    Then I should see a tag selector field

  Scenario: Select one tag during cost creation
    When I select tag "Kütus" before saving
    Then the saved cost should have tag "Kütus" assigned

  Scenario: Select multiple tags during cost creation
    When I select tags "Kütus" and "Reisimine"
    Then the saved cost should have both tags assigned

  Scenario: Tags visible in cost card on Ajalugu
    Given a cost has tag "Kütus" assigned
    When I view that cost in the Ajalugu list
    Then the tag "Kütus" should be visible on the cost card

  Scenario: Edit a cost's tags
    Given a cost has tag "Kütus" assigned
    When I edit that cost and add tag "Reisimine" and save
    Then the cost should have both "Kütus" and "Reisimine" assigned

  Scenario: Remove all tags from a cost
    Given a cost has tag "Kütus" assigned
    When I edit the cost and remove "Kütus" and save
    Then the cost should have no tags assigned

  Scenario: Tag selector shows only defined tags
    Then the tag selector should only offer tags from the managed tags list in Seaded
```

---

## T-02: Tag Fuel Costs for Dedicated Analysis

Priority: P1

**Job Story:** When I want to understand fuel spending specifically, I want to tag fuel costs and view a tag-filtered summary, so that I can separate fuel from other Auto costs without changing categories.

**Notes:** Retroactively tag existing fuel entries. Immediate value once tag filter (R-06) ships.

**Acceptance Criteria:**

```gherkin
Feature: Tag fuel costs for dedicated analysis

  Background:
    Given I have fuel expenses in the Auto category

  Scenario: Fuel costs can be tagged with "Kütus"
    When I create an Auto expense and select tag "Kütus"
    Then the saved expense should have category "Auto" and tag "Kütus"

  Scenario: Filter by Kütus tag shows only fuel costs
    When I filter Ajalugu by tag "Kütus"
    Then only expenses tagged "Kütus" should be shown
    And this may include only a subset of Auto expenses

  Scenario: Kütus tag total differs from Auto category total
    Given I have Auto expenses for fuel, service, and insurance
    And only the fuel entries are tagged "Kütus"
    When I filter by tag "Kütus"
    Then the shown total should be less than the full Auto category total

  Scenario: Retroactively tag existing fuel entries
    Given I have untagged Auto expenses that are fuel purchases
    When I edit each and assign tag "Kütus"
    Then those expenses should appear in tag-filtered results
```

---

## T-03: Use Tags to Handle Category Overlap

Priority: P1

**Job Story:** When I add a new category (e.g. Reisimine/Traveling), I want tags to resolve the overlap where a single cost belongs to multiple conceptual groups (e.g. fuel purchased during a trip), so that I do not have to choose between accurate categorisation and accurate trip cost tracking.

**Notes:** Category = primary financial domain. Tags = cross-cutting concerns. A fuel cost during a trip: category Auto, tags Kütus + Reisimine.

**Acceptance Criteria:**

```gherkin
Feature: Tags handle cross-category cost overlap

  Scenario: A cost can have one category and multiple tags
    When I create an expense with category "Auto" and tags "Kütus" and "Reisimine"
    Then the expense should appear in Auto category totals
    And it should appear when filtered by tag "Kütus"
    And it should appear when filtered by tag "Reisimine"

  Scenario: Category total is not double-counted via tags
    Given an expense has category "Auto" and tag "Reisimine"
    When I view the Kokkuvõte for Auto
    Then the expense should appear once in the Auto total, not twice

  Scenario: Tag total reflects cross-category tagging
    Given expenses in categories Auto and Majapidamine are both tagged "Reisimine"
    When I filter by tag "Reisimine"
    Then both expenses should appear in the results
    And the total should sum across both categories
```

---

## T-04: Manage Tags

Priority: P1

**Job Story:** When I want to manage my tags, I want to create, rename, and delete tags, so that my classification vocabulary stays clean over time.

**Notes:** Deletion requires reassignment of affected costs to another tag — same pattern as category deletion (G-02).

**Acceptance Criteria:**

```gherkin
Feature: Manage tags

  Background:
    Given I am on the Seaded screen

  Scenario: Tag list is visible
    Then I should see a section listing all defined tags

  Scenario: Create a new tag
    When I tap to add a tag and enter "Reisimine" and save
    Then "Reisimine" should appear in the tag list
    And it should be selectable when assigning tags to a cost

  Scenario: Cannot create duplicate tag name
    Given tag "Kütus" exists
    When I try to create another tag named "Kütus"
    Then I should see a validation error

  Scenario: Rename a tag
    When I rename tag "Kütus" to "Fuel"
    Then "Fuel" should appear in the tag list
    And existing costs tagged "Kütus" should now show tag "Fuel"

  Scenario: Delete tag with no costs — immediate
    Given tag "Testtag" has no costs assigned
    When I delete "Testtag"
    Then it should be removed immediately

  Scenario: Delete tag in use — requires reassignment
    Given tag "Kütus" is assigned to 12 costs
    When I try to delete "Kütus"
    Then I should be prompted to choose a replacement tag for those 12 costs
    And only after confirming should the tag be deleted and costs reassigned
```

---

## C-01: Annual Fuel Consumption Summary

Priority: P2

**Job Story:** When I want to understand my annual fuel consumption, I want to see total litres purchased and total fuel cost per year, so that I can track fuel spending trends.

**Notes:** Requires fuel entries tagged with "Kütus" and litres field populated.

**Acceptance Criteria:**

```gherkin
Feature: Annual fuel consumption summary

  Background:
    Given I have fuel expenses with litres values and tag "Kütus" assigned

  Scenario: Fuel summary is visible in car analytics
    When I navigate to the car analytics section of Kokkuvõte
    Then I should see total litres purchased for the selected year
    And total fuel cost for the selected year

  Scenario: Total litres aggregates all tagged Kütus entries
    Given I have three fuel entries in 2025 with litres 40, 50, and 35
    When I view the 2025 fuel summary
    Then total litres should show "125"

  Scenario: Fuel entries without litres value excluded from litre total
    Given one fuel entry has no litres value recorded
    Then it should be counted in fuel cost total but not in litre total

  Scenario: Year filter changes the summary
    When I change the year to "2024"
    Then the total litres and cost should update to reflect 2024 data only
```

---

## C-02: Litres per 100 km

Priority: P2

**Job Story:** When I want to know my average fuel consumption, I want to see litres per 100 km per year, so that I can monitor vehicle efficiency.

**Notes:** Requires mileage readings to calculate driven distance per period. Depends on C-04.

**Acceptance Criteria:**

```gherkin
Feature: Litres per 100 km calculation

  Background:
    Given I have fuel expenses with litres values and mileage readings for the selected year

  Scenario: Litres per 100 km shown in car analytics
    When I view the car analytics section for a year with both fuel entries and mileage readings
    Then I should see litres/100 km for the selected year

  Scenario: Calculation is correct
    Given driven distance in 2025 is 15,000 km
    And total litres purchased in 2025 is 1,050
    When I view the 2025 analytics
    Then litres per 100 km should show "7.0"

  Scenario: Not shown when mileage data is insufficient
    Given I have fewer than 2 mileage readings spanning the selected year
    Then the litres/100 km metric should not be shown
    Or a message should explain what data is needed
```

---

## C-03: Cost per Kilometre

Priority: P2

**Job Story:** When I want to know the true cost of driving, I want to see average cost per kilometre per year (total Auto costs ÷ driven km), so that I can make informed decisions about vehicle use.

**Notes:** Total Auto category costs divided by driven km. Depends on C-04.

**Acceptance Criteria:**

```gherkin
Feature: Cost per kilometre calculation

  Background:
    Given I have Auto category expenses and mileage readings for the selected year

  Scenario: Cost per km shown in car analytics
    When I view the car analytics section for a year with both Auto expenses and mileage readings
    Then I should see total Auto cost divided by km driven for the selected year

  Scenario: Calculation is correct
    Given total Auto expenses in 2025 is "3000.00"
    And driven distance in 2025 is 15,000 km
    Then cost per km should show "0.20"

  Scenario: Not shown when mileage data is insufficient
    Given I have fewer than 2 mileage readings spanning the selected year
    Then the cost/km metric should not be shown
    Or a message should indicate what data is missing
```

---

## C-04: Record Odometer Readings

Priority: P2

**Job Story:** When I fill up or service my car, I want to record an odometer reading on that date, so that the system can calculate driven distances between readings.

**Notes:** Separate mileage_readings table: date + km. Can be entered standalone or during cost entry.

**Acceptance Criteria:**

```gherkin
Feature: Record odometer readings

  Scenario: Odometer reading can be entered standalone
    Given I navigate to the mileage recording screen
    When I enter date "15.03.2025" and odometer reading "87500"
    And I save
    Then the reading should be stored and appear in my mileage history

  Scenario: Odometer reading can be entered during cost entry
    Given I am on the Lisa kulu screen
    When I optionally enter an odometer reading during expense entry and save the expense
    Then the odometer reading should be stored separately with the same date

  Scenario: Odometer must be a positive number
    When I try to save a reading with odometer "0" or a negative value
    Then I should see a validation error

  Scenario: Readings listed in chronological order
    When I view my mileage history
    Then readings should be listed from oldest to newest

  Scenario: Driven distance between readings is calculated
    Given I have readings of 80,000 km on 01.01.2025 and 95,000 km on 31.12.2025
    Then the system should calculate driven distance as 15,000 km for 2025
```

---

## E-07: Multi-Line Invoice Entry

Priority: P2

**Job Story:** When I receive a multi-line invoice (e.g. a supermarket receipt), I want to review each line and decide per line whether to add it as a separate cost, group it with other lines, or skip it, so that I capture the right level of detail without manual re-entry.

**Notes:** Requires receipt OCR output as structured line items. Each line gets add/group/skip controls.

**Acceptance Criteria:**

```gherkin
Feature: Multi-line invoice entry

  Background:
    Given I have uploaded a multi-line receipt via the receipt import feature

  Scenario: Individual line items are shown after OCR
    Then I should see a list of extracted line items from the receipt
    And each line should show description, quantity if present, and unit price

  Scenario: Mark a line item to add as separate cost
    When I mark line "Piim 1L" with action "Lisa eraldi"
    Then "Piim 1L" should be queued as a standalone cost entry

  Scenario: Mark multiple lines to group as one cost
    When I mark "Piim 1L" and "Mahlad 2L" with action "Grupeeri"
    Then they should be combined into a single cost entry with summed amount

  Scenario: Skip a line item
    When I mark a line with action "Jäta vahele"
    Then it should not be included in any saved cost

  Scenario: Confirm and save selected items
    When I tap to confirm
    Then all lines marked "Lisa eraldi" should be saved as individual costs
    And grouped lines should be saved as a single combined cost
    And skipped lines should not be saved

  Scenario: Default action pre-selected for all lines
    When the line items are first displayed
    Then all lines should have a default action pre-selected (e.g. "Lisa eraldi")
    So that confirming with no changes creates one cost per line
```

---

## E-08: Create Maintenance Event During Cost Entry

Priority: P2

**Job Story:** When I create a cost that also represents a maintenance event (e.g. car service, sewage emptying), I want the option to simultaneously create a linked maintenance diary entry with pre-filled data, so that I do not have to enter the same information twice.

**Notes:** Toggle or checkbox during cost entry. Pre-fills date, vendor, description into the maintenance event.

**Acceptance Criteria:**

```gherkin
Feature: Create maintenance event during cost entry

  Background:
    Given I am on the Lisa kulu screen

  Scenario: Maintenance event toggle is available on cost entry form
    Then I should see a toggle or checkbox option to also create a maintenance diary entry

  Scenario: Toggle is off by default
    Then the maintenance diary toggle should be off by default

  Scenario: Enabling toggle reveals maintenance event fields
    When I enable the maintenance diary toggle
    Then I should see a maintenance type selector
    And date and vendor should be pre-filled from the expense form

  Scenario: Saving with toggle enabled creates both records
    Given I have filled in a cost and enabled the maintenance toggle
    And I have selected maintenance type "Auto hooldus"
    When I tap Salvesta
    Then a cost record should be saved
    And a maintenance event of type "Auto hooldus" should be saved linked to that cost

  Scenario: Saving with toggle disabled creates cost only
    Given the maintenance toggle is off
    When I tap Salvesta
    Then only the cost record should be saved
    And no maintenance event should be created

  Scenario: Maintenance type is required when toggle is enabled
    Given I have enabled the maintenance toggle but not selected a type
    When I tap Salvesta
    Then I should see a validation error asking me to select a maintenance type
```

---

## M-01: Look Up Last Maintenance Event

Priority: P1

**Job Story:** When I want to know when a specific maintenance task was last done and by whom, I want to look up the most recent event of that type, so that I can plan the next occurrence or contact the same provider.

**Notes:** Core query: latest event per maintenance type. Shows date, provider, linked cost if any.

**Acceptance Criteria:**

```gherkin
Feature: Look up last maintenance event

  Background:
    Given I am on the Hoolduspäevik screen
    And I have at least one maintenance event recorded

  Scenario: Maintenance types listed with last-done date
    Then I should see a list of maintenance types
    And each type should show the date of the most recent event

  Scenario: Last-done detail shows provider
    When I view the detail of a maintenance type's last event
    Then I should see the service provider who performed the work

  Scenario: Linked cost is shown
    Given the last event for "Auto hooldus" is linked to a cost
    When I view that event
    Then I should see a reference to the associated cost record

  Scenario: Maintenance type with no events
    Given maintenance type "Katuse kontroll" has no events
    Then it should appear in the list with no date or with text "Pole tehtud"

  Scenario: Selecting a type shows its most recent event summary
    When I tap maintenance type "Auto rehvivahetus"
    Then I should see the date, provider, and linked cost of the most recent event
```

---

## M-02: Browse Full Maintenance History

Priority: P2

**Job Story:** When I want to see the full history of a recurring maintenance task (e.g. all sewage emptyings or all filter replacements), I want to browse all events of a given type in chronological order, so that I can see patterns and frequencies.

**Acceptance Criteria:**

```gherkin
Feature: Browse full maintenance history

  Background:
    Given I am on the Hoolduspäevik screen
    And maintenance type "Auto hooldus" has multiple events recorded

  Scenario: View all events for a maintenance type
    When I tap to see full history for "Auto hooldus"
    Then I should see a chronological list of all "Auto hooldus" events

  Scenario: Events shown in chronological order
    Then events should be listed from oldest to newest

  Scenario: Each event shows key details
    Then each event should show: date, service provider, description, and linked cost amount if available

  Scenario: Back navigation returns to Hoolduspäevik main view
    When I navigate back from the history view
    Then I should be on the Hoolduspäevik main screen
```

---

## M-03: Create Standalone Maintenance Event

Priority: P2

**Job Story:** When I perform a maintenance task that has no associated cost (e.g. replacing a ventilation filter from existing stock), I want to create a standalone maintenance event manually, so that the diary stays complete even without a cost trigger.

**Acceptance Criteria:**

```gherkin
Feature: Create standalone maintenance event

  Background:
    Given I am on the Hoolduspäevik screen

  Scenario: Add new event button is visible
    Then I should see a button to add a new maintenance event

  Scenario: Create a standalone event
    When I tap to add a new event
    And I select type "Ventilatsiooni filter"
    And I enter date "10.02.2025" and description "Vahetatud F7 filter"
    And I optionally enter service provider "Isetehtud"
    And I save
    Then the event should appear in the "Ventilatsiooni filter" history

  Scenario: Service provider is optional
    When I create an event without a service provider and save
    Then the event should be saved successfully

  Scenario: Maintenance type is required
    When I try to save without selecting a maintenance type
    Then I should see a validation error

  Scenario: Event has no cost link when created standalone
    Given the event was created standalone
    Then the event record should have no linked cost
```

---

## M-04: Navigate Between Linked Cost and Maintenance Event

Priority: P2

**Job Story:** When a cost entry automatically creates a linked maintenance event, I want to see the link from both sides: the cost shows its maintenance record, and the maintenance event shows its cost, so that I can navigate between financial and operational views of the same real-world event.

**Notes:** Bidirectional navigation via cost_id FK on maintenance_events.

**Acceptance Criteria:**

```gherkin
Feature: Navigate between linked cost and maintenance event

  Background:
    Given a cost entry and a maintenance event are linked to each other

  Scenario: Cost card shows link to maintenance event
    When I view the linked cost in Ajalugu
    Then I should see a reference or link to the associated maintenance event

  Scenario: Tapping cost link navigates to maintenance event
    When I tap the maintenance event link on the cost card
    Then I should be taken to that event in Hoolduspäevik

  Scenario: Maintenance event shows linked cost
    When I view the maintenance event in Hoolduspäevik
    Then I should see the linked cost's amount, vendor, and date

  Scenario: Tapping maintenance link navigates to cost
    When I tap the cost link on the maintenance event
    Then I should be taken to that cost entry in Ajalugu or its detail should open
```

---

## C-05: Full Car Ownership Dashboard

Priority: P3

**Job Story:** When I want a comprehensive car dashboard, I want to see fuel, maintenance, insurance, and total ownership costs in one view with year-over-year trends, so that I have a complete picture of vehicle economics.

**Notes:** Aggregates Auto category by tags: Kütus, Hooldus, Kindlustus, etc. Depends on C-01 through C-04.

**Acceptance Criteria:**

```gherkin
Feature: Full car ownership dashboard

  Background:
    Given I navigate to the car analytics section

  Scenario: Dashboard aggregates Auto costs by tag
    Then I should see breakdowns for each Auto-related tag (e.g. Kütus, Hooldus, Kindlustus)
    And each tag should show annual totals

  Scenario: Year-over-year trends are visible
    Given I have Auto expenses in multiple years
    Then the dashboard should show trends over available years

  Scenario: Total ownership cost is shown
    Then a grand total should combine all Auto category costs for the selected year
```

---

## G-05: Export Data and Delete Account

Priority: P3

**Job Story:** When I want to stop using the app, I want to export all my data and delete my account, so that I retain ownership of my information and comply with my rights under GDPR.

**Notes:** Full data export (JSON or CSV). Account deletion cascades to all user-owned rows.

**Acceptance Criteria:**

```gherkin
Feature: Export data and delete account

  Background:
    Given I am on the Seaded screen

  Scenario: Data export is available
    Then I should see an option to export all my data

  Scenario: Export downloads full dataset
    When I tap to export
    Then I should receive a file containing all my costs, categories, tags, and maintenance events
    In a machine-readable format (JSON or CSV)

  Scenario: Account deletion is available
    Then I should see an option to delete my account

  Scenario: Deletion requires explicit confirmation
    When I tap to delete my account
    Then I should see a confirmation dialog warning that all data will be permanently deleted

  Scenario: Confirmed deletion removes all user data
    When I confirm account deletion
    Then my account and all associated data should be deleted
    And I should be redirected to the login screen and unable to log in with those credentials

  Scenario: Deletion cannot be undone
    Given I have confirmed account deletion
    Then all my costs, categories, tags, and maintenance events should be permanently removed
```

---

## G-06: Public Demo Mode

Priority: P3

**Job Story:** When I want to try the app before creating an account, I want to access a public demo version with sample data, so that I can evaluate the app without commitment.

**Notes:** Demo environment with pre-seeded data. Resets periodically or uses a shared demo account.

**Acceptance Criteria:**

```gherkin
Feature: Public demo mode

  Scenario: Demo accessible without an account
    Given I navigate to the demo URL
    Then I should be able to explore the app with pre-seeded sample data
    Without needing to sign up

  Scenario: Demo data is isolated or resets periodically
    When I add or modify data in demo mode
    Then changes should be discarded on session end or the demo should reset on a schedule

  Scenario: Demo clearly indicates it is a demo
    Then there should be a visible label or banner indicating demo mode

  Scenario: Demo does not affect real user data
    Then demo operations should be isolated from production user accounts
```

---

## I-03: Open Source Repository

Priority: P3

**Job Story:** When I want to share the app with others as open source, I want a public code repository with setup instructions, so that anyone can deploy their own instance.

**Notes:** Public repo (GitHub). README with Supabase setup guide. No credentials in code.

**Acceptance Criteria:**

```gherkin
Feature: Open source repository

  Scenario: Code is publicly available
    Given the repository is public
    Then anyone should be able to view the source code without authentication

  Scenario: README includes setup instructions
    Then the repository README should include step-by-step instructions for self-hosting including Supabase setup

  Scenario: No credentials in code
    Then no API keys, passwords, or secrets should be present in committed code
    And sensitive values should be referenced only via environment variables
```

---

## I-04: Abuse Prevention

Priority: P3

**Job Story:** When the app is publicly available, I want protection against abuse (spam entries, excessive API calls), so that the service remains stable for all users.

**Notes:** Supabase RLS prevents cross-user access. Application-level rate limiting for write operations.

**Acceptance Criteria:**

```gherkin
Feature: Abuse prevention

  Scenario: Cross-user data access is blocked by RLS
    Given user A is authenticated
    When user A attempts to access user B's costs directly
    Then the request should be denied by Supabase row-level security

  Scenario: Excessive write rate is rate-limited
    When a user or automated process submits an unusually high number of write operations in a short time
    Then subsequent requests should be rate-limited or rejected

  Scenario: Unauthenticated API calls are rejected
    When an unauthenticated request attempts to read or write data
    Then the request should be rejected with an appropriate error
```

---

## I-05: GDPR Compliance

Priority: P3

**Job Story:** When the app handles personal financial data for multiple users, I want GDPR compliance including data portability and right to erasure, so that the app is legally operable in the EU.

**Notes:** Covers G-05 (export + delete). Also requires a privacy policy page.

**Acceptance Criteria:**

```gherkin
Feature: GDPR compliance

  Scenario: Privacy policy is accessible
    Given I am on the login screen or any public-facing page
    Then I should see a link to the app's privacy policy

  Scenario: Data processing is transparent
    Then the privacy policy should explain what personal data is collected and how it is used

  Scenario: Right to data portability is supported
    When I export my data via G-05
    Then the export should contain all personal data in a machine-readable format

  Scenario: Right to erasure is supported
    When I delete my account via G-05
    Then all personal data should be permanently erased from the system
```

---

## M-06: Overdue Maintenance Reminders

Priority: P3

**Job Story:** When a maintenance task is overdue based on its typical interval, I want a visual indicator or reminder, so that I do not forget recurring tasks.

**Notes:** Depends on default_interval_months in maintenance_types. Future notification system.

**Acceptance Criteria:**

```gherkin
Feature: Overdue maintenance reminders

  Background:
    Given a maintenance type has a default interval set

  Scenario: Overdue indicator shown when interval has passed
    Given maintenance type "Auto hooldus" has interval 12 months
    And the last "Auto hooldus" event was 14 months ago
    When I view the Hoolduspäevik screen
    Then "Auto hooldus" should show an overdue indicator

  Scenario: Not overdue when within interval
    Given the last event was 6 months ago and interval is 12 months
    Then no overdue indicator should be shown

  Scenario: No indicator for types without an interval set
    Given a maintenance type has no default interval
    Then no overdue indicator should be shown regardless of last event date

  Scenario: Overdue indicator disappears when new event is recorded
    Given a type is marked as overdue
    When I create a new maintenance event of that type
    Then the overdue indicator should be removed
```

---

## R-08: Sort Expenses by Amount

Priority: P3

**Job Story:** When I want to find my largest or smallest expenses, I want to sort costs by amount, so that I can spot outliers quickly.

**Notes:** Depends on the generic sort mechanism introduced in R-04.

**Acceptance Criteria:**

```gherkin
Feature: Sort expenses by amount

  Background:
    Given I am on the Ajalugu screen
    And I have expenses with different amounts

  Scenario: Amount sort option is available
    Then I should see an option to sort by amount alongside the date sort control

  Scenario: Sort by amount descending (largest first)
    When I select sort by amount descending
    Then the largest amount expense should be at the top of the list

  Scenario: Sort by amount ascending (smallest first)
    When I select sort by amount ascending
    Then the smallest amount expense should be at the top of the list

  Scenario: Amount sort indicator is shown
    Then the sort control should clearly show the current sort dimension and direction
```

---

## S-04: Chart-Based Spending Overview

Priority: P3

**Job Story:** When I want a visual spending overview, I want chart-based representations (bar, pie) of category and tag breakdowns, so that patterns are easier to spot than in a number table.

**Notes:** Data visualisation layer on top of existing aggregation queries from S-01, S-02, S-03.

**Acceptance Criteria:**

```gherkin
Feature: Chart-based spending overview

  Background:
    Given I am on the Kokkuvõte screen
    And I have selected a year with expenses

  Scenario: Charts are accessible from Kokkuvõte
    Then I should see a charts section or tab within Kokkuvõte

  Scenario: Bar chart shows category totals
    When I view the category chart
    Then a bar chart should display each category's total for the selected year

  Scenario: Pie chart shows category proportions
    When I view the category pie chart
    Then category proportions should be shown as pie slices

  Scenario: Tag breakdown chart is available
    Then I should be able to switch to a tag-based chart view

  Scenario: Charts update when year filter changes
    When I change the year filter
    Then the charts should update to reflect the selected year's data
```

---

## T-05: Tag Breakdown in Kokkuvõte

Priority: P3

**Job Story:** When I want to see spending on a tag over time, I want the Kokkuvõte view to offer a tag-based breakdown alongside the category breakdown, so that I get both perspectives in one place.

**Notes:** Extends Kokkuvõte with a tag dimension toggle.

**Acceptance Criteria:**

```gherkin
Feature: Tag breakdown in spending summary

  Background:
    Given I am on the Kokkuvõte screen
    And I have expenses with tags assigned

  Scenario: Tag breakdown toggle is available
    Then I should see an option to switch from category view to tag view

  Scenario: Tag totals shown
    When I switch to tag breakdown
    Then each tag should show the total amount of expenses tagged with it for the selected year

  Scenario: An expense with multiple tags appears in each tag's total
    Given an expense tagged with both "Kütus" and "Reisimine"
    Then it should appear in both the "Kütus" total and the "Reisimine" total

  Scenario: Untagged expenses not shown in tag breakdown
    Given some expenses have no tags
    Then those expenses should not appear in any tag row in the breakdown

  Scenario: Tag breakdown total may differ from category grand total
    Then the tag breakdown total should not necessarily match the Kokku grand total
    Because some expenses may be untagged or tagged multiple times
```
