---
phase: 01-foundation-access-and-data-boundaries
plan: "03"
subsystem: database
tags: [supabase, rls, vitest, playwright, typescript]
requires: []
provides:
  - Phase 1 contract types for profiles, official templates, and personal timers
  - Supabase schema and RLS policies that separate public templates from owner-scoped timers
  - Unit and integration test coverage for the ownership boundary
affects:
  - 01-01 mobile shell and home composition work
  - 01-02 auth bootstrap and identity context
  - Phase 2 authoring and duplication flows
tech-stack:
  added: [vitest, @playwright/test, typescript]
  patterns:
    - owner-scoped repository query specs
    - duplicate-before-edit official template rule
    - SQL-first RLS contract validation
key-files:
  created:
    - playwright.config.ts
    - vitest.config.ts
    - tests/setup.ts
    - tests/unit/rls-boundary.test.ts
    - tests/integration/ownership-boundary.test.ts
    - src/features/profiles/contracts/profile.ts
    - src/features/templates/contracts/official-template.ts
    - src/features/timers/contracts/timer-record.ts
    - src/features/templates/repositories/official-templates.ts
    - src/features/timers/repositories/personal-timers.ts
    - supabase/migrations/202604150001_phase1_foundation.sql
    - supabase/seed.sql
  modified:
    - package.json
    - package-lock.json
decisions:
  - Separate official templates from personal timers in both SQL and repository contracts.
  - Treat missing owner context as a hard failure in repository scaffolding instead of falling back to broad reads.
  - Seed only public official templates so Phase 1 guest data never pollutes private ownership paths.
requirements-completed: [PRIV-01]
metrics:
  started: 2026-04-16T05:05:24Z
  completed: 2026-04-16T05:09:42Z
  duration: 4 min
  tasks: 3
  files: 14
---

# Phase 01 Plan 03: Ownership Boundary Summary

Supabase ownership boundary with public official templates, private personal timers, and executable Phase 1 contract tests.

## What Changed

1. Added the minimum Phase 1 test harness for unit, integration, and browser smoke commands, plus canonical profile, official-template, and personal-timer contracts.
2. Added a Supabase migration and seed path that model `official_templates`, `personal_timers`, and `profiles` separately, with explicit RLS and authenticated-owner policies on private tables.
3. Added repository scaffolding and tests that prove private timer reads fail closed without an owner context and that the SQL contract stays aligned with the typed repository assumptions.

## Verification

- `npm run test:unit -- rls-boundary`
- `npm run test:phase1 -- ownership-boundary`
- Confirmed `supabase/seed.sql` inserts only into `public.official_templates`

## Decisions Made

- Official starter templates remain an immutable public read path and are marked `duplicate-before-edit` for future authoring work.
- Repository access to `personal_timers` requires an authenticated owner id before any read or write spec is produced.
- The migration enables and forces RLS on private tables so unauthenticated access fails closed through both SQL policy scope and repository guards.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added the missing Phase 1 test dependencies**
- **Found during:** Task 1
- **Issue:** The repo only had `playwright`, so the planned `vitest`/TypeScript-based test harness could not run.
- **Fix:** Installed `vitest`, `typescript`, `@types/node`, and `@playwright/test`, then wired scripts/config against those packages.
- **Files modified:** `package.json`, `package-lock.json`
- **Verification:** `npm run test:unit -- rls-boundary`
- **Commit:** `405b084`

**2. [Rule 1 - Bug] Narrowed an over-broad integration assertion**
- **Found during:** Task 3
- **Issue:** The initial negative regex for `anon` access matched the public template policy block instead of only the private timer boundary.
- **Fix:** Tightened the assertion to the `personal_timers` grant/policy intent so the test checks the right contract.
- **Files modified:** `tests/integration/ownership-boundary.test.ts`
- **Verification:** `npm run test:phase1 -- ownership-boundary`
- **Commit:** `d9165d1`

**Total deviations:** 2 auto-fixed.

## Authentication Gates

None.

## Issues Encountered

None.

## Next Phase Readiness

Ready for the remaining Phase 1 plans to consume the shared contracts, repository scaffolding, and RLS assumptions without redefining the ownership model.

## Self-Check

PASSED.
