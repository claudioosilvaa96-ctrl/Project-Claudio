# Project Claudio

Project Claudio is a personal life operating system for consistency, recovery, and behaviour-led progress. It is intentionally not a habit tracker. The dashboard is designed to take less than two minutes each morning and to lower the bar safely on hard days.

## Stack

- Next.js App Router
- React + TypeScript
- TailwindCSS
- Supabase Auth and Postgres
- Recharts
- Mobile-first responsive UI with light and dark mode

## Product Areas

- Today dashboard with focus, score, streak, recovery score, quote, tasks, and auto-saving check-in
- Recovery Mode triggered by mood less than or equal to 4 or the Bad Day button
- Health trends that emphasise rolling averages rather than daily weight
- Football progression across gym, pitch, sprint, conditioning, mobility, bodyweight, and lifts
- Career tracking for cars sold, appointments, calls, finance conversions, commission, and target progress
- Money tracking for savings, mortgage fund, emergency fund, investments, spending, and saving rate
- Sunday weekly review with generated summary
- Rule-based AI coach architecture ready for an LLM provider

## Getting Started

Install dependencies and run the app:

    npm install
    npm run dev

Create .env.local from .env.example and add Supabase keys:

    NEXT_PUBLIC_SUPABASE_URL=...
    NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    SUPABASE_SERVICE_ROLE_KEY=...

Apply database/schema.sql in the Supabase SQL editor. Enable Google, Apple, and Email providers in Supabase Auth.

## Notes

The app works in a local-first demo mode when Supabase keys are not present. Daily logs and weekly reviews persist in browser storage, and the API routes switch to Supabase automatically once auth is configured.

The scoring engine lives in lib/scoring.ts. The coach rules live in lib/coach.ts. Both are isolated so future integrations such as Garmin, MyFitnessPal, bank feeds, calendar, push notifications, AI voice coach, and Apple Watch can feed the same behaviour model without rewriting the UI.
