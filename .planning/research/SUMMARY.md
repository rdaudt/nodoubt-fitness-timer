# Project Research Summary

**Project:** No Doubt Fitness Timer
**Domain:** Mobile-first web/PWA interval timer for structured workouts
**Researched:** 2026-04-15
**Confidence:** HIGH

## Executive Summary

No Doubt Fitness Timer is best treated as a browser-first workout timer, not a thin copy of a native app. The research consistently points to a mostly client-driven architecture: Next.js on Vercel for the app shell, Supabase for auth and persistence, IndexedDB for local resilience, and a deterministic client-side timer engine for live playback. The product should compete on fast setup, clear run-mode readability, official NoDoubt starter templates, and low-friction guest use rather than on native-only breadth.

The recommended approach is to lock down the timer data model, auth boundary, and run engine before spending effort on polish or feature expansion. Table stakes are structured timer creation, editing, save/reuse flows, and a reliable full-screen run mode with current, next, and total remaining context. The strongest MVP differentiators are easier mobile authoring than the native benchmark, duplication-first official templates, signed-in draft auto-save, and offline playback of previously loaded timers.

The main risks are not cosmetic. They are timer drift, mobile browser behavior, silent audio/haptic failure, weak RLS or ownership modeling, and overstated offline claims. The mitigation is equally consistent across the research: derive playback from monotonic time rather than ticks, validate on real iOS and Android devices early, treat audio/haptics and wake lock as capability adapters, design Supabase schema and RLS as a hard security boundary, and define offline as constrained resilience rather than native parity.

## Key Findings

### Recommended Stack

The stack direction is clear and conservative: `Next.js 16.x` with `React 19.2` and `TypeScript`, `Tailwind CSS v4` plus `Radix Primitives` for accessible touch UI, `Supabase` for Google auth and Postgres persistence, `Zustand` for transient UI and playback state, `Dexie` over IndexedDB for local storage, `Serwist` for PWA/service-worker support, and browser-native timing/audio APIs for run mode. This is a low-ops fit for the documented Vercel + Supabase constraints and matches the browser-first shape described in `PROJECT.md`.

**Core technologies:**
- `Next.js 16.x` + `React 19.2`: app shell, routing, and deployment on Vercel with current mainstream patterns.
- `TypeScript`: protects the timer model, playback contracts, and Supabase data boundaries from the start.
- `Tailwind CSS v4` + `Radix Primitives`: fast mobile UI construction with strong accessibility defaults.
- `Supabase` + `@supabase/ssr`: Google auth, Postgres persistence, and RLS-backed private data.
- `Zustand`: lightweight client state for editor and run UI without Redux-style overhead.
- `Dexie` + IndexedDB: offline cache, guest drafts, saved-timer copies, and run-session recovery.
- `Serwist`: current PWA/service-worker path for installability and cached shell assets.
- `Web Audio API`, `navigator.vibrate()`, `navigator.wakeLock`: browser-native run cues and wake behavior.
- `Vitest`, `Testing Library`, `Playwright`: unit, component, and mobile-device/emulation coverage.

### Expected Features

The feature research draws a sharp boundary between category expectations and MVP sprawl. The product needs the core Seconds-style value proposition in web form, but it should intentionally defer platform-heavy or ecosystem-heavy features.

**Must have (table stakes):**
- Structured timer creation and save flows.
- Interval sequence editing with validation and deterministic flattening.
- Run mode with current, next, and total remaining time.
- Start, pause, resume, reset, and skip prev/next controls.
- Audible alerts with vibration fallback.
- Preparation countdown plus warmup, cooldown, rest, and repeat support.
- Timer detail screen before run.
- Search and duplicate within a personal timer library.
- Installable PWA shell.
- Guest trial for official templates and temporary timers.
- Google sign-in for permanent save.

**Should have (competitive differentiators):**
- Official NoDoubt Fitness starter templates with duplication-first editing.
- Fast creation wizards for HIIT, circuit/tabata, and round timers.
- A simpler mobile-first editor than the native benchmark.
- Auto-save for signed-in drafts.
- Branding in shell/onboarding while keeping run mode utility-first.
- Guest-to-save conversion that preserves context.
- Offline playback of previously loaded timers.
- Full-screen portrait-first run experience.

