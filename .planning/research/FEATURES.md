# Feature Research: No Doubt Fitness Timer

## Purpose
This note scopes the feature surface for a mobile-first browser interval timer inspired by Seconds, with NoDoubt Fitness branding and lightweight lead generation. It separates what products in this domain commonly include from what this MVP should keep, differentiate with, or defer.

## Domain Feature Snapshot
Primary sources reviewed:
- Seconds App Store listing and changelog
- Runloop/Seconds manual pages for timer list, timer types, intervals, sharing, and timer settings
- MDN references for wake lock, vibration, autoplay, PWA installability, and screen orientation

The benchmark product family covers a broad native-style feature set:
- timer library management with folders, sorting, delete, share, export, and copy/paste workflows
- multiple timer archetypes: HIIT, circuit/tabata, round, custom, compound, countdown, stopwatch
- rich interval modeling: names, colors, split sides, count-up, alerts, halfway alerts, audio, BPM, exclusion from count
- playback controls: run, pause, resume, reset, skip, lock, full-screen/readable run view
- templates and optional timer settings: warmup, cooldown, rest-between, prep countdown, color settings, audio settings
- native-only extras: Apple Health, Apple Watch, background behavior, remote controls, music routing, deep sharing

## Table Stakes For This MVP
These are the minimum features needed for a competitive web version of a structured workout timer.

| Feature | Why it is table stakes | Complexity / dependencies |
| --- | --- | --- |
| Create and save structured timers | Core value of the product category | Requires timer data model, persistence, auth for private saves |
| Edit interval sequences | Users expect to build real workout routines, not just run presets | Needs interval editor, validation, and deterministic flattening |
| Run mode with current, next, and total remaining time | Seconds-style glanceability is the core product promise | Requires timing engine, state management, and large-text mobile layout |
| Start, pause, resume, reset, skip prev/next | Basic workout control set | Must be resilient during active playback and accidental taps |
| Audible alerts and vibration fallback | Transitions need to work without constant screen watching | Web audio and haptics are permission- and device-dependent |
| Preparation countdown | Common workout convenience in the benchmark and PRD | Simple to implement, but must be configurable globally or per timer |
| Warmup, cooldown, rest intervals, and repeat sets/cycles | Core to HIIT/circuit/round use cases | Requires a consistent playback model and total-duration preview |
| Timer detail screen before run | Prevents accidental edits and makes reuse easier | Adds a separate read-only review state |
| Search and duplicate for personal timers | Reuse is a major usability expectation | Search can stay scoped to personal timers only |
| Installable PWA shell | Required for the browser-first delivery model | Needs manifest, service worker, and offline-safe asset strategy |
| Guest trial for official templates | Low-friction onboarding is important for lead-gen and conversion | Requires split guest/signed-in permission model |
| Google sign-in for permanent save | Matches the MVP auth decision and keeps account scope narrow | Needs Supabase Auth and row-level access control |

## Differentiators For This MVP
These are the features that should make the web version feel worth choosing over a generic timer app.

| Feature | Differentiation value | Complexity / dependencies |
| --- | --- | --- |
| Official NoDoubt Fitness starter templates | Creates a branded entry point and reduces first-use friction | Needs curated template records, visible official badges, and duplication-first editing |
| Fast creation wizards for HIIT, Circuit/Tabata, and Round | Improves speed of setup relative to native benchmark editors | Requires opinionated UX, sensible defaults, and short step flows |
| Mobile-first editor that is easier than the native benchmark | Web can win on clarity and fewer hidden gestures | Requires careful touch UX, expandable cards, and live duration preview |
| Auto-save for signed-in drafts | Removes a final-save burden and supports "build once, reuse often" behavior | Requires draft state handling and safe sync with Supabase |
| Lightweight NoDoubt Fitness branding in shell, not in run mode | Supports lead-gen without hurting utility | Needs selective brand placement and separate business CTA surfaces |
| Guest-to-save conversion flow | Preserves try-before-buy while still capturing account conversion | Requires context-preserving sign-in prompts |
| Offline playback of previously loaded timers | Makes the web app feel reliable in real gym conditions | Depends on local caching and careful failure handling when offline |
| Full-screen, portrait-first run experience | Distinguishes the product as a purpose-built workout tool | Needs responsive layout discipline and browser-safe viewport handling |

## Anti-Features And Defer Items
These are common in the domain, but they are not good MVP fits for this browser release.

