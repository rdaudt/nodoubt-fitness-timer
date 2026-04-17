---
phase: 03-deterministic-run-engine-and-playback
plan: "02"
subsystem: ui
tags: [nextjs, run-ui, playback-controls, playwright, edit-lock]
requires:
  - phase: 03-deterministic-run-engine-and-playback
    provides: deterministic run engine, run sequence contracts, and refresh-safe run session persistence
provides:
  - Portrait-first full-screen run playback UI with distance-readable timing and interval context
  - Playback controls including pause/resume, previous/next, reset-confirm, and control lock/unlock
  - Run entry actions from home cards, library cards, timer detail, and template detail
  - Completion flow with run-again and return-home actions
  - Active-run edit locks in library/detail/editor view-models with malformed-marker fail-closed behavior
affects: [03-03 device feedback and wake lock, run route UX, editor guardrails]
tech-stack:
  added: []
  patterns:
    - active-run cookie marker handshake between run client and server-rendered editor/detail guards
    - run-first card actions that keep detail review as secondary navigation
key-files:
  created:
    - components/run/run-controls.tsx
    - components/run/run-screen.tsx
    - components/run/completion-screen.tsx
    - tests/e2e/phase3-run-controls.spec.ts
    - tests/integration/run-edit-lock.test.ts
    - scripts/test-phase3.mjs
  modified:
    - app/run/layout.tsx
    - app/run/page.tsx
    - app/(shell)/timers/[id]/page.tsx
    - app/(shell)/templates/[slug]/page.tsx
    - components/home/home-screen.tsx
    - components/library/library-screen.tsx
    - src/features/run/client/use-run-engine.ts
    - src/features/timers/server/get-library-view-model.ts
    - src/features/timers/server/get-timer-detail-view-model.ts
    - src/features/editor/server/get-editor-view-model.ts
    - package.json
key-decisions:
  - "Use a lightweight ndft-active-run cookie marker so server-rendered detail/editor routes can enforce edit locks while playback is active."
  - "Treat malformed active-run markers as locked (fail closed) to protect against stale or corrupted client state."
  - "Define test:phase3 as a phase-scoped runner for run unit/integration/e2e slices instead of unrelated historical e2e coverage."
patterns-established:
  - "Run entry parity: every major timer surface now exposes explicit Run now actions while preserving review/detail links."
  - "Completion-first exit: run completion surfaces return-home as primary with run-again secondary."
requirements-completed: [LIBR-09, TMPL-03, EDIT-12, RUN-01, RUN-10, RUN-11, RUN-12, BRND-02]
duration: 13 min
completed: 2026-04-17
---

# Phase 03 Plan 02: Run UI, Entry Points, and Edit-Lock Summary

**Run mode now ships a portrait-first full-screen playback UI with lockable controls, multi-surface Run now entry points, completion actions, and active-run edit safety gates.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-04-16T23:25:08-07:00
- **Completed:** 2026-04-17T06:38:08Z
- **Tasks:** 3
- **Files modified:** 17

## Accomplishments

- Replaced placeholder run UI with a production playback surface and control bar for pause/resume, previous/next, reset confirmation, and lock/unlock interactions.
- Added explicit Run now actions on signed-in home cards, template cards, library cards, and updated detail/template action labels for immediate run entry.
- Added completion UX with timer identity, elapsed summary, run-again, and return-home actions.
- Enforced active-run edit lock guardrails in server view-model loaders and added integration coverage for lock and fail-closed behavior.

## Task Commits

Each task was committed atomically:

1. **Task 1: Build run screen layout and complete playback control surface** - `f67d862` (feat)
2. **Task 2: Wire run entry points and completion flow across timer sources** - `3aa4785` (feat)
3. **Task 3: Enforce no-edit-while-running guardrails in editor/detail loading** - `764a22a` (feat)

Additional support commit:

- **Phase verification runner:** `f465cd7` (chore)

## Files Created/Modified

- `components/run/run-screen.tsx` - Primary run playback UI, completion handoff, and active-run cookie/session marker management.
- `components/run/run-controls.tsx` - Playback controls with reset confirmation and lock/unlock behavior.
- `components/run/completion-screen.tsx` - Completion UX with elapsed summary plus return-home and run-again actions.
- `components/home/home-screen.tsx` - Explicit Run now actions for personal and official template cards with review paths preserved.
- `components/library/library-screen.tsx` - Explicit Run now action per library card.
- `app/(shell)/timers/[id]/page.tsx` - Detail action updated to Run now affordance.
- `app/(shell)/templates/[slug]/page.tsx` - Template detail action updated to Run now affordance.
- `src/features/timers/server/get-library-view-model.ts` - Active-run lock metadata on library items.
- `src/features/timers/server/get-timer-detail-view-model.ts` - Active-run lock status on timer detail view models.
- `src/features/editor/server/get-editor-view-model.ts` - Run-locked editor state gating when active marker matches or is malformed.
- `tests/e2e/phase3-run-controls.spec.ts` - End-to-end run entry/control/completion coverage.
- `tests/integration/run-edit-lock.test.ts` - Integration lock tests for editor/detail/library guard behavior.

## Decisions Made

- Use a shared `ndft-active-run` cookie marker as the server-readable lock source for edit guardrails.
- Fail closed when active marker parsing fails so edits stay blocked until run state is explicitly reset or completed.
- Keep phase verification deterministic with a dedicated `test:phase3` slice runner.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Stabilized run engine clock dependency to prevent render loops**
- **Found during:** Task 2 (`phase3-run-controls` e2e)
- **Issue:** `useRunEngine` recreated the default clock every render, triggering an effect loop and unstable controls.
- **Fix:** Memoized clock resolution in `useRunEngine`.
- **Files modified:** `src/features/run/client/use-run-engine.ts`
- **Verification:** `npm run test:e2e -- phase3-run-controls`
- **Committed in:** `3aa4785`

**2. [Rule 3 - Blocking] Added missing phase-scoped test runner required by verification contract**
- **Found during:** Plan verification (`npm run test:phase3` missing)
- **Issue:** `test:phase3` script was absent, blocking required verification.
- **Fix:** Added `scripts/test-phase3.mjs` and wired `package.json` script.
- **Files modified:** `scripts/test-phase3.mjs`, `package.json`
- **Verification:** `npm run test:phase3`
- **Committed in:** `f465cd7`

---

**Total deviations:** 2 auto-fixed (1 bug, 1 blocking)
**Impact on plan:** Both changes were required for reliable run-mode behavior and to satisfy the plan's verification gates; no scope creep.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Run UI and interaction contracts are in place for Phase 03-03 device feedback and capability fallback integration.
- Edit-lock guardrails are protected by integration tests, reducing regression risk for follow-on run-side effects.

---
*Phase: 03-deterministic-run-engine-and-playback*
*Completed: 2026-04-17*
