# Integrations

## Current State
There are no confirmed live integrations implemented in code yet. The repository currently documents intended external services in the PRD and wireframe spec, but there is no checked-in application source that initializes those services. Treat the items below as planned, configured-in-concept, or brand references rather than shipped integrations.

## External Services Planned in the Product Docs
- `Supabase Auth` is the intended authentication system of record for MVP1.
- `Supabase Postgres` is the intended primary persistence layer for timers, drafts, and official template records.
- `Supabase RLS` is explicitly called out for row-level data isolation between users.
- `Google OAuth` is the only documented sign-in provider for the initial release, routed through Supabase Auth.
- `Vercel` is the documented frontend hosting/deployment target for the MVP.
- `Vercel + Supabase` analytics is mentioned as an open implementation decision, but no analytics vendor is selected in code.
- `Playwright` is present as a dev dependency and has already been used to generate screenshots in `output/playwright/`.

## Configured-But-Not-Implemented Integrations
- `Google sign-in` appears repeatedly in the PRD and wireframes, but there is no auth client setup, provider config, or redirect handling in the repo.
- `Supabase persistence` is specified as the source of truth, but there are no tables, migrations, policies, or client calls checked in.
- `PWA installability` is described as an MVP requirement, but there is no `manifest.json`, service worker, or web app shell implementation visible.
- `Analytics` is requested in the PRD, but no tracking library or event schema exists yet.
- `Offline/local resilience` is described conceptually, but no IndexedDB/localStorage layer is implemented in the repository.

## Brand and External References
- `NoDoubt Fitness Instagram` is a major external business reference and CTA target: `https://www.instagram.com/nodoubt.fitness/`.
- The product docs reference the `Seconds Interval Timer` App Store listing and the `Runloop` manual as behavioral benchmarks.
- A Dribbble shot is cited for design direction: `https://dribbble.com/shots/27161453-Gym-and-Fitness-App`.
- The local logo asset `media/nodoubt-fitness-logo.png` is the primary brand input for the product shell and about/landing surfaces.
- `docs/MOBILE_BRANDING_SYSTEM.md` and `docs/MOBILE_IA_WIREFRAME_SPEC.md` both define where Instagram, official template badges, and brand CTAs should appear.

## Operational Implications
- Authentication and persistence should be designed around Supabase from the start, but the repo currently lacks the implementation scaffolding to enforce it.
- If the app is built next, the first integration decisions will likely be Supabase project wiring, Google OAuth redirect configuration, and RLS policy design.
- Instagram appears to be a lightweight acquisition channel rather than a product dependency; failures there should not block workout functionality.
- Because there is no analytics stack selected, any event tracking will need a vendor decision before implementation.
- The current repo state supports design and planning work, not service connectivity validation.

## Practical File References
- `package.json`
- `docs/PRD.md`
- `docs/MOBILE_IA_WIREFRAME_SPEC.md`
- `docs/MOBILE_BRANDING_SYSTEM.md`
- `media/nodoubt-fitness-logo.png`
- `output/playwright/*.png`
