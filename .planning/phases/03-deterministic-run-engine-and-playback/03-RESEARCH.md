# Phase 3 Research: Deterministic Run Engine and Playback

## Objective
Answer what is needed to plan and execute Phase 3 well, using the current repository implementation as the baseline.

## Inputs Reviewed
- `.planning/STATE.md`
- `.planning/ROADMAP.md`
- `.planning/REQUIREMENTS.md`
- `.planning/PROJECT.md`
- `.planning/phases/02-authoring-library-crud-and-drafts/02-01-SUMMARY.md`
- `.planning/phases/02-authoring-library-crud-and-drafts/02-02-SUMMARY.md`
- `.planning/phases/02-authoring-library-crud-and-drafts/02-03-SUMMARY.md`
- `CLAUDE.md` (not present in this repo)
- Current app code under `app/`, `components/`, `src/features/`, `tests/`, and Supabase migration files.

## 1) Current Implementation Baseline and Reusable Components/Contracts

### Existing baseline relevant to Phase 3
- Run route shell boundary already exists and is isolated from bottom navigation:
  - `app/run/layout.tsx`
  - `app/run/page.tsx` (placeholder UI only)
- Run entry points already exist in detail flows:
  - Personal timer detail: `/run?timerId=...` in `app/(shell)/timers/[id]/page.tsx`
  - Official template detail: `/run?templateSlug=...` in `app/(shell)/templates/[slug]/page.tsx`
- Timer authoring is now stable and deterministic at data-definition level:
  - `TimerRecord` / `TimerIntervalBlock` in `src/features/timers/contracts/timer-record.ts`
  - Editor transforms and duration derivation in:
    - `src/features/editor/client/editor-state.ts`
    - `src/features/editor/client/derive-total-seconds.ts`
  - Signed-in draft autosave and owner-scoped persistence in:
    - `src/features/editor/server/save-editor-draft.ts`
    - `src/features/timers/repositories/personal-timers.ts`
- Template immutability and duplicate-before-edit are already enforced:
  - `src/features/templates/repositories/official-templates.ts`

### Reusable contracts/patterns to keep
- Keep server-action-first and owner-scoped repo patterns already used by Phase 2 CRUD/detail/editor pages.
- Keep auth-test-mode parity pattern (`isAuthTestMode`) so run behavior can be tested without live Supabase.
- Keep typed view-model layer pattern (`get*ViewModel`) for route rendering.
- Keep test slice conventions and extend with `test:phase3` (parallel to existing `test:phase1` and `test:phase2`).

### Gap summary
- No deterministic run engine exists yet.
- No run session persistence, playback controls, completion flow, or edit-lock enforcement exists yet.
- Home/library cards currently do not expose explicit `Run now` actions (required by `LIBR-09`).
- No audio/haptics/wake-lock integration exists yet.

## 2) Architecture Proposal for Deterministic Timing from Absolute Elapsed Time

### Core principle
Use absolute elapsed time as the source of truth, not decrementing countdown state.  
All displayed times and transitions derive from:
- `elapsedMs = nowMonotonicMs - anchorMonotonicMs - totalPausedMs`

### Proposed domain modules
- `src/features/run/contracts/run-sequence.ts`
- `src/features/run/contracts/run-session.ts`
- `src/features/run/engine/compile-run-sequence.ts`
- `src/features/run/engine/derive-run-frame.ts`
- `src/features/run/client/run-session-store.ts`
- `src/features/run/client/use-run-engine.ts`
- `src/features/run/client/device-feedback.ts` (audio/haptics/wake-lock orchestration)
- `src/features/run/server/get-run-view-model.ts`

### Compile once, derive always
1. Compile timer/template intervals into a flattened sequence with cumulative absolute boundaries.
2. Store segment start/end offsets in milliseconds.
3. For each animation tick, derive active segment from `elapsedMs` by boundary lookup.
4. Trigger transitions/cues based on boundary crossing between previous and current elapsed values.

This removes drift from `setInterval`/countdown mutation and survives render pauses.

### Proposed session state shape
- `sessionId`
- `sourceKind` (`personal-timer` | `official-template` | `guest-temp`)
- `sourceRef` (`timerId` or `templateSlug` or `guestTempId`)
- `sequenceVersionHash`
- `status` (`prep` | `running` | `paused` | `completed`)
- `anchorMonotonicMs`
- `totalPausedMs`
- `pausedAtMonotonicMs | null`
- `manualOffsetMs` (for previous/next/reset adjustments)
- `controlsLocked`
- `startedAtEpochMs`
- `lastUpdatedEpochMs`

### Control behavior without drift
- Pause: capture `pausedAtMonotonicMs`.
- Resume: add `(now - pausedAtMonotonicMs)` to `totalPausedMs`.
- Previous/Next: update `manualOffsetMs` to target segment boundary.
- Reset (with confirmation): set elapsed to prep/start boundary and clear completion state.
- Completion: derive from `elapsedMs >= totalSequenceMs`, then render completion screen state.

### Session recovery and edit-lock
- Persist active run session snapshot to `sessionStorage` for `RUN-13` (refresh survival while page remains open).
- Mirror a lightweight active-run marker via session cookie (same-browser-tab set/clear) so server-rendered edit/detail routes can short-circuit edit affordances for `EDIT-12`.
- On stale marker/session mismatch, fail closed on editing until marker is cleared by explicit reset/complete/abort handling.

