# No Doubt Fitness Timer

## What This Is

No Doubt Fitness Timer is a mobile-first web-based interval timer for structured workouts such as HIIT, Tabata, circuits, rounds, strength, mobility, and stretching. It is intended to deliver the flexibility and glanceable live-run experience of tools like Seconds Interval Timer, while being easier to create, edit, save, and reuse in the browser. It also serves as a branded NoDoubt Fitness product that can build recognition and create a lightweight path to future coaching leads.

## Core Value

Users can quickly create or open a structured workout timer and run it reliably from across the room with clear visual, audio, and haptic transitions.

## Requirements

### Validated

(None yet - the repo currently contains product definition, wireframes, and brand guidance, but no shipped application behavior to validate.)

### Active

- [ ] Build a mobile-first web MVP for structured interval workouts with fast creation, editing, and playback flows.
- [ ] Deliver a full-screen run experience that is readable at distance and supports current, next, and total remaining timing context.
- [ ] Support guest use for official templates and temporary timers, with Google sign-in required to save timers permanently.
- [ ] Persist signed-in timers, drafts, and official templates through Neon with private per-user access controls.
- [ ] Ship official NoDoubt Fitness starter templates and branded surfaces that feel official without interfering with timer usability.
- [ ] Launch as an installable PWA with offline support for previously loaded timers and browser-realistic resilience constraints.

### Out of Scope

- Apple Health, watch support, and native lock-screen integrations - browser MVP should avoid native-only platform dependencies.
- Public sharing, import/export, folders, and community libraries - not required for the initial competitive MVP.
- Compound timers, stopwatch mode, simple countdown mode, and spoken interval names - intentionally deferred to reduce MVP complexity.
- Subscription monetization, aggressive promotional flows, and heavyweight lead-gen gating - the product should earn goodwill first.
- Dark mode and broad visual customization - lower priority than core timer utility and branded MVP polish.

## Context

The repository is currently documentation-first rather than implementation-first. Product intent is defined in `docs/PRD.md`, mobile navigation and screen structure are defined in `docs/MOBILE_IA_WIREFRAME_SPEC.md`, and brand usage is defined in `docs/MOBILE_BRANDING_SYSTEM.md`. The current repo also contains `docs/WIREFRAMES.html`, the primary logo asset in `media/nodoubt-fitness-logo.png`, and generated screen references in `output/playwright/`.

The product is positioned as a mobile web/PWA timer inspired by Seconds Interval Timer, but adapted for web constraints and a cleaner editing experience. The business goal is to promote NoDoubt Fitness through a genuinely useful free product rather than a sales-first funnel. The most important product tension is preserving timer utility while still making the app feel unmistakably like an official NoDoubt Fitness experience.

The codebase map confirms there is not yet any application source tree, runtime entry point, timer engine, auth implementation, or production Neon integration. This means initial planning should treat the project as a pre-implementation build with strong product direction already established, not as an existing app that needs incremental feature work.

## Constraints

- **Hosting**: Vercel free tier - deployment and architecture should stay lightweight and low-ops.
- **Persistence**: Neon free tier - database and auth design should fit hosted constraints without requiring a custom backend.
- **Authentication**: Neon Auth with Google only for MVP - sign-in scope is intentionally narrow.
- **Platform**: Mobile-first web/PWA - UX and technical choices must respect browser limitations around background execution, audio, and wake behavior.
- **Architecture**: Minimal backend surface area - prefer direct client-to-Neon Data API patterns plus only small serverless logic if strictly necessary.
- **Product scope**: MVP should emphasize quick setup, reliable run mode, and branded starter templates before broader feature parity with native benchmarks.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build the first release as a mobile-first web app and PWA | Matches the product goal and delivery constraints while maximizing reach | - Pending |
| Use Neon + Neon Auth for auth and persistence | Keeps the stack simple and aligned with free-tier MVP constraints after the platform pivot | - Pending |
| Use Google as the only MVP sign-in provider | Reduces auth complexity while supporting save-and-return behavior | - Pending |
| Keep guests unblocked for trying templates and temporary timers | Supports fast value and reduces friction before account creation | - Pending |
| Make NoDoubt branding strong in shell/onboarding but minimal during active runs | Preserves timer readability while still serving the business objective | - Pending |
| Treat the current repo state as pre-implementation despite existing docs and artifacts | There is no shipped app behavior yet, so planning should start from product intent rather than legacy code constraints | - Pending |

---
*Last updated: 2026-04-15 after initialization*
