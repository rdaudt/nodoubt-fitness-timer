---
phase: 01
slug: foundation-access-and-data-boundaries
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-15
---

# Phase 01 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `vitest` for app/unit/integration checks plus `playwright` for route/auth smoke coverage |
| **Config file** | none - Wave 0 installs and wires `vitest.config.ts` / `playwright.config.ts` |
| **Quick run command** | `npm run test:unit` |
| **Full suite command** | `npm run test:phase1` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test:unit`
- **After every plan wave:** Run `npm run test:phase1`
- **Before `$gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 0 | LIBR-07, LIBR-08 | integration | `npm run test:unit -- shell-routes` | ❌ W0 | ⬜ pending |
| 01-01-02 | 01 | 0 | LIBR-07, LIBR-08, TMPL-01, SETG-02 | integration | `npm run test:unit -- home-view-model` | ❌ W0 | ⬜ pending |
| 01-01-03 | 01 | 1 | TMPL-01, SETG-02 | playwright | `npm run test:phase1 -- guest-home signed-in-home` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 0 | AUTH-01, AUTH-02, AUTH-03 | integration | `npm run test:unit -- auth-bootstrap` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | AUTH-02, AUTH-03, SETG-02 | playwright | `npm run test:phase1 -- auth-session` | ❌ W0 | ⬜ pending |
| 01-03-01 | 03 | 0 | PRIV-01 | integration | `npm run test:unit -- rls-boundary` | ❌ W0 | ⬜ pending |
| 01-03-02 | 03 | 1 | PRIV-01, TMPL-01 | integration | `npm run test:phase1 -- ownership-boundary` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` - base test runner config for Phase 1 checks
- [ ] `playwright.config.ts` - browser smoke/integration config aligned to the app shell
- [ ] `tests/unit/shell-routes.test.ts` - guest vs signed-in home split coverage
- [ ] `tests/unit/home-view-model.test.ts` - guest/signed-in home composition and section-ordering coverage
- [ ] `tests/unit/auth-bootstrap.test.ts` - SSR/bootstrap auth-state coverage
- [ ] `tests/unit/rls-boundary.test.ts` - ownership boundary and policy contract coverage
- [ ] `tests/e2e/phase1-auth-shell.spec.ts` - guest/signed-in route and session-restore smoke checks
- [ ] `package.json` scripts for `test:unit` and `test:phase1`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Google sign-in round trip works with the real provider in local/dev deployment | AUTH-02 | OAuth redirect/cookie flow depends on provider and environment wiring | Sign in with Google in a real browser, verify redirect back to app, signed-in header chip, and persistent session after refresh |
| Bottom navigation appears on the guest/signed-in home shell and is absent from the full-screen run route shell | LIBR-07, LIBR-08 | Visual shell behavior is easiest to validate in-browser before the run engine exists | Open guest and signed-in home pages plus the run-route placeholder, confirm nav visibility matches the Phase 1 shell contract |
| Another user's data cannot be accessed through direct Supabase reads | PRIV-01 | RLS failures are high-risk and should be verified against a live database, not only mocked tests | Use two accounts or service-role-assisted inspection to confirm authenticated user A cannot read/write user B personal rows |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
