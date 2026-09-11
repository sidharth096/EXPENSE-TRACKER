# Khata Money Tracker

Khata is a responsive personal money tracker focused on one clear number: how much remains safe to spend after fixed bills, savings, and recorded expenses.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The current build stores data in the browser, so it works without external credentials.

## Quality checks

```bash
npm test
npm run lint
npm run build
```

## Supabase database

The production database design is in `supabase/schema.sql`. Create a Supabase project, run that file in the Supabase SQL editor, and provide the values shown in `.env.example` before connecting the repository layer to Supabase Auth and PostgreSQL.

Amounts in the SQL schema use integer paise. Row Level Security policies limit every table to the authenticated owner.
