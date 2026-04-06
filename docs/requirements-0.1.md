# Requirements: Kodukulu

*Last updated: 05 April 2026*

---

## Table of Contents

- [E-01: Add Expense](#e-01-add-expense)
- [E-02: Edit Expense](#e-02-edit-expense)
- [E-03: Delete Expense](#e-03-delete-expense)
- [E-04: Import Receipt](#e-04-import-receipt)
- [R-01: Browse and Filter Expenses — Ajalugu](#r-01-browse-and-filter-expenses-ajalugu)
- [R-02: Export Filtered Expenses as CSV](#r-02-export-filtered-expenses-as-csv)
- [S-01: View Spending Summary — Kokkuvõte](#s-01-view-spending-summary-kokkuvõte)
- [I-01: Install App on Android Home Screen](#i-01-install-app-on-android-home-screen)

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

Priority: P0

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
    Then I should see a "Laadi alla CSV" button on the Ajalugu screen

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

