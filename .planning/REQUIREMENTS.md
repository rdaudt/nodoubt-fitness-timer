# Requirements: No Doubt Fitness Timer

**Defined:** 2026-04-15
**Core Value:** Users can quickly create or open a structured workout timer and run it reliably from across the room with clear visual, audio, and haptic transitions.

## v1 Requirements

### Authentication & Account

- [x] **AUTH-01**: Guest user can use the app without signing in.
- [x] **AUTH-02**: User can sign in with Google to save timers permanently.
- [x] **AUTH-03**: Signed-in user session persists across returning visits.
- [ ] **AUTH-04**: Signed-in user can sign out when no workout is actively running.
- [ ] **AUTH-05**: Signed-in user can delete their account after re-authentication and all personal timer data is removed.

### Home, Library & Discovery

- [ ] **LIBR-01**: Signed-in user can view a personal timer library sorted by most recently updated timers.
- [ ] **LIBR-02**: Signed-in user can search personal timers by name.
- [ ] **LIBR-03**: Signed-in user can rename a timer from its detail experience.
- [ ] **LIBR-04**: Signed-in user can duplicate a personal timer as a new personal timer.
- [ ] **LIBR-05**: Signed-in user can delete a personal timer with confirmation.
- [ ] **LIBR-06**: Signed-in user can see draft timers clearly labeled in the main timer library.
- [ ] **LIBR-07**: Guest user home prioritizes official NoDoubt Fitness templates instead of an empty personal-library state.
- [ ] **LIBR-08**: Signed-in user home shows `My Timers` first and official templates in a separate section.
- [ ] **LIBR-09**: User can start a timer directly from an explicit `Run now` action on home or library cards while card review remains available through the detail flow.

### Official Templates

- [ ] **TMPL-01**: Guest and signed-in users can browse official NoDoubt Fitness starter templates.
- [ ] **TMPL-02**: User can open an official template detail screen and review its interval breakdown before running it.
- [ ] **TMPL-03**: User can run an official template immediately without editing it.
- [ ] **TMPL-04**: User can duplicate an official template into a personal timer before editing it.
- [ ] **TMPL-05**: User edits to a duplicated official template remain independent from the original template.

### Timer Creation

- [ ] **CRTE-01**: User can open a create flow from a prominent `Create timer` action in the mobile navigation shell.
- [ ] **CRTE-02**: User can create a HIIT timer through a quick wizard flow.
- [ ] **CRTE-03**: User can create a Circuit / Tabata timer through a quick wizard flow.
- [ ] **CRTE-04**: User can create a Round timer through a quick wizard flow.
- [ ] **CRTE-05**: User can create a Custom timer by entering the full editor directly.
- [ ] **CRTE-06**: User receives an auto-generated default timer name when starting a structured timer flow.
- [ ] **CRTE-07**: Guest user can create a temporary timer before signing in.
- [ ] **CRTE-08**: Guest user is prompted to sign in when attempting to save a timer permanently.
- [ ] **CRTE-09**: Guest user is prompted to sign in and save before losing temporary timer work.
- [ ] **CRTE-10**: Guest user can dismiss the sign-in prompt and continue without saving temporary work.

### Timer Editing & Detail

- [ ] **EDIT-01**: User can view a timer detail screen with interval breakdown, `Run now`, `Edit`, and `Duplicate` actions.
- [ ] **EDIT-02**: User can add intervals to a timer.
- [ ] **EDIT-03**: User can edit an interval's name, duration, and kind.
- [ ] **EDIT-04**: User can delete an interval from a timer.
- [ ] **EDIT-05**: User can duplicate an interval within a timer.
- [ ] **EDIT-06**: User can reorder intervals within a timer.
- [ ] **EDIT-07**: User can configure optional warmup and cooldown blocks.
- [ ] **EDIT-08**: User can configure rest structure and set/cycle counts for supported timer types.
- [ ] **EDIT-09**: User can see total workout duration while editing.
- [ ] **EDIT-10**: Signed-in user timer edits auto-save without a manual save step.
- [ ] **EDIT-11**: Signed-in user can leave an incomplete timer and later find it as a draft.
- [ ] **EDIT-12**: User cannot edit a timer while it is actively running.

### Run Experience

