# Phase 2 Research: Authoring, Library CRUD, and Drafts

## What This Phase Must Deliver

Phase 2 turns the Phase 1 foundation into usable timer authoring flows:

- signed-in library CRUD for personal timers and drafts
- official-template detail and duplicate-to-personal behavior
- quick-create and custom-create entry flows
- full timer editor with interval management and auto-save drafts

This phase should avoid run-engine assumptions from Phase 3 and focus on data and authoring correctness.

## Inputs Used

- `.planning/PROJECT.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/STATE.md`
- `.planning/phases/01-foundation-access-and-data-boundaries/01-01-SUMMARY.md`
- `.planning/phases/01-foundation-access-and-data-boundaries/01-02-SUMMARY.md`
- `.planning/phases/01-foundation-access-and-data-boundaries/01-03-SUMMARY.md`
- `docs/PRD.md`
- `docs/MOBILE_IA_WIREFRAME_SPEC.md`
- `docs/MOBILE_BRANDING_SYSTEM.md`

## Architecture Guidance

1. Keep one timer-definition contract for official templates, personal timers, and drafts.
2. Keep official templates read-only and duplicate into personal scope before edits.
3. Keep guest-created timer work in local temporary storage unless user opts into sign-in/save.
4. Keep editor auto-save server-side only for signed-in users, with debounced writes and draft markers.
5. Keep detail screen as the canonical review boundary for both official templates and personal timers.

## Data and Repository Guidance

- Extend personal-timer repository functions to support:
  - list/search/sort by `updated_at`
  - rename/delete/duplicate operations
  - draft filtering
  - create-from-template behavior
- Add timer-detail read adapters for:
  - official template detail
  - personal timer detail
- Add save/update repository APIs for editor operations:
  - interval CRUD and reordering
  - warmup/cooldown and repeat/rest configuration
  - derived duration computation

## UX and Flow Guidance

- `Create` navigation action should branch to timer-type entry points:
  - HIIT
  - Circuit/Tabata
  - Round
  - Custom
- Quick-create flows should produce a valid timer draft immediately with default name.
- Guest save prompts should be non-blocking and dismissible.
- Draft states must be visible and discoverable from library.

## Requirement-to-Plan Partition

- Plan 02-01: library/detail/duplicate/CRUD baseline
- Plan 02-02: create entry flows and guest temporary timers
- Plan 02-03: editor operations, derived duration, and auto-save drafts

This partition keeps dependencies clear and allows execute-phase wave sequencing.

## Risks and Mitigations

- Risk: editor complexity grows too early.
  - Mitigation: isolate editor plan after library/detail/create scaffolding.
- Risk: guest flow collides with signed-in persistence model.
  - Mitigation: explicit temp-timer store and explicit save prompts.
- Risk: requirement drift across 30 IDs.
  - Mitigation: assign all IDs in plan frontmatter and verify before execution.

## Validation Architecture

Validation should combine:

- unit tests for view-models, repositories, and transformation logic
- integration tests for ownership-safe CRUD behavior
- e2e tests for create/detail/editor happy paths and guest-save prompts

Phase test commands should remain name-filterable to keep feedback fast:

- `npm run test:unit -- <named-slice>`
- `npm run test:integration -- <named-slice>`
- `npm run test:phase2 -- <named-slice>`

## Recommended Wave Strategy

- Wave 1: `02-01` (library/detail/duplicate contracts)
- Wave 2: `02-02` (create entry and guest temp/save prompts) depends on `02-01`
- Wave 3: `02-03` (full editor + autosave drafts) depends on `02-01` and `02-02`

This keeps the editor from landing before supporting route/data contracts exist.
