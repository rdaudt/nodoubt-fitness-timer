# Roadmap: No Doubt Fitness Timer

## Overview

This roadmap moves No Doubt Fitness Timer from a documentation-first repo to a browser-first MVP by locking down the app shell, auth, and private data boundary first, then shipping timer authoring, deterministic playback, offline/PWA resilience, and final settings, analytics, and branded launch surfaces in dependency order.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [x] **Phase 1: Foundation, Access, and Data Boundaries** - Establish the mobile shell, guest/signed-in entry states, Google auth, and private timer ownership rules.
- [ ] **Phase 2: Authoring, Library CRUD, and Drafts** - Deliver timer creation, editing, duplication, detail review, and reusable personal-library workflows.
- [ ] **Phase 3: Deterministic Run Engine and Playback** - Make timers trustworthy to run from across the room with deterministic timing and device feedback.
- [ ] **Phase 4: Offline Resilience and PWA Delivery** - Add installability and constrained offline playback for previously loaded timers.
- [ ] **Phase 5: Settings, Account Lifecycle, and Launch Surfaces** - Finish defaults, account management, analytics, and branded supporting surfaces for launch readiness.

## Phase Details

### Phase 1: Foundation, Access, and Data Boundaries
**Goal**: Users can enter the app through a branded mobile shell, browse official templates without friction, cross the guest/signed-in boundary cleanly, and trust that personal timer data is private.
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03, LIBR-07, LIBR-08, TMPL-01, SETG-02, PRIV-01
**Success Criteria** (what must be TRUE):
  1. Guest user can open the app without signing in and browse official NoDoubt Fitness starter templates from the home experience.
  2. User can sign in with Google, return later still signed in, and see a signed-in home that prioritizes `My Timers`, separates official templates, and shows first-name header context.
  3. Authenticated timer and draft access is private to the signed-in account and does not expose another user's data.
**Plans**: 3 plans

Plans:
- [x] 01-01: Build the mobile app shell, route structure, and guest/signed-in home split.
- [x] 01-02: Implement Supabase Google auth bootstrap, session persistence, and signed-in identity context.
- [x] 01-03: Freeze the initial timer/template data model and private ownership boundary with RLS-aware persistence scaffolding.

### Phase 2: Authoring, Library CRUD, and Drafts
**Goal**: Users can create, review, edit, save, and manage structured timers quickly on mobile, whether starting from scratch or duplicating an official template.
**Depends on**: Phase 1
**Requirements**: LIBR-01, LIBR-02, LIBR-03, LIBR-04, LIBR-05, LIBR-06, TMPL-02, TMPL-04, TMPL-05, CRTE-01, CRTE-02, CRTE-03, CRTE-04, CRTE-05, CRTE-06, CRTE-07, CRTE-08, CRTE-09, CRTE-10, EDIT-01, EDIT-02, EDIT-03, EDIT-04, EDIT-05, EDIT-06, EDIT-07, EDIT-08, EDIT-09, EDIT-10, EDIT-11
**Success Criteria** (what must be TRUE):
  1. User can start from a prominent `Create timer` action and create HIIT, Circuit / Tabata, Round, or Custom timers with an auto-generated default name.
  2. User can open a timer or official template detail view, review the interval breakdown, and move into edit or duplicate flows from that detail experience.
  3. User can add, edit, delete, duplicate, and reorder intervals, configure warmup/cooldown and supported rest/repeat structure, and see total workout duration while editing.
  4. Signed-in timer changes auto-save, incomplete work reappears as drafts, and guest timer work stays temporary unless the user chooses to sign in and save.
  5. Signed-in user can search, rename, duplicate, delete, and distinguish draft timers in the personal library, and duplicated official templates stay independent from their originals.
**Plans**: 3 plans

Plans:
- [x] 02-01: Ship home/library CRUD flows, timer detail screens, and official-template duplication behavior.
- [ ] 02-02: Ship quick-create wizards, custom-create entry, guest temporary timer flow, and guest-to-save prompts.
- [ ] 02-03: Ship the full timer editor with interval management, derived duration, and signed-in draft auto-save.

