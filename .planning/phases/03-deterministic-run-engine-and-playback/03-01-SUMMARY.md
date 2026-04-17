---
phase: 03-deterministic-run-engine-and-playback
plan: "01"
subsystem: run-engine
tags: [nextjs, run-engine, deterministic-timing, session-storage, vitest]
requires:
  - phase: 02-authoring-library-crud-and-drafts
    provides: authored timer definitions and owner-scoped timer/template loading contracts
provides:
  - Deterministic run-sequence compiler with prep offsets and cumulative interval boundaries
  - Absolute elapsed-time frame derivation for current/next/remaining/progress playback context
  - Control-safe run engine transitions (pause/resume/previous/next/reset) without countdown drift
  - Session storage run snapshot persistence and same-page refresh recovery bootstrap
affects: [03-02 run UI controls, 03-03 device feedback integration, run route playback shell]
tech-stack:
  added: []
  patterns:
    - compile-once derive-on-tick run sequence architecture
    - monotonic elapsed-time source-of-truth for playback state
    - source-safe run view-model loading (personal timer vs template vs guest seed)
key-files:
  created:
    - src/features/run/contracts/run-sequence.ts
    - src/features/run/contracts/run-session.ts
    - src/features/run/engine/compile-run-sequence.ts
    - src/features/run/engine/derive-run-frame.ts
    - src/features/run/client/run-session-store.ts
    - src/features/run/client/use-run-engine.ts
    - src/features/run/client/run-engine-panel.tsx
    - src/features/run/server/get-run-view-model.ts
    - tests/unit/run-sequence.test.ts
    - tests/unit/run-frame.test.ts
    - tests/integration/run-view-model.test.ts
  modified:
    - app/run/page.tsx
key-decisions:
  - "Run playback timing derives from monotonic elapsed time instead of decrementing countdown state to avoid drift."
  - "Timer/template/guest run entry points compile into the same RunSequence contract before client playback starts."
  - "Active run sessions persist in sessionStorage and only restore when sequence/source metadata matches exactly."
patterns-established:
  - "Deterministic playback: compile boundaries once, derive frame context from elapsed time on every tick."
  - "Owner-safe run bootstrap: personal timers require signed-in ownership, while templates and guest seeds stay open."
requirements-completed: [RUN-02, RUN-03, RUN-04, RUN-05, RUN-06, RUN-07, RUN-08, RUN-09, RUN-13]
duration: 4 min
completed: 2026-04-16
---

# Phase 03 Plan 01: Deterministic Run Engine and Playback Summary

**Deterministic run playback now compiles timer/template/guest sources into stable boundaries and derives live frame state from absolute elapsed monotonic time with refresh-safe session recovery.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-04-16T23:10:53-07:00
- **Completed:** 2026-04-17T06:15:03Z
- **Tasks:** 3
- **Files modified:** 12

## Accomplishments

- Added run contracts and a deterministic sequence compiler that flattens intervals into cumulative start/end boundaries plus prep timing.
- Added pure frame derivation and a control-safe run engine hook that keeps pause/resume/previous/next/reset transitions drift-free.
- Added run session persistence + restore primitives and replaced the run placeholder with source-aware bootstrap and playback rendering.

## Task Commits

Each task was committed atomically:

1. **Task 1: Introduce run contracts and deterministic sequence compilation from timer/template sources** - `a90aa91` (feat)
2. **Task 2: Implement elapsed-time frame derivation and control-safe state transitions** - `2b295fc` (feat)
3. **Task 3: Add run session persistence and refresh recovery with integration validation** - `32030e3` (feat)

## Files Created/Modified

- `src/features/run/contracts/run-sequence.ts` - run sequence/domain contract for deterministic playback metadata.
- `src/features/run/contracts/run-session.ts` - session snapshot contract for active run lifecycle state.
- `src/features/run/engine/compile-run-sequence.ts` - interval flattening with cumulative offsets and prep support.
- `src/features/run/engine/derive-run-frame.ts` - pure frame derivation for current/next/remaining/progress context.
- `src/features/run/client/use-run-engine.ts` - monotonic elapsed-time engine and control transitions.
- `src/features/run/client/run-session-store.ts` - sessionStorage persistence/read/clear helpers.
- `src/features/run/client/run-engine-panel.tsx` - run playback panel wiring restore + persistence to engine state.
- `src/features/run/server/get-run-view-model.ts` - source-safe run bootstrap for timer/template/guest inputs.
- `app/run/page.tsx` - server bootstrap and fallback UI replacement for run mode.
- `tests/unit/run-sequence.test.ts` - deterministic sequence compiler regression tests.
- `tests/unit/run-frame.test.ts` - boundary and control-transition regression tests.
- `tests/integration/run-view-model.test.ts` - source-loading and owner-safe bootstrap integration coverage.

## Decisions Made

- Use monotonic elapsed time (`performance.now`) as the single playback source of truth and derive all live run context from it.
- Keep sequence compilation isolated on the server/view-model boundary so every source path feeds one deterministic run contract.
- Restore persisted sessions only when sequence/source metadata match exactly to prevent cross-timer recovery corruption.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added dedicated TSX run panel component to keep hook file type-safe**
- **Found during:** Task 2 verification (`run-frame`)
- **Issue:** JSX in `use-run-engine.ts` caused parser failure because `.ts` files cannot contain JSX.
- **Fix:** Moved render surface into `run-engine-panel.tsx` and kept `use-run-engine.ts` focused on deterministic engine logic.
- **Files modified:** `src/features/run/client/use-run-engine.ts`, `src/features/run/client/run-engine-panel.tsx`, `app/run/page.tsx`
- **Verification:** `npm run test:unit -- run-frame`, `npm run test:integration -- run-view-model`
- **Committed in:** `32030e3`

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** No scope creep; change only split rendering into TSX to keep planned deterministic engine implementation valid.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Deterministic engine primitives are in place for full-screen control/UI surfacing in `03-02`.
- Run bootstrap now accepts personal timer, official template, and guest seed sources through one compiled sequence pipeline.

---
*Phase: 03-deterministic-run-engine-and-playback*
*Completed: 2026-04-16*