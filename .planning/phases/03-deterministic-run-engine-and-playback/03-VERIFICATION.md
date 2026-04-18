---
phase: 03
slug: deterministic-run-engine-and-playback
status: human_needed
verified_at: 2026-04-16T23:59:07-07:00
requirements_verified:
  - LIBR-09
  - TMPL-03
  - EDIT-12
  - RUN-01
  - RUN-02
  - RUN-03
  - RUN-04
  - RUN-05
  - RUN-06
  - RUN-07
  - RUN-08
  - RUN-09
  - RUN-10
  - RUN-11
  - RUN-12
  - RUN-13
  - ALRT-01
  - ALRT-02
  - ALRT-03
  - ALRT-04
  - ALRT-05
  - BRND-02
must_have_score:
  passed: 30
  total: 30
human_verification_needed: true
gaps_found: false
---

# Phase 03 Verification

Phase 03 implementation achieves the run-engine/playback objective at code level and in automated checks: deterministic elapsed-time playback, clear live context, run controls, multi-entry run access, edit lock while running, and browser-aware fallback behavior are all present and exercised.

## Status

- **Overall status:** `human_needed`
- **Why not `passed`:** final confidence for across-room readability/brand balance and real-device haptics/wake-lock needs physical-browser validation.
- **Code/product gap status:** no blocking implementation gaps found.

## Must-Have Scoring

| Area | Score | Notes |
|------|-------|-------|
| 03-01 deterministic engine must-haves | 10/10 | Truths, artifacts, and key links verified in code and tests. |
| 03-02 run UI and controls must-haves | 10/10 | Entry points, controls, completion, and edit lock implemented and tested. |
| 03-03 feedback/fallback must-haves | 10/10 | Audio/haptics/wake-lock orchestration and fallback notice behavior implemented and tested. |
| **Total** | **30/30** | Implementation-level must-haves are satisfied. |

## Targeted Checks Run

- `npm run test:phase3` ?
  - Unit: `run-sequence`, `run-frame`, `device-feedback`
  - Integration: `run-view-model`, `run-edit-lock`, `run-capability-fallback`
  - E2E: `phase3-run-controls`, `phase3-device-feedback`

## Requirement Traceability

| Requirement | Coverage | Evidence |
|-------------|----------|----------|
| LIBR-09 | covered | `components/home/home-screen.tsx`, `components/library/library-screen.tsx`, `tests/e2e/phase3-run-controls.spec.ts` |
| TMPL-03 | covered | `app/(shell)/templates/[slug]/page.tsx`, `src/features/run/server/get-run-view-model.ts`, `tests/e2e/phase3-run-controls.spec.ts` |
| EDIT-12 | covered | `src/features/editor/server/get-editor-view-model.ts`, `src/features/timers/server/get-timer-detail-view-model.ts`, `tests/integration/run-edit-lock.test.ts` |
| RUN-01 | covered | `app/(shell)/timers/[id]/page.tsx`, `app/(shell)/templates/[slug]/page.tsx`, `app/(shell)/create/hiit/page.tsx`, `tests/e2e/phase3-run-controls.spec.ts` |
| RUN-02 | covered | `components/run/run-screen.tsx`, `src/features/run/engine/derive-run-frame.ts`, `tests/e2e/phase3-run-controls.spec.ts` |
| RUN-03 | covered | `components/run/run-screen.tsx`, `src/features/run/engine/derive-run-frame.ts`, `tests/unit/run-frame.test.ts` |
| RUN-04 | covered | `components/run/run-screen.tsx`, `src/features/run/engine/derive-run-frame.ts`, `tests/unit/run-frame.test.ts` |
| RUN-05 | covered | `components/run/run-screen.tsx`, `src/features/run/engine/derive-run-frame.ts`, `tests/unit/run-frame.test.ts` |
| RUN-06 | covered | `src/features/run/engine/compile-run-sequence.ts`, `src/features/run/engine/derive-run-frame.ts`, `tests/unit/run-frame.test.ts` |
| RUN-07 | covered | `src/features/run/client/use-run-engine.ts`, `components/run/run-controls.tsx`, `tests/unit/run-frame.test.ts`, `tests/e2e/phase3-run-controls.spec.ts` |
| RUN-08 | covered | `src/features/run/client/use-run-engine.ts`, `components/run/run-controls.tsx`, `tests/unit/run-frame.test.ts`, `tests/e2e/phase3-run-controls.spec.ts` |
| RUN-09 | covered | `components/run/run-controls.tsx`, `components/run/run-screen.tsx`, `tests/e2e/phase3-run-controls.spec.ts` |
| RUN-10 | covered | `components/run/run-controls.tsx`, `components/run/run-screen.tsx`, `tests/e2e/phase3-run-controls.spec.ts` |
| RUN-11 | covered | `components/run/completion-screen.tsx`, `components/run/run-screen.tsx`, `tests/e2e/phase3-run-controls.spec.ts` |
| RUN-12 | human_needed | `app/run/layout.tsx`, `components/run/run-screen.tsx`, `app/(shell)/layout.tsx`; physical readability check still needed. |
| RUN-13 | covered | `src/features/run/client/run-session-store.ts`, `components/run/run-screen.tsx`, `src/features/run/client/use-run-engine.ts` |
| ALRT-01 | covered | `src/features/run/client/device-feedback.ts`, `src/features/run/client/use-run-engine.ts`, `tests/unit/device-feedback.test.ts` |
| ALRT-02 | covered | `src/features/run/contracts/playback-defaults.ts`, `src/features/run/client/use-run-engine.ts`, `tests/unit/device-feedback.test.ts` |
| ALRT-03 | human_needed | `src/features/run/client/device-feedback.ts`, `tests/unit/device-feedback.test.ts`; real device vibration still needed. |
| ALRT-04 | covered | `components/run/run-capability-notice.tsx`, `components/run/run-screen.tsx`, `tests/integration/run-capability-fallback.test.ts`, `tests/e2e/phase3-device-feedback.spec.ts` |
| ALRT-05 | human_needed | `src/features/run/client/device-feedback.ts`, `tests/unit/device-feedback.test.ts`; real wake-lock confirmation still needed. |
| BRND-02 | human_needed | `app/run/layout.tsx`, `components/run/run-screen.tsx`, `tests/e2e/phase3-run-controls.spec.ts`; final visual weighting check needed. |

## Gaps

No implementation gaps found for Phase 03 requirement scope.

## Human Verification Needed

1. On physical phone(s), confirm across-room readability and that branding remains secondary during active run mode.
2. On Android Chrome and iOS Safari, verify haptics and wake-lock behavior where supported, and confirm fallback messaging when blocked/unsupported.
3. In-browser manual refresh test during active run to confirm practical session restore UX on target devices.

## Conclusion

Phase 03 is **functionally complete and test-green** for deterministic run playback and browser-aware feedback/fallback behavior. Final sign-off should be granted after the listed physical-device checks.
