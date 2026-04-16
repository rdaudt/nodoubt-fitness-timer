# Concerns

## Shipping blockers
- There is no application source code in the repo yet. `package.json` points to `index.js`, but no `index.js`, `src/`, `app/`, or `pages/` tree exists, so there is nothing that can actually run as a product.
- The only npm script is `test`, and it always exits with an error. `package.json` therefore has no build, dev, lint, or preview workflow.
- The repo cannot be considered shippable from code alone because the PRD and wireframes in `docs/` describe a full product that has not been implemented.

## Planning-stage risks
- The requirements in `docs/PRD.md` are materially broader than the current repo state. MVP scope includes auth, persistence, offline playback, PWA behavior, analytics, and workout timing logic, but none of those systems exist yet.
- The PRD explicitly depends on Supabase Auth, Supabase Postgres, Google sign-in, and PWA installability, but there is no backend, schema, or client integration plan in code.
- The timer engine is a likely critical-path risk. The docs require deterministic playback, pause/resume without drift, background resilience, haptics, and audio cues, which are all browser-sensitive and need early validation.
- Mobile browser constraints are a delivery risk. `docs/PRD.md` already calls out autoplay, background throttling, lock-screen behavior, and screen wake limitations, meaning the product cannot assume native-like reliability.

## Missing implementation concerns
- There is no authentication flow, no session restoration, and no account deletion path despite those being core MVP requirements in `docs/PRD.md`.
- There is no data model for timers, intervals, drafts, or official templates, so persistence and ownership rules are still undefined in code.
- There is no offline storage layer yet, despite the PRD requiring local resilience for previously saved timers.
- There is no run-screen implementation, so there is no evidence the product can support the required controls, countdown cues, or completion state.
- There is no analytics instrumentation, even though the PRD treats basic product analytics as part of MVP1.

## Dependency and tooling concerns
- `package.json` only lists `playwright` as a dev dependency, which suggests the repo currently has testing/output assets but no app runtime or framework dependency.
- `node_modules/` is present in the working tree, which increases noise and suggests dependencies may be locally installed without a reproducible app setup.
- The repository lacks a lockfile-aware app stack definition. There is no framework config such as Vite, Next, React, or SSR tooling to indicate how the product will be built.
- The generated artifacts in `output/playwright/` imply design/prototype capture, but they are not a substitute for executable app code.

## Repo hygiene risks
- The repo root is sparse and mixes long-form product docs, branding docs, and generated images without a clear source/runtime boundary.
- `docs/WIREFRAMES.html` and the `output/playwright/` images look like generated assets; if they are intended as reference material, they should be treated as derived artifacts and kept clearly separate from source-of-truth implementation.
- `.gitignore` excludes common build outputs, but there is no corresponding source directory to indicate the app’s actual entrypoints or build products.
- The current structure makes it easy to confuse planning artifacts with implemented functionality.

## Security and privacy concerns
- The PRD requires user accounts, private timer data, and account deletion, so any eventual implementation must enforce row-level security and session isolation at the database layer, not only in the client.
- Google sign-in via Supabase will require careful redirect and token handling; without a codebase yet, there is no evidence of CSRF, session, or token-storage hardening.
- The app will likely handle personal health/workout behavior data. Even if not regulated health data, it still needs a clear privacy posture and data-retention policy before launch.
- If analytics are added later, care will be needed to avoid over-collecting personally identifying workout behavior without a documented consent and retention strategy.

## Near-term mitigation priorities
- Define the actual app stack and create the first executable scaffold before adding more UX polish.
- Choose the timer data model and Supabase schema early, because auth, drafts, official templates, and offline caching all depend on it.
- Prototype the playback engine separately from the UI to de-risk timing drift, control locking, and background behavior.
- Add a real `dev`, `build`, and `test` workflow before expanding the planning artifacts further.
- Decide whether `docs/WIREFRAMES.html` and `output/playwright/` are reference assets or temporary generated outputs, and keep them consistently managed.

## Bottom line
- The main concern is not a defect in existing app logic; it is that the repo is still a planning package with no runnable implementation.
- The next delivery risk is starting UI work before locking the timing, auth, and persistence foundations.
