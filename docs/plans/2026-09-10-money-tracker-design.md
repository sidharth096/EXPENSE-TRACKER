# Money Tracker Design

## Goal

Build a responsive personal money-tracking web application that answers one question clearly: after salary, bills, savings, and spending, how much money is safe to spend?

## First-Version Scope

- One person per account
- Indian rupees (INR)
- Calendar-month tracking
- Manual income and expense entry
- Monthly income, fixed bills, and savings target
- Safe-to-spend calculation
- Transaction history with categories
- Simple category spending report
- Desktop and mobile layouts

Bank synchronization, statement imports, shared household budgets, and multiple currencies are intentionally excluded.

## Product Flow

The user lands on the current month's dashboard. It shows income, planned bills, savings target, spending so far, and the remaining safe-to-spend amount. A prominent action opens a short transaction form. The user can review transactions, configure the monthly plan, and inspect category totals.

Safe to spend is calculated as:

`income - fixed bills - savings target - expenses`

Additional income increases the available amount. The dashboard makes negative balances visually explicit without hiding the underlying values.

## Application Structure

- Dashboard: monthly financial position, safe-to-spend amount, recent activity, and category snapshot
- Transactions: searchable history and add/delete actions
- Monthly Plan: salary, savings target, and recurring bill configuration
- Reports: category distribution and month summary
- Settings: profile and application preferences

Mobile uses bottom navigation and compact content. Desktop uses a persistent sidebar and a wider analytical layout.

## Technical Design

- Next.js and TypeScript
- React components with responsive CSS
- Supabase PostgreSQL for persisted financial data
- Supabase Auth for email/password authentication
- Row Level Security so users can access only their records
- Vercel-compatible deployment

The UI is built first around a repository interface and local seeded data, allowing the complete experience to run before Supabase credentials are configured. Supabase persistence can then replace that repository without changing presentation components.

## Data Model

- Profile: user ID, display name, currency, created date
- Monthly plan: user ID, month, expected income, savings target
- Fixed bill: user ID, monthly plan ID, name, amount, due day, paid state
- Transaction: user ID, type, amount, category, note, date, created date

Amounts are stored as integer paise in the database to avoid floating-point rounding errors.

## Error Handling

Forms validate positive amounts and required fields. Persistence failures keep entered values available and show a direct retry message. Empty months show onboarding prompts rather than empty charts. Destructive actions require confirmation.

## Testing

- Unit tests for safe-to-spend and category calculations
- Component tests for transaction and monthly-plan forms
- Integration tests for adding expenses and updating dashboard totals
- Responsive checks at common mobile and desktop widths
- Build, lint, and TypeScript checks before release
