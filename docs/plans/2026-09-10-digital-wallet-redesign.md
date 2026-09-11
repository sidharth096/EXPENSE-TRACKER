# Digital Wallet Redesign Implementation Plan

> **For implementers:** REQUIRED SUB-SKILL: Use executing-plans to implement this plan task-by-task.

**Goal:** Transform the existing money tracker into a cohesive modern green digital-wallet interface across desktop and mobile.

**Architecture:** Preserve all domain calculations, state management, and component structure. Replace the global design tokens and component styling, then make minimal markup changes for the visual motif and responsive hierarchy.

**Tech Stack:** Next.js, React, TypeScript, CSS, next/font, Lucide icons

---

### Task 1: Typography and color foundation

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Steps:**
1. Replace the editorial font pairing with a rounded geometric sans family.
2. Define forest, mint, lime, white, border, and shadow tokens.
3. Restyle page background, headings, buttons, navigation, and focus states.

### Task 2: Wallet dashboard surface

**Files:**
- Modify: `components/Dashboard.tsx`
- Modify: `app/globals.css`

**Steps:**
1. Add a restrained pixel-grid layer to the safe-to-spend surface.
2. Recompose the hero into a lime balance card with dark readable values.
3. Restyle charts, allocation bars, and recent transaction modules.
4. Ensure zero-income and negative-balance states remain readable.

### Task 3: Secondary screens and modal

**Files:**
- Modify: `app/globals.css`
- Modify only if required: `components/TransactionForm.tsx`
- Modify only if required: `components/TransactionList.tsx`
- Modify only if required: `components/MonthlyPlan.tsx`
- Modify only if required: `components/Reports.tsx`

**Steps:**
1. Apply the green wallet card system to transactions, reports, and plan forms.
2. Restyle controls as compact pills and clean white rows.
3. Preserve validation, keyboard behavior, and touch target size.

### Task 4: Responsive and quality verification

**Files:**
- Modify: files identified by verification failures

**Steps:**
1. Verify dashboard and entry modal at mobile and desktop breakpoints.
2. Add reduced-motion behavior.
3. Run `npm run lint`.
4. Run `npm test`.
5. Run `npm run build`.
