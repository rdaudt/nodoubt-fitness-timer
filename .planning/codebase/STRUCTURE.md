# Structure

## Repository Layout
The repository is very small and top-level focused. The current directories are:

- `docs/`
- `media/`
- `output/`
- `.planning/`

There is no application source directory yet, which is the main structural fact to preserve.

## Top-Level Files

### `package.json`
This is the only package manifest and currently acts as the only code-oriented root file.

Observed characteristics:

- package name: `nodoubt-fitness-timer`
- CommonJS module type
- `main` points to `index.js`, but that file is not present
- `test` is a placeholder script
- the only dev dependency is `playwright`

This file is currently more of a project stub than a build/runtime configuration.

### `package-lock.json`
Lockfile for the declared Node dependency set. Since the repo has no app source yet, this is mostly supporting infrastructure for the tooling dependency.

## `docs/`
This is the primary source-of-truth area for the intended product.

Major files:

- `docs/PRD.md`
- `docs/MOBILE_IA_WIREFRAME_SPEC.md`
- `docs/MOBILE_BRANDING_SYSTEM.md`
- `docs/WIREFRAMES.html`

Observed purpose:

- `PRD.md` defines the product scope, non-goals, target users, constraints, and acceptance criteria
- `MOBILE_IA_WIREFRAME_SPEC.md` translates the PRD into screen structure and interaction rules
- `MOBILE_BRANDING_SYSTEM.md` defines logo usage, brand hierarchy, and visual tone
- `WIREFRAMES.html` appears to be a rendered or assembled visual reference artifact, likely from the wireframing process

For the current repo state, `docs/` is the clearest source of truth for intended behavior.

## `media/`
This directory holds brand input assets.

Observed file:

- `media/nodoubt-fitness-logo.png`

Purpose:

- primary brand logo referenced by the docs
- input asset for future UI, splash, about, and badge treatments

This is source material, not generated output.

## `output/`
This directory contains generated or derived artifacts.

Observed contents:

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

Purpose:

- screenshot-like outputs for design review, wireframe documentation, or browser automation
- derived artifacts that should not be treated as source of truth

Naming pattern:

- numbered filenames suggest ordered screen capture or walk-through output
- names map directly to documented screens in the IA spec

## `.planning/`
This directory is reserved for planning artifacts.

Current known subpath:

- `.planning/codebase/`

Purpose:

- repository mapping documents
- orchestration artifacts
- planning outputs for this repo

The repo currently uses `.planning` as a coordination workspace rather than application content.

## `.planning/codebase/`
This is the write scope for the repository mapping work.

Expected documents:

- `.planning/codebase/ARCHITECTURE.md`
- `.planning/codebase/STRUCTURE.md`

These are reference documents, not runtime assets.

## Source Of Truth Versus Generated Output

### Source of truth
- `docs/PRD.md`
- `docs/MOBILE_IA_WIREFRAME_SPEC.md`
- `docs/MOBILE_BRANDING_SYSTEM.md`
- `media/nodoubt-fitness-logo.png`

### Generated or derived
- `output/playwright/*.png`
- `docs/WIREFRAMES.html` if it is a rendered assembly rather than a manually maintained source file

### Structural stub
- `package.json`
- `package-lock.json`

The repo is currently dominated by source documents and derived design outputs, with no executable app tree yet.

## Naming And Organization Patterns

- Screen names are explicit and descriptive, such as `guest-home`, `signed-in-home`, `create-type-picker`, and `timer-detail`.
- Output filenames use numeric prefixes to preserve screen order.
- Documentation names are uppercase and purpose-specific, which makes the repo easy to scan at a glance.
- The repository does not yet show feature-based source folders, route folders, or domain modules.
- There is no `src/` namespace, so there is no current pattern for component, service, or state organization.

## Major Path Purposes
- `docs/` records product intent and UI rules.
- `media/` stores brand input assets.
- `output/` stores generated visual references.
- `.planning/` stores coordination and mapping artifacts.

## What Is Missing
The following structural areas are absent today:

- application source code
- build config
- test suites
- route or page folders
- component library folders
- state management modules
- Supabase schema or migrations
- public asset folder
- generated code artifacts

That absence is itself the main structural fact of the repository.

## Practical Navigation Notes
If a future implementation is added, it will likely need to introduce:

- a root source directory
- a public asset path
- route-level files for home, create, detail, run, settings, and about
- a domain layer for timers and session playback
- a persistence layer for Supabase and local caching

Nothing in the current tree conflicts with that future layout, because the implementation layer has not started yet.