| Feature | Why defer or exclude | Notes |
| --- | --- | --- |
| Folders and nested library organization | Adds structure, but the current MVP is intentionally flat | Can revisit after the core timer flows are proven |
| Manual reordering of the library | Nice-to-have once the list grows, not required for first value | Search, sort-by-recent, and duplicate matter more initially |
| Public sharing, import, export, and timer link ecosystems | High product and support complexity for limited MVP gain | Domain-native in Seconds, but not essential for browser MVP1 |
| Compound timers | Powerful, but significantly increases editor and playback complexity | Already documented as out of scope in the PRD |
| Stopwatch mode and simple countdown mode | Not aligned with the primary interval-workout use case | Better as post-MVP breadth features |
| Spoken interval names / text-to-speech | Useful, but raises audio complexity and localization burden | Defer until core timer reliability is stronger |
| Split left/right intervals and pause-between-sides | Niche training patterns with more editor complexity | Good native parity item, not an MVP necessity |
| Halfway alerts, BPM metronome, music assignment per interval | Adds audio mixing and per-interval complexity | Useful later, but not required for launch utility |
| Apple Health, Apple Watch, and lock-screen integrations | Native-only or deeply platform-specific | Browser MVP should avoid promising parity it cannot reliably deliver |
| Remote controls, deep URL schemes, quick actions, and OS shortcuts | Useful in native apps, but not essential for first web release | Can be revisited if install and retention justify it |
| Push or reminder notifications | Requires service worker complexity and a different product loop | Not necessary for the initial lead-gen timer use case |
| Heavy personalization such as dark mode and advanced color systems | Adds polish, but competes with speed and readability work | Explicitly lower priority in the PRD |

## Web-Vs-Native Caveats
These constraints should shape requirements and avoid accidental native assumptions.

| Area | Web reality | Requirement implication |
| --- | --- | --- |
| Screen wake lock | Supported through the Screen Wake Lock API in secure contexts, but only for active documents and it can be revoked | Treat as best-effort; re-acquire on visibility changes and provide graceful fallback |
| Haptics | `navigator.vibrate()` is limited availability and requires sticky user activation | Enable by default only with a silent fallback; never make workout completion depend on it |
| Autoplay audio | Browser autoplay policies may block media playback until the user interacts | Prime audio on first user gesture and handle blocked playback explicitly |
| Orientation lock | Screen orientation locking has limited support and often depends on fullscreen or installed-app context | Design the run screen to work in portrait first without needing a hard lock |
| Background execution | Browsers may throttle timers, audio, and rendering when hidden or locked | Foreground reliability is mandatory; background support should be described as best effort |
| Installability | PWA install works, but browser promotion and support vary by platform | Treat install as a quality layer, not as the only way to use the product |

## Scoping Takeaways
- The MVP should cover the core Seconds value prop: build a structured timer, run it clearly, and reuse it easily.
- The web version should win on simpler creation, cleaner editing, branded starter templates, and low-friction guest trial.
- Anything that depends on native background behavior, account-level ecosystems, or deep sharing should be deferred until the web timer itself is proven.
- The strongest differentiator for this product is not feature breadth; it is a focused browser workflow that feels easier than the native benchmark while still supporting real workout timing.

## Sources
- [Seconds Interval Timer App Store listing](https://apps.apple.com/in/app/seconds-interval-timer/id475816966)
- [Seconds vs Seconds Pro](https://manual.runloop.com/docs/guides/seconds-vs-seconds-pro/)
- [Timer List](https://manual.runloop.com/docs/timer-list/)
- [Common Properties](https://manual.runloop.com/docs/editors/common-properties/)
- [Intervals](https://manual.runloop.com/docs/editors/intervals/)
- [HIIT Timer](https://manual.runloop.com/docs/editors/hiit-timer/)
- [Circuit / Tabata Timer](https://manual.runloop.com/docs/editors/circuit-tabata-timer/)
- [Round Timer](https://manual.runloop.com/docs/editors/round-timer/)
- [Custom Timer](https://manual.runloop.com/docs/editors/custom-timer/)
- [Compound Timer](https://manual.runloop.com/docs/editors/compound-timer/)
- [Sharing Timers](https://manual.runloop.com/docs/guides/sharing-timers/)
- [Timer Settings](https://manual.runloop.com/docs/settings/timer-settings/)
- [Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)
- [Autoplay policy detection](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getAutoplayPolicy)
- [Making PWAs installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable)
- [Screen Orientation API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Orientation_API)
