---
phase: 02
slug: authoring-library-crud-and-drafts
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-16
---

# Phase 02 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `vitest` (unit/integration) + `playwright` (e2e) |
| **Config file** | `vitest.config.ts`, `playwright.config.ts` |
| **Quick run command** | `npm run test:unit` |
| **Full suite command** | `npm run test:phase2` |
| **Estimated runtime** | ~90 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit -- <named-slice>`
- **After every plan wave:** Run `npm run test:phase2 -- <named-slice>`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 90 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | LIBR-01, LIBR-02, LIBR-06 | unit | `npm run test:unit -- library-view-model` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | TMPL-02, TMPL-04, TMPL-05, EDIT-01 | integration | `npm run test:integration -- detail-duplicate` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | LIBR-03, LIBR-04, LIBR-05 | e2e | `npm run test:phase2 -- library-crud` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 2 | CRTE-01, CRTE-02, CRTE-03, CRTE-04, CRTE-06 | unit | `npm run test:unit -- create-entry` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 2 | CRTE-07, CRTE-08, CRTE-09, CRTE-10 | e2e | `npm run test:phase2 -- guest-create-save` | ❌ W0 | ⬜ pending |
| 02-02-03 | 02 | 2 | CRTE-05 | integration | `npm run test:integration -- custom-create` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 3 | EDIT-02, EDIT-03, EDIT-04, EDIT-05, EDIT-06 | unit | `npm run test:unit -- editor-intervals` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 3 | EDIT-07, EDIT-08, EDIT-09 | integration | `npm run test:integration -- editor-structure` | ❌ W0 | ⬜ pending |
| 02-03-03 | 03 | 3 | EDIT-10, EDIT-11 | e2e | `npm run test:phase2 -- editor-drafts` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `scripts/test-phase2.mjs` - named-slice phase runner for unit/integration/e2e
- [ ] `package.json` scripts for `test:phase2`
- [ ] `tests/unit/library-view-model.test.ts`
- [ ] `tests/integration/detail-duplicate.test.ts`
- [ ] `tests/e2e/phase2-library-crud.spec.ts`
- [ ] `tests/unit/create-entry.test.ts`
- [ ] `tests/e2e/phase2-guest-create-save.spec.ts`
- [ ] `tests/unit/editor-intervals.test.ts`
- [ ] `tests/integration/editor-structure.test.ts`
- [ ] `tests/e2e/phase2-editor-drafts.spec.ts`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Guest sign-in prompt copy/placement feels non-blocking while creating timers | CRTE-08, CRTE-09, CRTE-10 | UX clarity and interruption tolerance are subjective | Walk guest create flows on mobile viewport, dismiss prompt, continue editing, and verify no forced redirect |
| Editor interaction density remains usable on mobile viewport with realistic interval counts | EDIT-02 to EDIT-09 | Visual spacing and control ergonomics need human review | Create a 15+ interval timer on mobile viewport and validate add/edit/reorder affordances remain usable |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
