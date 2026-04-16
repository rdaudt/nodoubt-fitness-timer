# Architecture

## Current System Shape
This repository is currently a documentation-first workspace, not a shipped application.

There is no `src/`, no `app/`, no `pages/`, no `components/`, and no runtime entry file such as `index.js`, `main.tsx`, or a framework-specific bootstrap. The only executable dependency declared in `package.json` is `playwright`, which points to browser-based verification or wireframe capture work rather than a production app runtime.

The current shape is:

- product requirements and UX specifications in `docs/`
- visual reference assets in `media/`
- generated screenshots and wireframe captures in `output/`
- planning artifacts under `.planning/`

That means the repo presently describes a future product more than it implements one.

## What Exists Today
The existing materials imply a web app called `No Doubt Fitness Timer`, but the implementation is not present yet. The strongest signals come from:

- `docs/PRD.md`, which describes the MVP, data model expectations, and delivery constraints
- `docs/MOBILE_IA_WIREFRAME_SPEC.md`, which defines the mobile navigation model and screen hierarchy
- `docs/MOBILE_BRANDING_SYSTEM.md`, which defines how branding should appear across screens
- `docs/WIREFRAMES.html`, which likely serves as a design or wireframe artifact source
- `media/nodoubt-fitness-logo.png`, the brand asset that the UX docs reference
- `output/playwright/*.png`, which are generated visual outputs from browser automation

There is no evidence yet of actual timer logic, persistence integration, auth flows, or UI implementation.

## Entry Points
There is no production entry point at the moment.

The closest thing to a functional entry surface is `package.json`, but its `main` field points to `index.js`, and that file does not exist in the repository tree returned by `rg --files`. The `test` script is a placeholder:

- `npm test` currently exits with a failure message rather than running any suite

So the architecture has no active runtime entry path today. The repo is instead anchored by documents and generated assets.

## Artifacts Versus Application Code
The repository is split cleanly between source-like artifacts and output-like artifacts, but there is no application code yet.

Source-like artifacts:

- `docs/PRD.md`
- `docs/MOBILE_IA_WIREFRAME_SPEC.md`
- `docs/MOBILE_BRANDING_SYSTEM.md`
- `docs/WIREFRAMES.html`
- `media/nodoubt-fitness-logo.png`

Output-like artifacts:

- `output/playwright/01-guest-home.png`
- `output/playwright/02-signed-in-home.png`
- `output/playwright/03-create-type-picker.png`
- `output/playwright/04-hiit-wizard.png`
- `output/playwright/05-custom-editor.png`
- `output/playwright/06-timer-detail.png`
- `output/playwright/07-run-screen.png`
- `output/playwright/08-completion-screen.png`
- `output/playwright/09-sign-in-prompt.png`
- `output/playwright/10-settings-profile.png`
- `output/playwright/wireframes-overview.png`

These screenshots look like generated deliverables from a design or prototyping workflow. They should be treated as derived artifacts, not the source of truth.

## Data Flow That Exists Today
No product data flow exists in code yet. The only data flow visible in the repository is documentary:

1. The PRD defines the product and the intended system boundaries.
2. The IA and branding docs translate that into screen structure and visual rules.
3. Wireframes and screenshots provide static reference outputs for the planned UI.

There is no implemented flow for:

- guest to signed-in session transition
- timer creation or editing
- persistence to Supabase
- offline storage
- run session state
- analytics events

The current repository therefore has design flow, but not execution flow.

## Likely Architecture Consequences
Because the repo is pre-implementation, several consequences follow directly from the current state.

- The first application code will have to establish the app shell, routing, state management, and persistence layers from scratch.
- The docs already commit the product to a mobile-first, bottom-nav-centric UX, so the UI architecture will likely need a persistent shell with route-level screens for home, create, detail, run, settings, and about.
- The PRD assumes Supabase Auth and Supabase Postgres, which means the eventual architecture will need a client/server boundary even if most logic stays client-driven.
- The timer domain will likely need a deterministic playback engine separate from presentation, because the PRD requires pause/resume without drift, flattened sequences, and refresh resilience.
- Generated screenshots in `output/playwright/` imply there may be a future browser automation or visual regression workflow, but there is no evidence of that pipeline being wired into scripts yet.
- Since there is no source tree, the eventual folder structure can still be chosen deliberately without migration cost from an existing app codebase.

## Architectural Signals From The Docs
The docs point toward a future architecture with these traits:

- mobile web first, with desktop as a secondary adaptation
- guest mode plus authenticated private persistence
- official templates alongside personal timers
- a strict separation between live run mode and editor mode
- local resilience for previously loaded timers
- minimal backend surface area, likely client-heavy with Supabase as the primary service layer

Those are requirements, not implementations, but they strongly constrain the direction of the eventual system.

## Practical Reading Of The Repo
If this repository is treated as a system boundary today, then the architecture is:

- documentation-led
- design-specified
- asset-backed
- not yet runtime-backed

That is the most accurate description of the current state.

## Files Worth Using As References
- `docs/PRD.md` for product intent and non-goals
- `docs/MOBILE_IA_WIREFRAME_SPEC.md` for screen hierarchy and navigation rules
- `docs/MOBILE_BRANDING_SYSTEM.md` for brand placement and UI tone
- `media/nodoubt-fitness-logo.png` for the main brand asset
- `output/playwright/*.png` for existing visual references and screen naming
- `package.json` for the current absence of app scripts and runtime entry points
