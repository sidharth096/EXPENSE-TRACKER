# Flow Money Tracker

Flow is a responsive personal money tracker focused on one clear number: how much remains safe to spend after fixed bills, savings, and recorded expenses.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` after configuring Supabase as described below.

## Quality checks

```bash
npm test
npm run lint
npm run build
```

## Supabase setup

1. Create a project at [Supabase](https://supabase.com/dashboard).
2. Open the project SQL Editor, paste and run `supabase/schema.sql`.
3. In Authentication > URL Configuration, set the Site URL to `http://localhost:3000` and add `http://localhost:3000` to Redirect URLs. Add the production URL there before deploying.
4. Keep **Confirm email** enabled in Authentication > Providers > Email.
5. Copy `.env.example` to `.env.local`, then replace the URL and anonymous key with the Project URL and Publishable/anon key from Settings > API.

The app uses email/password accounts. New users must confirm their email before signing in. Data is stored in PostgreSQL and Row Level Security limits every row to its authenticated owner.

Amounts in the SQL schema use integer paise. Row Level Security policies limit every table to the authenticated owner.

## Install on a phone

After deploying over HTTPS, open the site in Chrome on Android and choose **Install app** from the browser menu. On iPhone, open it in Safari, tap **Share**, then **Add to Home Screen**. Flow needs an internet connection to sign in and sync data with Supabase.