- [ ] **RUN-01**: User can start a timer from the detail screen or completion of a creation flow.
- [ ] **RUN-02**: Run mode shows the current interval name and current interval time remaining prominently.
- [ ] **RUN-03**: Run mode shows the next interval before the current interval completes.
- [ ] **RUN-04**: Run mode shows the total workout time remaining.
- [ ] **RUN-05**: Run mode shows current progress context such as interval, round, or set counts.
- [ ] **RUN-06**: User can use a preparation countdown before the workout begins.
- [ ] **RUN-07**: User can pause and resume an active workout without losing timing accuracy.
- [ ] **RUN-08**: User can move to the previous or next interval during a workout.
- [ ] **RUN-09**: User can reset an in-progress workout after confirmation.
- [ ] **RUN-10**: User can optionally lock workout controls during playback.
- [ ] **RUN-11**: User sees a completion screen with timer name, completed duration, a primary path back home, and a secondary `Run again` action.
- [ ] **RUN-12**: Run mode is optimized for portrait mobile use and hides nonessential app chrome.
- [ ] **RUN-13**: Workout session state survives a refresh while the page remains open.

### Alerts & Device Feedback

- [ ] **ALRT-01**: User receives audible transition cues during playback.
- [ ] **ALRT-02**: User receives a final countdown cue before interval transitions where configured by the product defaults.
- [ ] **ALRT-03**: User receives vibration feedback on supported devices during playback.
- [ ] **ALRT-04**: The app degrades gracefully when browser autoplay, vibration, or wake-lock capabilities are unavailable.
- [ ] **ALRT-05**: The app keeps the screen awake during playback where the browser supports wake lock.

### Settings, Profile & Promotion

- [ ] **SETG-01**: Signed-in user can access a settings/profile screen from the main app shell.
- [x] **SETG-02**: Signed-in user sees a profile chip with first-name context in the signed-in header.
- [ ] **SETG-03**: User can set global defaults for new timers, including preparation countdown, haptics behavior, and default lock-controls behavior.
- [ ] **SETG-04**: User can access sign out, delete account, and Instagram / coaching links from settings or other non-critical surfaces.
- [ ] **SETG-05**: The app includes a simple `About NoDoubt Fitness` surface.

### Branding, Privacy & Analytics

- [ ] **BRND-01**: User experiences the app as an official NoDoubt Fitness product through the shell, onboarding, templates, and supporting surfaces.
- [ ] **BRND-02**: Branding recedes during active run mode so workout readability remains primary.
- [ ] **BRND-03**: User sees lightweight NoDoubt Fitness coaching / Instagram CTAs on non-critical surfaces such as home and completion without interrupting workout flow.
- [x] **PRIV-01**: Authenticated user can access only their own private timers and drafts.
- [ ] **ANLY-01**: The product records basic analytics for sign-ins, timer starts, timer completions, official template usage, and coaching / Instagram CTA clicks.

### PWA & Resilience

- [ ] **PWA-01**: User can install the app as a Progressive Web App.
- [ ] **PWA-02**: User can run previously loaded timers when offline on the same device.
- [ ] **PWA-03**: Signed-in user's saved timers and guest temporary timers are cached locally only within the browser-realistic resilience scope defined by the product.

## v2 Requirements

### Expanded Timer Features

- **V2TM-01**: User can build compound timers from multiple sub-timers.
- **V2TM-02**: User can use stopwatch mode.
- **V2TM-03**: User can use simple countdown mode.
- **V2TM-04**: User can hear spoken interval names.
- **V2TM-05**: User can configure richer alert types such as halfway cues or custom sounds.

### Library & Sharing

- **V2LB-01**: User can organize timers into folders or custom groups.
- **V2LB-02**: User can manually reorder timers in the library.
- **V2LB-03**: User can import or export timers.
- **V2LB-04**: User can share timers publicly or through direct links.
- **V2LB-05**: User can browse a community or team template gallery.

### Platform Extensions

- **V2PL-01**: User can receive reminder or push notifications for workouts.
- **V2PL-02**: User can connect native or wearable experiences such as Apple Health, Google Fit, or watch companions.
- **V2PL-03**: User can control workouts through deeper OS integrations such as lock-screen or headphone controls.

### Advanced Personalization & Growth