**Defer (v2+):**
- Folders, manual library reordering, and broad organization features.
- Public sharing, import/export, and timer-link ecosystems.
- Compound timers, stopwatch mode, and generic countdown mode.
- Spoken interval names, halfway alerts, BPM/metronome, or music assignment.
- Apple Health, watch, lock-screen, remote-control, and other native-style integrations.
- Push/reminder notifications and heavy personalization.

### Architecture Approach

The recommended architecture is a thin-backend, client-authoritative system with clear subsystem boundaries. The app shell owns navigation and auth bootstrap, the editor produces validated timer definitions, the run engine compiles those definitions into a flattened sequence and derives playback from absolute elapsed time, IndexedDB holds local resilience data, Supabase holds authenticated records and policies, and the analytics pipeline stays isolated from workout execution. The research is explicit that the live workout clock must never depend on server timing or on trusting interval callbacks.

**Major components:**
1. App shell: route layout, guest/signed-in entry state, loading/session restore.
2. Timer library: personal timers, official templates, search, duplicate, rename, delete.
3. Timer editor: authoring flows, wizard presets, validation, auto-save.
4. Timer detail: review boundary between browse/edit and run.
5. Run engine: sequence compilation, pause/resume/reset/skip, recovery, completion.
6. Device feedback layer: audio, haptics, wake lock, capability fallback.
7. Sync layer: local cache, Supabase reads/writes, reconciliation, offline queue handling.
8. Analytics layer: event capture and batching without blocking playback.

### Critical Pitfalls

1. **Treating timer ticks as truth**: avoid drift by precomputing the sequence and deriving state from monotonic time and persisted anchors.
2. **Assuming mobile browsers behave like desktop**: test real iOS/Android behavior early and design for viewport shifts, safe areas, visibility changes, and foreground-first reliability.
3. **Letting audio and haptics fail silently**: prime audio on explicit interaction, handle blocked playback, and expose armed/unavailable states in the UI.
4. **Overstating offline/PWA guarantees**: define offline as shell + previously loaded timers + graceful fallback, not native-style background reliability.
5. **Getting Supabase ownership/RLS wrong**: enforce ownership and policy consistency on every private table and pair auth flows with local-cache cleanup.
6. **Expanding the MVP into a feature farm**: keep the first release anchored to create, save, run, and branded starter templates.

## Implications for Roadmap

Based on the combined research, the roadmap should follow dependency order rather than perceived feature appeal.

### Phase 1: Foundation, Auth, and Local Model
**Rationale:** Every later decision depends on the canonical timer model, session bootstrap, and storage split.
**Delivers:** App shell, route structure, basic timer schema, local storage adapter, guest/signed-in boundaries, Supabase auth bootstrap, and initial RLS-aware persistence shape.
**Addresses:** Guest template trial, Google sign-in, permanent save prerequisites, and flat-library foundations.
**Avoids:** Weak ownership modeling, RLS mistakes, and rework caused by unstable data contracts.

### Phase 2: Timer Authoring and CRUD
**Rationale:** The run engine should consume stable timer definitions rather than forcing the editor to retrofit later.
**Delivers:** Create flow, timer editor, quick-create wizards, timer detail screen, duplicate-first editing for official templates, and search/basic library actions.
**Addresses:** Structured timer creation, interval editing, warmup/cooldown/rest/repeat setup, and easier-than-native authoring.
**Avoids:** Feature-farm drift by concentrating on the create/save/reuse loop first.

### Phase 3: Deterministic Run Engine and Device Feedback
**Rationale:** This is the product trust boundary and the highest-risk subsystem.
**Delivers:** Sequence compilation, prep countdown, pause/resume/reset/skip, large-format run mode, current/next/total remaining context, completion state, audio cues, haptic fallback, wake-lock handling, and state recovery.
**Addresses:** Core run-mode table stakes and the key value proposition of the product.
**Avoids:** Timer drift, silent cue failures, and browser-assumption bugs.