### Phase 3: Deterministic Run Engine and Playback
**Goal**: Users can run structured timers reliably from a distance with stable timing, clear live context, strong controls, and browser-aware device feedback.
**Depends on**: Phase 2
**Requirements**: LIBR-09, TMPL-03, EDIT-12, RUN-01, RUN-02, RUN-03, RUN-04, RUN-05, RUN-06, RUN-07, RUN-08, RUN-09, RUN-10, RUN-11, RUN-12, RUN-13, ALRT-01, ALRT-02, ALRT-03, ALRT-04, ALRT-05, BRND-02
**Success Criteria** (what must be TRUE):
  1. User can start a timer from creation completion, detail, or explicit `Run now` actions and enter a portrait-first run screen that hides nonessential chrome and keeps branding secondary to readability.
  2. Run mode shows the current interval, next interval, total workout time remaining, and current progress context such as interval, round, or set counts clearly from a distance.
  3. User can use prep countdown, pause/resume, previous/next interval, reset with confirmation, optional control lock, and a completion screen with `Run again` and home-return actions.
  4. Playback delivers transition audio, final-countdown cues, haptics, and wake-lock behavior where supported, and degrades clearly when the browser blocks those capabilities.
  5. Active workout state survives refresh while the page remains open, and timers cannot be edited while they are actively running.
**Plans**: 3 plans

Plans:
- [ ] 03-01: Build the deterministic sequence compiler and run-state engine from absolute elapsed time.
- [ ] 03-02: Build the full-screen run UI, controls, entry points, and completion flow.
- [ ] 03-03: Integrate audio, haptics, wake-lock, and session recovery behavior with browser capability fallbacks.

### Phase 4: Offline Resilience and PWA Delivery
**Goal**: Users can install the app and rely on previously loaded timers continuing to work offline on the same device within clearly bounded browser constraints.
**Depends on**: Phase 3
**Requirements**: PWA-01, PWA-02, PWA-03
**Success Criteria** (what must be TRUE):
  1. User can install the app as a Progressive Web App from supported browsers and reopen a working app shell from the device home screen.
  2. User can run previously loaded official templates, saved timers, and guest temporary timers while offline on the same device.
  3. Saved-timer and guest-timer local caching behaves within the documented browser-resilience scope so offline expectations remain accurate and predictable.
**Plans**: 2 plans

Plans:
- [ ] 04-01: Add IndexedDB-backed cache, offline timer availability, and sync/reconciliation rules.
- [ ] 04-02: Add service-worker caching, installability behavior, and bounded offline UX/hardening.

### Phase 5: Settings, Account Lifecycle, and Launch Surfaces
**Goal**: Users can manage defaults and account lifecycle from branded supporting surfaces while the product captures launch analytics and lightweight promotional signals without disrupting workouts.
**Depends on**: Phase 4
**Requirements**: AUTH-04, AUTH-05, SETG-01, SETG-03, SETG-04, SETG-05, BRND-01, BRND-03, ANLY-01
**Success Criteria** (what must be TRUE):
  1. Signed-in user can open a settings/profile surface, adjust global defaults for new timers, and access About NoDoubt Fitness plus Instagram / coaching links from non-critical surfaces.
  2. User can sign out when no workout is active, or re-authenticate to delete the account and remove personal timer data.
  3. Home, completion, settings, onboarding, and template-supporting surfaces feel like an official NoDoubt Fitness product while active workouts remain free of intrusive promotion.
  4. Product records core analytics for sign-ins, timer starts, timer completions, official template usage, and coaching / Instagram CTA clicks.
**Plans**: 2 plans

Plans:
- [ ] 05-01: Ship settings/profile surfaces, defaults, account actions, About, and lightweight CTA placement.
- [ ] 05-02: Ship analytics instrumentation plus launch-readiness QA and hardening across target mobile browsers.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation, Access, and Data Boundaries | 3/3 | Complete    | 2026-04-16 |
| 2. Authoring, Library CRUD, and Drafts | 1/3 | In Progress | - |
| 3. Deterministic Run Engine and Playback | 0/3 | Not started | - |
| 4. Offline Resilience and PWA Delivery | 0/2 | Not started | - |
| 5. Settings, Account Lifecycle, and Launch Surfaces | 0/2 | Not started | - |
