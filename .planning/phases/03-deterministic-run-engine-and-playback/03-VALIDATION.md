---
phase: 03
slug: deterministic-run-engine-and-playback
status: ready
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-16
updated: 2026-04-16
---

# Phase 03 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest (unit + integration), Playwright (e2e), Node phase script runner |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command** | `npm run test:unit -- run-frame && npm run test:integration -- run-view-model` |
| **Full suite command** | `npm run test:phase3` |
| **Estimated runtime** | ~2-6 min local depending on browser startup |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit -- run-frame && npm run test:integration -- run-view-model` (or the task-specific verify command in PLAN)
- **After every plan wave:** Run `npm run test:phase3` once available (Plan 03-03); before then run all plan verification commands for completed waves
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** <= 10 minutes from code change to relevant automated result

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | RUN-02, RUN-03, RUN-04, RUN-05, RUN-06 | unit | `npm run test:unit -- run-sequence` | `tests/unit/run-sequence.test.ts` | pending |
| 03-01-02 | 01 | 1 | RUN-07, RUN-08, RUN-09 | unit | `npm run test:unit -- run-frame` | `tests/unit/run-frame.test.ts` | pending |
| 03-01-03 | 01 | 1 | RUN-13 | integration | `npm run test:integration -- run-view-model` | `tests/integration/run-view-model.test.ts` | pending |
| 03-02-01 | 02 | 2 | RUN-10, RUN-12, BRND-02 | e2e | `npm run test:e2e -- phase3-run-controls` | `tests/e2e/phase3-run-controls.spec.ts` | pending |
| 03-02-02 | 02 | 2 | LIBR-09, TMPL-03, RUN-01, RUN-11 | e2e | `npm run test:e2e -- phase3-run-controls` | `tests/e2e/phase3-run-controls.spec.ts` | pending |
| 03-02-03 | 02 | 2 | EDIT-12 | integration | `npm run test:integration -- run-edit-lock` | `tests/integration/run-edit-lock.test.ts` | pending |
| 03-03-01 | 03 | 3 | ALRT-01, ALRT-02, ALRT-03, ALRT-05 | unit | `npm run test:unit -- device-feedback` | `tests/unit/device-feedback.test.ts` | pending |
| 03-03-02 | 03 | 3 | ALRT-04 | integration | `npm run test:integration -- run-capability-fallback` | `tests/integration/run-capability-fallback.test.ts` | pending |
| 03-03-03 | 03 | 3 | ALRT-01, ALRT-02, ALRT-03, ALRT-04, ALRT-05 | e2e | `npm run test:phase3` | `scripts/test-phase3.mjs` | pending |

*Status: pending | green | red | flaky*

---

## Wave 0 Requirements

- Existing infrastructure already present: `vitest.config.ts`, `playwright.config.ts`, `test:unit`, `test:integration`, `test:e2e`, `test:phase1`, `test:phase2`.
- No Wave 0 bootstrap tasks are required for this phase.
- Plan 03-03 adds `test:phase3` and `scripts/test-phase3.mjs` as phase deliverables, not pre-phase blockers.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Portrait readability from across-room distance under real device brightness | RUN-12, BRND-02 | Objective readability and brand-weight assessment is visual and context-dependent | On a physical phone, start a run and verify timer text and controls remain legible at workout distance while branding remains secondary during active playback. |
| Real-device vibration and wake-lock behavior consistency by browser | ALRT-03, ALRT-05 | Emulator/browser mocks cannot prove all device/browser combinations | On iOS Safari and Android Chrome, run a timer and confirm vibration/wake-lock behavior where supported, then confirm fallback notice behavior where unsupported or denied. |

---

## Validation Sign-Off

- [x] All tasks have automated verify commands and mapped requirement IDs
- [x] Sampling continuity maintained across all plans and waves
- [x] Wave 0 not required; baseline test infrastructure already exists
- [x] No watch-mode flags in verification commands
- [x] Feedback latency target defined and realistic for local CI-style loops
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** pending execution
