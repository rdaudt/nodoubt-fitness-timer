---
phase: 01-foundation-access-and-data-boundaries
plan: "01"
subsystem: ui
tags: [nextjs, app-router, supabase, playwright, vitest, mobile-shell]
requires:
  - 01-02 auth bootstrap and identity context
  - 01-03 ownership boundary repositories and contracts
provides:
  - Shared mobile shell route group with bottom navigation and safe-area framing
  - Server-rendered home view-model that splits guest and signed-in entry states
  - Phase 1 route and home smoke coverage for shell-versus-run chrome rules
affects:
  - Phase 2 library CRUD flows
  - Phase 3 run-engine route integration
  - Ongoing Phase 1 auth and library regression coverage
tech-stack:
  added: []
  patterns:
    - App Router route groups for shell versus run chrome boundaries
    - server-first home view-model composition over auth and repository contracts
    - named Phase 1 verification filters routed through unit and Playwright runners
key-files:
  created:
    - app/(shell)/layout.tsx
    - app/(shell)/loading.tsx
    - app/(shell)/templates/page.tsx
    - app/run/layout.tsx
    - app/run/page.tsx
    - components/shell/mobile-shell.tsx
    - components/header/profile-chip.tsx
    - components/home/home-screen.tsx
    - components/home/my-timers-section.tsx
    - components/home/official-templates-section.tsx
    - src/features/home/server/get-home-view-model.ts
    - tests/unit/shell-routes.test.ts
    - tests/unit/home-view-model.test.ts
    - tests/e2e/phase1-home-shell.spec.ts
  modified:
    - app/layout.tsx
    - app/(shell)/page.tsx
    - scripts/test-phase1.mjs
    - tests/e2e/phase1-auth-session.spec.ts
decisions:
  - Use a dedicated `(shell)` route group to keep branded mobile chrome on home and templates while leaving `/run` chrome-free.
  - Resolve guest versus signed-in home state through one server-rendered view-model instead of separate page trees.
  - Keep official templates visible through fallback data in auth test mode so Phase 1 smoke tests remain meaningful without a live Supabase seed read.
requirements-completed: [LIBR-07, LIBR-08, TMPL-01]
metrics:
  started: 2026-04-16T08:28:41-07:00
  completed: 2026-04-16T08:47:57-07:00
  duration: 19 min
  tasks: 3
  files: 19
---

# Phase 01 Plan 01: Shell and Home Entry Summary

Shared mobile shell routes with auth-aware home ordering, official template visibility for guests and members, and a run route isolated from shell chrome.

## What Changed

1. Added a `(shell)` route group with a branded mobile frame, sticky bottom navigation, safe-area spacing, and a separate `/run` layout for future full-screen playback.
2. Replaced the placeholder auth boundary on `/` with a server-rendered home view-model that keeps official templates first for guests and `My Timers` first for signed-in users while preserving one shared screen composition.
3. Added focused unit and Playwright coverage for shell routing, guest-versus-signed-in section ordering, official template visibility, and the absence of shell navigation on `/run`.

## Verification

- `npm run test:unit -- shell-routes`
- `npm run test:unit -- home-view-model`
- `npm run test:phase1 -- guest-home signed-in-home`
- `npm run test:phase1`

## Task Commits

1. **Task 1: Build route groups and shell layouts around the Phase 1 entry contract** - `897260d` (`feat`)
2. **Task 2: Compose guest and signed-in home sections from the shared data and auth adapters** - `dc6264a` (`feat`)
3. **Task 3: Add route and home smoke coverage for the Phase 1 shell contract** - `1361e9d` (`test`)
4. **Task 3 auto-fix: stabilize named verification filters on Windows** - `f563001` (`fix`)
5. **Task 3 auto-fix: simplify Windows phase-runner spawning** - `378f802` (`fix`)
6. **Task 3 auto-fix: quote Playwright grep alternation for Windows shells** - `9b52bf6` (`fix`)

## Files Created/Modified

- `app/(shell)/layout.tsx` - shared shell route-group layout
- `app/(shell)/page.tsx` - server-rendered home entry using the Phase 1 home view-model
- `app/(shell)/templates/page.tsx` - official templates route inside the shared shell
- `app/run/layout.tsx` and `app/run/page.tsx` - chrome-free run-route contract for later playback work
- `components/shell/mobile-shell.tsx` - branded mobile frame with bottom navigation and safe-area handling
- `components/home/*` and `components/header/profile-chip.tsx` - shared guest/signed-in home composition and signed-in identity chip
- `src/features/home/server/get-home-view-model.ts` - auth-aware home section ordering and data loading
- `tests/unit/shell-routes.test.ts`, `tests/unit/home-view-model.test.ts`, `tests/e2e/phase1-home-shell.spec.ts` - shell and home regression coverage
- `scripts/test-phase1.mjs` - named-filter runner flow that works with Windows and Playwright

## Decisions Made

- Keep route-level shell chrome in a route group instead of branching inside the root layout so `/run` can evolve independently.
- Keep guest and signed-in entry differences data-driven through `getHomeViewModel()` so later library work reuses one composition path.
- Preserve official starter content through fallback previews during auth test mode rather than leaving guest home visually empty when no live data source is configured.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reworked the Phase 1 named-filter runner for Windows**
- **Found during:** Task 3 verification
- **Issue:** `npm run test:phase1 -- guest-home signed-in-home` failed because Vitest treated the forwarded names as file filters and `cmd.exe` parsed the Playwright alternation incorrectly.
- **Fix:** Routed unit/integration filters through `--testNamePattern`, invoked Playwright directly with an escaped `--grep` pattern, and simplified the Windows spawn path.
- **Files modified:** `scripts/test-phase1.mjs`
- **Verification:** `npm run test:phase1 -- guest-home signed-in-home`
- **Commits:** `1361e9d`, `f563001`, `378f802`, `9b52bf6`

**2. [Rule 1 - Bug] Relaxed signed-in profile-chip assertions to the rendered contract**
- **Found during:** Task 3 verification
- **Issue:** The new profile chip includes both an initial badge and first-name text, so exact-text smoke assertions failed even though the identity contract rendered correctly.
- **Fix:** Updated the auth and home smoke assertions to check for first-name presence instead of an exact raw-text match.
- **Files modified:** `tests/e2e/phase1-auth-session.spec.ts`, `tests/e2e/phase1-home-shell.spec.ts`
- **Verification:** `npm run test:phase1 -- guest-home signed-in-home`
- **Committed in:** `1361e9d`

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes were required to make the planned verification commands trustworthy. No scope creep beyond the Phase 1 shell contract.

## Issues Encountered

- Next.js 16 emits a `middleware` deprecation warning during Playwright startup. Existing auth/session behavior still passes; migration to the newer `proxy` convention can be handled separately.

## Authentication Gates

None.

## Next Phase Readiness

Phase 2 can now build library CRUD and authoring flows on top of a stable home-shell contract:

- Guests already land in the shared shell with official templates visible.
- Signed-in users already restore into a home state that prioritizes `My Timers`.
- `/run` is structurally isolated from shell navigation for later full-screen playback.

## Self-Check

PASSED.

- Summary file exists at `.planning/phases/01-foundation-access-and-data-boundaries/01-01-SUMMARY.md`.
- Verified commits: `897260d`, `dc6264a`, `1361e9d`, `f563001`, `378f802`, `9b52bf6`.
