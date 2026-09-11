# Money Tracker Implementation Plan

> **For implementers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Build a responsive INR money tracker that records manual transactions and calculates each calendar month's safe-to-spend balance.

**Architecture:** Use a client-rendered Next.js application with domain calculations separated from presentation components. Persist first-version data in localStorage through a small storage module, keeping interfaces simple enough to replace with a Supabase repository later.

**Tech Stack:** Next.js, React, TypeScript, CSS Modules/global CSS, Vitest, Testing Library

---

### Task 1: Project foundation

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `app/layout.tsx`
- Create: `app/globals.css`

**Steps:**
1. Define Next.js scripts and dependencies.
2. Add strict TypeScript and Next.js configuration.
3. Create the root layout, metadata, fonts, and global design tokens.
4. Run `npm install` and verify dependency installation succeeds.

### Task 2: Domain model and calculations

**Files:**
- Create: `lib/types.ts`
- Create: `lib/money.ts`
- Create: `lib/money.test.ts`

**Steps:**
1. Write failing tests for safe-to-spend, totals, and INR formatting.
2. Run `npm test` and confirm the tests fail before implementation.
3. Implement transaction, plan, bill, and aggregate types.
4. Implement integer-rupee calculations and INR formatting.
5. Run `npm test` and confirm all domain tests pass.

### Task 3: Persistent application state

**Files:**
- Create: `lib/seed.ts`
- Create: `lib/storage.ts`
- Create: `hooks/useMoneyTracker.ts`

**Steps:**
1. Add realistic sample data for the current calendar month.
2. Implement versioned localStorage loading and saving.
3. Build a hook for adding/deleting transactions and updating the monthly plan.
4. Ensure server rendering uses seed data and client hydration loads saved data safely.

### Task 4: Responsive application shell

**Files:**
- Create: `components/AppShell.tsx`
- Create: `components/Icons.tsx`
- Create: `components/Navigation.tsx`

**Steps:**
1. Add desktop sidebar navigation.
2. Add mobile header and bottom navigation.
3. Implement accessible active states and navigation labels.
4. Verify layouts at 390px and 1440px widths.

### Task 5: Dashboard

**Files:**
- Create: `app/page.tsx`
- Create: `components/Dashboard.tsx`
- Create: `components/SafeToSpend.tsx`
- Create: `components/SpendingChart.tsx`

**Steps:**
1. Render current-month income, bills, savings, spending, and balance.
2. Add a visual safe-to-spend meter and category distribution.
3. Add recent transactions and empty states.
4. Ensure negative balances use clear warning copy and styling.

### Task 6: Transaction entry and history

**Files:**
- Create: `components/TransactionForm.tsx`
- Create: `components/TransactionList.tsx`

**Steps:**
1. Add expense/income selection, amount, category, date, and note fields.
2. Validate required fields and positive amounts.
3. Add valid transactions and update dashboard totals immediately.
4. Add search, category filtering, and confirmed deletion.

### Task 7: Monthly plan and reports

**Files:**
- Create: `components/MonthlyPlan.tsx`
- Create: `components/Reports.tsx`

**Steps:**
1. Add forms for expected salary, savings target, and fixed bills.
2. Persist plan changes immediately.
3. Display category totals, percentages, and monthly summary.
4. Add useful empty states when no expenses exist.

### Task 8: Quality verification

**Files:**
- Modify: files identified by lint, test, or build failures

**Steps:**
1. Run `npm test` and resolve failures.
2. Run `npm run lint` and resolve errors.
3. Run `npm run build` and resolve compilation issues.
4. Manually verify adding an expense changes safe-to-spend and survives reload.
5. Manually verify mobile navigation and transaction entry at 390px width.
