# No Doubt Fitness Timer - Pitfalls

This note captures the mistakes that interval-timer projects like this commonly make, and the implementation traps that would quietly undermine the MVP if they are not addressed early.

The phase labels below are implementation phases, not roadmap numbers. They are written to prevent the plan from pushing foundation work too late.

## 1. Treating timer ticks as the source of truth

- Warning signs: the countdown looks fine in desktop testing but drifts after pause/resume, after the device sleeps, or after the tab is hidden; the app advances one interval at a time by trusting `setInterval()` or `setTimeout()` ticks; refresh recovery is bolted on later and does not match the in-memory run state.
- Prevention strategy: model the workout as a precomputed sequence with absolute boundary times; derive remaining time from the clock on each render instead of counting ticks; persist the active segment, start anchor, paused offset, and transition history; reconcile on `visibilitychange`, refresh, and resume.
- Future phase: `Timer engine and run-state phase`. This should happen before visual polish or template expansion because every other run-mode promise depends on it.
- Relevant sources: [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [Window: setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)

## 2. Assuming mobile browsers behave like desktop browsers

- Warning signs: the run screen is built from desktop responsive breakpoints only; the layout breaks when the address bar collapses, the viewport height changes, or the phone rotates; controls disappear under safe-area insets; the app relies on `beforeunload` instead of page visibility and session persistence.
- Prevention strategy: test on real iOS and Android devices early; design against `visualViewport` changes, safe areas, and lock-screen behavior; treat backgrounding as a state transition, not a rare edge case; keep the run screen usable when chrome UI shifts and when the screen is being held at arm's length.
- Future phase: `Mobile browser resilience phase`. This belongs with shell, run-mode, and QA work, not as a late bug-fix pass.
- Relevant sources: [Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API), [Screen Wake Lock API](https://developer.chrome.com/docs/capabilities/web-apis/wake-lock)

## 3. Letting audio and haptics fail silently

- Warning signs: beeps work in a happy-path desktop demo but fail on first launch, after a reload, or on iPhone Safari; the app assumes autoplay will work without a user gesture; the UI shows a pause or mute control before audio is actually armed; vibration is treated as universal instead of best-effort.
- Prevention strategy: prime audio from an explicit user interaction; handle `play()` rejection and suspended audio contexts; show a clear armed / muted / unavailable state; use a simple fallback sound and a non-audio transition cue; re-check availability when the app regains focus.
- Future phase: `Audio and haptics phase`. Do not defer this until launch polish, because workout trust is lost the first time a cue fails.
- Relevant sources: [Chrome autoplay policy](https://developer.chrome.com/blog/autoplay), [WebKit iOS video/audio policies](https://webkit.org/blog/6784/new-video-policies-for-ios/), [Web Audio autoplay policy](https://developer.chrome.com/blog/web-audio-autoplay)

## 4. Overstating offline and PWA guarantees

- Warning signs: the product claims "offline" but only the shell is cached; previously loaded timers vanish after reconnects or sign-out; installability is tested only in Chrome desktop; the app behaves badly inside in-app browsers where installation is not available; the service worker is added without a real offline fallback.
- Prevention strategy: define offline as "previously loaded timers and core shell remain usable on-device"; precache the shell and critical assets; keep a local copy of saved timers for playback; add a custom offline state instead of relying on the browser's default offline page; verify install behavior separately on Safari, Chrome, and Android.
- Future phase: `PWA and offline resilience phase`. This should be planned as a constrained resilience layer, not as native-app parity.
- Relevant sources: [Progressive Web Apps](https://web.dev/learn/pwa/progressive-web-apps), [PWA checklist](https://web.dev/articles/pwa-checklist), [Caching](https://web.dev/learn/pwa/caching/), [Offline fallback page](https://web.dev/articles/offline-fallback-page)

## 5. Getting Supabase auth and the timer data model wrong

- Warning signs: RLS is only enabled on some tables; the client can read or write rows without an owner check; `owner_id`, `source_type`, `is_draft`, and `source_template_id` are inconsistent or duplicated across tables; account deletion removes auth but leaves private timer data and local caches behind; drafts and official templates are modeled as ad hoc flags instead of an enforced ownership structure.
- Prevention strategy: make row ownership explicit on every private record; enable RLS everywhere exposed through the API; write policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`, not just read access; keep official templates immutable and duplicated into personal rows before editing; define deletion and cache cleanup together with auth, not as an afterthought.
- Future phase: `Auth and persistence phase`. This is a schema and policy decision, not a UI detail.
- Relevant sources: [Supabase Row Level Security](https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security), [RLS simplified](https://supabase.com/docs/guides/troubleshooting/rls-simplified-BJTcS8), [Supabase auth context for functions](https://supabase.com/docs/guides/functions/auth-legacy-jwt)

## 6. Letting the MVP expand into a feature farm

- Warning signs: compound timers, sharing, folders, import/export, music libraries, rich sound packs, and analytics dashboards all compete for the first build; the run screen gets delayed while side features are polished; the team starts solving every future timer variant instead of the documented MVP flows.
- Prevention strategy: keep the first release anchored to the actual product promise - quick creation, reliable playback, private persistence, official templates, and branded utility; prefer duplication over complex edit sharing; cut anything that does not improve the first successful workout or the first successful save.
- Future phase: `Scope control and post-MVP expansion phase`. This should sit behind the working timer, not ahead of it.
- Relevant sources: project docs in [PRD](../docs/PRD.md) and [Mobile IA / Wireframe Spec](../docs/MOBILE_IA_WIREFRAME_SPEC.md)

## 7. Designing for clean-looking screens instead of sweaty workouts

- Warning signs: controls are too small, too close together, or too low on the screen; the active run view carries too much branding; destructive actions are one tap away; the layout depends on precise taps, dense copy, or constant attention; the completion screen becomes a promo page instead of a finish state.
- Prevention strategy: optimize for one-handed use, distance readability, and accidental-tap avoidance; keep the run screen almost brand-minimal; lock dangerous actions behind confirmation; limit on-screen information to current interval, next interval, remaining time, and basic controls; validate the flow while moving, not just while seated.
- Future phase: `Run-screen UX hardening phase`. This should be paired with device testing and content review before public release.
- Relevant sources: [Mobile IA / Wireframe Spec](../docs/MOBILE_IA_WIREFRAME_SPEC.md), [Mobile Branding System](../docs/MOBILE_BRANDING_SYSTEM.md)

## Roadmap Guardrails

1. Build the timer engine and run-state model before polishing visuals.
2. Validate audio, wake lock, and visibility behavior on real mobile devices before declaring the run screen reliable.
3. Design the Supabase schema and RLS policies as a security boundary, not as a convenience layer.
4. Treat offline as a constrained resilience feature, not as full native parity.
5. Keep post-MVP ideas out of the first implementation wave unless they directly improve create, save, or run.