- **V2UX-01**: User can customize timer themes or advanced display appearance.
- **V2UX-02**: User can access richer coaching, adherence, or workout-history insights.
- **V2UX-03**: User can access richer business or promotional surfaces beyond lightweight CTA placement.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Apple Health / Google Fit integration | Native/platform-specific work is outside the browser-first MVP |
| Apple Watch or watch companion support | Requires native ecosystem support and expands scope away from the web MVP |
| Native lock-screen controls and background parity | Browser constraints make native-style guarantees unrealistic for MVP |
| Public sharing and import/export | Not required to prove the core create/save/run value proposition |
| Compound timers | High complexity relative to MVP value and already deferred in the PRD |
| Stopwatch mode | Not part of the structured-workout core value for MVP |
| Simple countdown mode | Not part of the structured-workout core value for MVP |
| Spoken interval names | Adds complexity beyond the first reliable audio cue implementation |
| Push notifications and reminders | Lower priority than core workout utility and browser reliability |
| Dark mode | Lower value than shipping the branded timer MVP with strong usability |
| Subscription monetization or paywall restrictions | The first release is intended to build goodwill and brand value, not gate usage |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Complete |
| AUTH-02 | Phase 1 | Complete |
| AUTH-03 | Phase 1 | Complete |
| AUTH-04 | Phase 5 | Pending |
| AUTH-05 | Phase 5 | Pending |
| LIBR-01 | Phase 2 | Pending |
| LIBR-02 | Phase 2 | Pending |
| LIBR-03 | Phase 2 | Pending |
| LIBR-04 | Phase 2 | Pending |
| LIBR-05 | Phase 2 | Pending |
| LIBR-06 | Phase 2 | Pending |
| LIBR-07 | Phase 1 | Pending |
| LIBR-08 | Phase 1 | Pending |
| LIBR-09 | Phase 3 | Pending |
| TMPL-01 | Phase 1 | Pending |
| TMPL-02 | Phase 2 | Pending |
| TMPL-03 | Phase 3 | Pending |
| TMPL-04 | Phase 2 | Pending |
| TMPL-05 | Phase 2 | Pending |
| CRTE-01 | Phase 2 | Pending |
| CRTE-02 | Phase 2 | Pending |
| CRTE-03 | Phase 2 | Pending |
| CRTE-04 | Phase 2 | Pending |
| CRTE-05 | Phase 2 | Pending |
| CRTE-06 | Phase 2 | Pending |
| CRTE-07 | Phase 2 | Pending |
| CRTE-08 | Phase 2 | Pending |
| CRTE-09 | Phase 2 | Pending |
| CRTE-10 | Phase 2 | Pending |
| EDIT-01 | Phase 2 | Pending |
| EDIT-02 | Phase 2 | Pending |
| EDIT-03 | Phase 2 | Pending |
| EDIT-04 | Phase 2 | Pending |
| EDIT-05 | Phase 2 | Pending |
| EDIT-06 | Phase 2 | Pending |
| EDIT-07 | Phase 2 | Pending |
| EDIT-08 | Phase 2 | Pending |
| EDIT-09 | Phase 2 | Pending |
| EDIT-10 | Phase 2 | Pending |
| EDIT-11 | Phase 2 | Pending |
| EDIT-12 | Phase 3 | Pending |
| RUN-01 | Phase 3 | Pending |
| RUN-02 | Phase 3 | Pending |
| RUN-03 | Phase 3 | Pending |
| RUN-04 | Phase 3 | Pending |
| RUN-05 | Phase 3 | Pending |
| RUN-06 | Phase 3 | Pending |
| RUN-07 | Phase 3 | Pending |
| RUN-08 | Phase 3 | Pending |
| RUN-09 | Phase 3 | Pending |
| RUN-10 | Phase 3 | Pending |
| RUN-11 | Phase 3 | Pending |
| RUN-12 | Phase 3 | Pending |
| RUN-13 | Phase 3 | Pending |
| ALRT-01 | Phase 3 | Pending |
| ALRT-02 | Phase 3 | Pending |
| ALRT-03 | Phase 3 | Pending |
| ALRT-04 | Phase 3 | Pending |
| ALRT-05 | Phase 3 | Pending |
| SETG-01 | Phase 5 | Pending |
| SETG-02 | Phase 1 | Complete |
| SETG-03 | Phase 5 | Pending |
| SETG-04 | Phase 5 | Pending |
| SETG-05 | Phase 5 | Pending |
| BRND-01 | Phase 5 | Pending |
| BRND-02 | Phase 3 | Pending |
| BRND-03 | Phase 5 | Pending |
| PRIV-01 | Phase 1 | Complete |
| ANLY-01 | Phase 5 | Pending |
| PWA-01 | Phase 4 | Pending |
| PWA-02 | Phase 4 | Pending |
| PWA-03 | Phase 4 | Pending |

**Coverage:**
- v1 requirements: 72 total
- Mapped to phases: 72
- Unmapped: 0

---
*Requirements defined: 2026-04-15*
*Last updated: 2026-04-15 after roadmap creation*