### UI architecture fit
- Keep `app/run/layout.tsx` as full-screen host.
- Replace `app/run/page.tsx` with server view-model loading + client run screen component.
- Add `components/run/run-screen.tsx` and `components/run/completion-screen.tsx`.
- Preserve branding guidance from `docs/MOBILE_BRANDING_SYSTEM.md`: minimal branding during active run (`BRND-02`), subtle branding allowed on completion.

## 3) Risks/Pitfalls and Mitigations

- Drift caused by interval-based ticking:
  - Mitigation: absolute elapsed derivation from monotonic time (`performance.now()`), never decrement state counters.
- Missed transition cues after tab jank/frame drops:
  - Mitigation: boundary-crossing detection between previous and current elapsed instead of exact equality checks.
- Autoplay restrictions and audio initialization failures:
  - Mitigation: explicit user-interaction priming step on run start; show capability notices and fallback states (`ALRT-04`).
- Wake Lock unsupported/denied:
  - Mitigation: capability detect, non-blocking notice, continue deterministic run without wake lock (`ALRT-04`, `ALRT-05`).
- Haptics unsupported on device/browser:
  - Mitigation: detect `navigator.vibrate`, degrade to visual+audio only with explicit state (`ALRT-03`, `ALRT-04`).
- Editing during active run not blocked consistently:
  - Mitigation: shared active-run marker checked by run entry, detail actions, and edit route/view-model gating (`EDIT-12`).
- Template/personal/guest source divergence:
  - Mitigation: one compiled sequence contract regardless of source; source-specific loading only in view-model layer.

## 4) Test Strategy (Unit/Integration/E2E)

### Unit
- `compile-run-sequence`:
  - deterministic flattening, cumulative offsets, total duration, prep insertion.
- `derive-run-frame`:
  - active interval, next interval, total remaining, progress counters at key boundaries.
- control reducers:
  - pause/resume/previous/next/reset/lock transitions.
- device feedback adapters:
  - capability detection and fallback state mapping.

### Integration
- `get-run-view-model`:
  - source loading for `timerId`, `templateSlug`, and guest temp.
  - owner-scope enforcement for personal timers.
- edit lock gates:
  - active run marker prevents edit route readiness for the same timer.
- run entry actions:
  - detail and home/library `Run now` paths resolve into consistent run session bootstrap.

### E2E (Playwright)
- Start from personal detail, template detail, and explicit home/library card action (`LIBR-09`, `TMPL-03`, `RUN-01`).
- Prep countdown, pause/resume, previous/next, reset-confirm, lock/unlock, completion, run again (`RUN-06`..`RUN-11`).
- Refresh during active run and verify state recovery (`RUN-13`).
- Capability fallback scenarios (mocked/no audio/no vibration/no wake lock) for `ALRT-04`.

## 5) Suggested Plan Split into 03-01 / 03-02 / 03-03

### 03-01: Deterministic sequence compiler and run-state engine
Focus:
- Introduce run contracts and deterministic engine from absolute elapsed time.
- Add run session store and view-model loading for timer/template/guest-temp sources.
- Add unit/integration coverage for compile/derive/control state.

Primary requirements:
- `RUN-02`, `RUN-03`, `RUN-04`, `RUN-05`, `RUN-06`, `RUN-07`, `RUN-08`, `RUN-09`, `RUN-13`

### 03-02: Run UI, controls, entry points, completion, and edit lock
Focus:
- Build full run screen and completion screen components.
- Wire explicit `Run now` actions on home/library cards and keep detail entry points.
- Implement control lock UX and reset confirmation.
- Enforce no-edit-while-running contract.
- Apply run-mode branding restraint.

Primary requirements:
- `LIBR-09`, `TMPL-03`, `EDIT-12`, `RUN-01`, `RUN-10`, `RUN-11`, `RUN-12`, `BRND-02`

### 03-03: Device feedback, wake lock, and graceful degradation
Focus:
- Audio transition cues and final countdown cue.
- Haptics integration.
- Wake-lock lifecycle handling.
- Browser capability fallback messaging and test coverage.

Primary requirements:
- `ALRT-01`, `ALRT-02`, `ALRT-03`, `ALRT-04`, `ALRT-05`

## Validation Architecture

Nyquist-ready validation for this phase should prove both deterministic timing correctness and user-facing reliability contracts:

- Deterministic invariants:
  - elapsed-time derivation is monotonic except explicit control actions.
  - active segment is a pure function of elapsed and compiled boundaries.
  - pause duration is excluded exactly once from elapsed.
- Contract invariants:
  - timer/template/guest sources compile through one engine contract.
  - editing is blocked while same timer is actively running.
  - refresh restores active run session while page remains open.
- Capability invariants:
  - audio/haptics/wake-lock unsupported paths do not crash or block run progression.
  - fallback notices are visible and accurate.
- Verification gates per plan:
  - `03-01`: unit + integration deterministic math and state transitions.
  - `03-02`: e2e control flows, run entry points, completion, edit lock.
  - `03-03`: e2e/device-mock feedback and fallback behavior.

This architecture gives clear pass/fail evidence for every Phase 3 requirement ID and supports a future `03-VALIDATION.md` without rework.