### Phase 4: Sync, Offline Resilience, and PWA Hardening
**Rationale:** Offline behavior and installability should be added once the run path and persistence contracts are real.
**Delivers:** IndexedDB-backed local cache, previously loaded timer playback offline, Supabase reconciliation, service-worker shell caching, installability, and sign-out/account-deletion cache cleanup.
**Addresses:** PWA shell, offline playback differentiator, cross-session reuse, and browser-realistic resilience.
**Avoids:** Overpromised offline claims and local data leakage on shared devices.

### Phase 5: Analytics, Account Lifecycle, and Launch Hardening
**Rationale:** Instrumentation and polish should support a working timer, not distort its architecture.
**Delivers:** Minimal event pipeline, template/open/run/save/completion tracking, coaching/Instagram CTA events, account deletion completion paths, and device-focused QA/performance hardening.
**Addresses:** Lead-generation measurement, operational confidence, and public-release readiness.
**Avoids:** Analytics pollution in the run path and late-stage QA surprises.

### Phase Ordering Rationale

- The timer model, auth boundary, and storage split are prerequisite decisions for both authoring and playback.
- Authoring should precede the run engine so playback compiles from stable definitions rather than evolving UI state.
- Offline/PWA work belongs after the run engine because it depends on finalized run snapshots, cache shape, and persistence contracts.
- Analytics and growth surfaces should come last because the research explicitly warns against blocking or contaminating workout execution.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 3:** Real-device audio, haptics, wake-lock, visibility, and recovery behavior need validation on iOS Safari and Android browsers.
- **Phase 4:** Service-worker scope, installability behavior, offline fallback UX, and cache invalidation need platform-specific validation.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Next.js + Supabase auth bootstrap, schema setup, and RLS structure are well-documented.
- **Phase 2:** CRUD editor flows, wizard-driven authoring, and library/search patterns are conventional product work.
- **Phase 5:** Basic analytics/event batching and account-lifecycle plumbing follow established patterns once the core app exists.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Strongly backed by current framework/vendor docs and aligned with Vercel + Supabase constraints. |
| Features | HIGH | Well-grounded in benchmark product analysis plus the project’s documented MVP boundaries. |
| Architecture | HIGH | Based on stable browser constraints, project docs, and clear system-boundary recommendations. |
| Pitfalls | HIGH | Risks are concrete, recurring, and directly tied to known browser and Supabase failure modes. |

**Overall confidence:** HIGH

### Gaps to Address

- Real-device behavior for audio priming, vibration support, wake lock reacquisition, and visibility-change recovery should be validated before run-mode claims are finalized.
- Exact Supabase schema shape for templates, user timers, drafts, and run/session records needs to be frozen early so editor and sync work do not diverge.
- Local-cache clearing rules on sign-out and account deletion need explicit implementation acceptance criteria to avoid privacy leaks.
- Offline scope needs explicit product wording so installability and cached playback are promised accurately across browsers.

## Sources

### Primary (HIGH confidence)
- [PROJECT.md](../PROJECT.md) - product intent, constraints, scope boundaries, and current repo state.
- [STACK.md](./STACK.md) - recommended technologies, version direction, and deployment/tooling choices grounded in official docs.
- [ARCHITECTURE.md](./ARCHITECTURE.md) - system boundaries, timer-engine shape, persistence split, and dependency order.
- MDN docs cited in `STACK.md`, `FEATURES.md`, `ARCHITECTURE.md`, and `PITFALLS.md` - timers, visibility, IndexedDB, service workers, wake lock, vibration, and installability constraints.
- Official Supabase docs cited in `STACK.md` and `ARCHITECTURE.md` - auth, Google sign-in, API keys, and RLS guidance.
- Official Next.js, React, Tailwind, Playwright, and Vitest docs cited in `STACK.md` - framework and tooling direction.

### Secondary (MEDIUM confidence)
- [FEATURES.md](./FEATURES.md) - category table stakes, differentiators, and defer list synthesized from benchmark product docs plus project scope.
- [PITFALLS.md](./PITFALLS.md) - implementation guardrails derived from browser behavior, Supabase guidance, and local product docs.
- Seconds / Runloop product and manual references cited in `FEATURES.md` - benchmark expectations for timer behavior and editor scope.

---
*Research completed: 2026-04-15*
*Ready for roadmap: yes*
