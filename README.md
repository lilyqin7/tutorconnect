# TutorConnect

Live demo: https://tutorconnect-zeta.vercel.app/

**Brief**

TutorConnect is a volunteer tutoring platform built with Next.js and Supabase. It helps students find volunteer tutors by subject, view tutor profiles, and schedule sessions. The UI uses Tailwind CSS and a set of reusable local components.

**Quick Links**

- App entry: [app/layout.tsx](app/layout.tsx)
- Home page: [app/page.tsx](app/page.tsx)
- Tutors listing: [app/tutors/page.tsx](app/tutors/page.tsx)
- UI components: [components](components)
- Supabase helpers: [lib/supabase](lib/supabase)

**Tech Stack**

- Framework: Next.js (App Router) with TypeScript and React
- Styling: Tailwind CSS (with PostCSS)
- Database & Auth: Supabase (Postgres)
- Icons: lucide-react + custom SVGs in `public/`
- Video (optional): Jitsi integration component
- Deployment: Vercel (live demo linked above)

**Local development**

Prerequisites

- Node.js (16+ recommended)
- pnpm (project uses pnpm; npm or yarn may work)

Install and run:

```bash
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:3000`.

**Database**

Schema and helper SQL scripts live under the `scripts/` folder. To run locally with Supabase:

1. Create a Supabase project at https://app.supabase.com
2. Import or run the SQL scripts in `scripts/` to create tables and triggers
3. Add your Supabase keys to environment variables used by the app (see `lib/supabase`)

Scripts included:

- `scripts/001_create_profiles.sql`
- `scripts/002_create_subjects.sql`
- `scripts/003_create_tutor_subjects.sql`
- `scripts/004_create_availability.sql`
- `scripts/005_create_sessions.sql`
- `scripts/006_profile_trigger.sql`
- `scripts/007_updated_at_trigger.sql`

**Files of interest**

- `app/layout.tsx` — metadata, favicons and top-level layout
- `app/page.tsx` — public landing/home page
- `app/tutors/page.tsx` — tutors list and server-side data fetching
- `components/tutor-filters.tsx` — client filter UI using `useSearchParams`
- `components/ui/*` — small local UI primitives (Button, Select, Card, etc.)
- `lib/supabase/*` — Supabase client/server helpers
- `public/` — static assets (`icon.svg`, `apple-icon.png`, etc.)

**Deployment**

Vercel is recommended. To deploy:

1. Connect the repository to Vercel.
2. Configure environment variables (Supabase URL, Anon key, Service role key, etc.).
3. Deploy the `main` branch.

**Notes & Tips**

- The project uses a local UI component pattern similar to shadcn/ui. Check `components/ui` for examples.
- Icons referenced in `app/layout.tsx` (e.g., `/icon.svg`, `/apple-icon.png`) are in `public/` and used for favicons and home-screen shortcuts.
- Use `pnpm` to match the project's lockfile (`pnpm-lock.yaml`).
