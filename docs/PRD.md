# Product Requirements Document

## Product
No Doubt Fitness Timer

## Document Status
Draft v1

## Date
April 15, 2026

## Summary
Build a mobile-first web-based interval timer inspired by Seconds Interval Timer, optimized for HIIT, Tabata, circuit training, strength workouts, stretching, and other structured timed routines.

The product should preserve the core value of Seconds: highly flexible workout timers with a large, readable live timer experience. The web version should improve editor usability, quick setup, and account-based persistence while avoiding native-only dependencies in MVP1. The primary target platform is mobile web, ideally delivered as an installable PWA.

This product also serves as a branded acquisition and lead-generation asset for NoDoubt Fitness. The app should feel like an official NoDoubt Fitness experience from the first screen and create a clear but lightweight path to the business's Instagram presence.

## Source Basis
This PRD is reverse-engineered from publicly available product information, primarily:

- Apple App Store listing for Seconds Interval Timer
- Runloop product manual for timer types, timer list behavior, timer editor behavior, sharing, and timer settings

Where exact behavior is not explicitly documented, this PRD makes an informed product inference and labels it as such through wording like "should" or "proposed."

## Problem
People doing interval-based workouts need more than a simple countdown. They need to:

- Build structured routines with warmups, work intervals, rests, sets, rounds, and cooldowns
- See the current state clearly from across a room
- Hear or feel transitions without staring at the screen
- Reuse, duplicate, edit, and organize timers for different workout types
- Run workouts reliably on phones, tablets, and desktop browsers

Most simple timer apps fail on routine complexity. Most complex workout timers become hard to edit. The product opportunity is a web timer that is both powerful and easier to manage than the native benchmark.

## Business Objective
The main business goal is to promote NoDoubt Fitness, strengthen brand recognition, and create a useful free product that can help attract future personal training clients.

The app is initially intended to be:

- free to use
- clearly branded as NoDoubt Fitness
- useful enough to earn repeat use and goodwill
- connected to the business through soft promotional touchpoints rather than aggressive sales friction

## Product Goal
Create the best web timer for structured workouts by delivering:

- A mobile-first experience that feels natural on phones
- Fast timer creation and playback
- Enough timer flexibility for real workout use without overwhelming setup
- Large-screen, glanceable workout playback
- Reliable beeps and haptic cues
- Official NoDoubt Fitness starter templates that get users to value quickly
- A strong NoDoubt Fitness brand presence without compromising timer usability

## Non-Goals For MVP
The following are explicitly out of scope for the initial web MVP:

- Apple Health integration
- Apple Watch support
- Native lock-screen controls
- Native audio session routing across other apps
- Calorie estimation based on heart rate or body measurements
- Paid upgrade restrictions that lock created timers after one use
- Full parity with every iOS-only settings edge case
- Subscription monetization or paywall mechanics in the initial release
- Public timer sharing
- Timer import/export
- Compound timers
- Stopwatch mode
- Simple countdown mode
- Spoken interval names
- Push or reminder notifications
- Dark mode

## Initial Delivery Constraints
The initial product must fit within these deployment constraints:

- Frontend hosting and deployment on Vercel free tier
- Persistence on Supabase free tier
- Authentication and user management on Supabase Auth
- Architecture should remain simple enough to operate without dedicated backend infrastructure beyond Supabase and lightweight serverless functions if needed

These are delivery constraints, not permanent product limits, but the MVP should be designed to work comfortably within them.

## Target Users

### Primary
- Individual users doing HIIT, Tabata, circuit, bodyweight, strength, mobility, or rehab sessions
- Coaches or trainers running timers for clients or classes
- Prospective NoDoubt Fitness clients who discover the brand through the app

### Secondary
- Users applying structured timing outside fitness, such as Pomodoro, breathwork, or study sessions

## Jobs To Be Done

### Core jobs
- "Let me create a timer for my workout without rebuilding it every time."
- "Let me run a workout from across the room and know exactly what comes next."
- "Warn me before transitions so I do not have to watch the screen."
- "Let me reuse or tweak an existing timer instead of starting from scratch."

### Secondary jobs
- "Let me try the app before committing to sign-in."
- "Let me save my timers securely to my own account."
- "Let me discover official NoDoubt Fitness workout templates quickly."

## Reverse-Engineered Benchmark Requirements
The benchmark app appears to deliver these core capabilities:

### Timer library and organization
- Create multiple timers
- Organize timers into folders
- Reorder timers
- Duplicate, cut, copy, and paste timers
- Export and share timers

### Timer types
- HIIT timer
- Circuit / Tabata timer
- Round timer
- Custom timer
- Compound timer that combines sub-timers
- Additional simple timer modes such as stopwatch and countdown

### Interval modeling
- Interval name
- Interval duration
- Interval color
- Spoken interval names
- Warning cues for upcoming intervals
- Beeps / bells / other alerts
- Optional halfway alert
- Split left/right style interval behavior
- Optional pause between split sides
- Excluding some intervals from visible count

### Live timer playback
- Large full-screen timer
- Current interval and next interval visibility
- Start, pause, resume, reset, and skip behavior
- Jump to an interval from the interval list
- Optional interface lock while timing
- Support for background operation in native apps

### Template conveniences
- Warmup and cooldown support
- Rest between intervals
- Rest between sets
- Multiple sets / cycles
- Timer templates for common workout structures

### Settings and customization
- Configurable timer display
- Preparation interval
- Disable auto-lock
- Background notifications
- Color customization

### Native-only extras
- Apple Health workout save
- Apple Watch sync and independent playback
- Music assignment per timer / interval

## Product Principles
- Fast to start: a user should be able to launch and run a template in seconds.
- Quick setup first: the product should favor speed and clarity over maximum configurability in v1.
- Readable at distance: the run screen is a primary feature, not a secondary view.
- Safe mobile interaction: the product should reduce accidental taps, destructive actions, and confusing state changes during movement.
- Mobile first: core flows must be optimized for one-handed use, thumb reach, and phone-sized screens.
- Brand-forward but disciplined: NoDoubt Fitness branding should be visible and memorable without getting in the way of task completion.
- Energetic and empowering: the interface should feel motivational, athletic, and purposeful rather than generic or clinical.
- Web-realistic: requirements must respect browser constraints rather than pretend a browser is a native app.

## Brand And Creative Direction

### Brand role
The app should present itself as an official NoDoubt Fitness product, not a generic timer with a logo pasted on top.

### Brand assets
- Primary logo asset: [media/nodoubt-fitness-logo.png](C:/Users/Carboteiro/projects/nodoubt-fitness-timer/media/nodoubt-fitness-logo.png)
- Instagram profile: https://www.instagram.com/nodoubt.fitness/

### Visual cues from existing logo
- deep navy / blue primary color direction
- high-contrast white for key text and emphasis
- bold fitness silhouettes and strong shapes
- progress / ascent symbolism through mountain and upward arrow motifs

### UI tone
The app should feel:

- empowering
- motivational
- premium
- athletic
- confident

### Design inspiration
Use the following Dribbble shot as inspiration for visual energy, screen composition, hierarchy, and premium fitness-app atmosphere:

- https://dribbble.com/shots/27161453-Gym-and-Fitness-App

The reference should inform direction, not be copied literally. Specifically:

- adopt the bold presentation, card hierarchy, and high-energy fitness feel
- preserve NoDoubt Fitness brand identity as primary
- derive the palette from the NoDoubt logo rather than the reference's warmer palette
- avoid a soft wellness aesthetic; the product should feel performance-oriented

### Branding rules
- The NoDoubt Fitness logo and name should be visible in the app shell and entry experience
- The Instagram link should be easy to find on non-critical screens
- Branding should recede during active workout playback so the timer remains the focus
- Promotional surfaces should be lightweight, useful, and never interrupt a running workout

## Proposed Product Scope

## MVP
The MVP should include the minimum product needed to compete on the benchmark's core value proposition in the browser.

### 1. Account management and authentication
- Allow guests to try the app before sign-in
- Require Google sign-in to save timers permanently
- Support Google as the only authentication provider in the initial release
- Support sign out and session restoration on returning visits
- Ensure each signed-in user can access only their own private timers and drafts by default
- Use Supabase Auth as the authentication system of record
- Enforce data isolation with Supabase row-level security
- Prevent sign-out during an active workout
- Support in-app account deletion with re-authentication

### 2. Timer library
- Show personal timers in a flat list
- Create, rename, duplicate, delete, and search personal timers
- Persist timers in Supabase as the primary source of truth
- Support local device caching for offline playback of previously saved timers
- Auto-save signed-in timer changes and drafts
- Keep drafts in the main list with a visible draft badge
- Sort personal timers by recently updated by default
- Present NoDoubt Fitness branding clearly in the home / library shell
- Do not include folders, tags, manual list reordering, import/export, or public sharing in MVP1

### 3. Timer templates
- Quick-create HIIT timer
- Quick-create Circuit / Tabata timer
- Quick-create Round timer
- Quick-create Custom timer
- Feature official NoDoubt Fitness starter templates in a separate curated home section
- Make official templates available to guests and signed-in users
- Mark official templates clearly as branded / official
- Require duplication before editing an official template
- Keep user copies independent if the official source template changes later

### 4. Timer creation flows
- Use a bottom navigation optimized for mobile, including a central `Create timer` action
- Open a simple timer type picker from the create action
- Use wizard-style quick creation for HIIT, Circuit / Tabata, and Round timers
- Open Custom timers directly in the full editor
- Auto-generate default timer names for structured timer types
- Ask guests to sign in only when they try to save
- Prompt guests to sign in and save before losing temporary work

### 5. Timer editor and detail experience
- Provide a separate timer detail screen with:
  - full interval breakdown
  - `Run now`
  - edit
  - duplicate
- Let tapping a timer card open detail rather than starting immediately
- Support quick rename from the detail screen
- Allow full editing in the editor, including interval reordering
- Add, delete, duplicate, and reorder intervals
- Configure:
  - interval name
  - duration
  - interval kind such as work or rest
- Support optional warmup and cooldown blocks
- Support basic rest structure
- Support number of sets / cycles
- Show total workout duration while editing
- Auto-save signed-in edits without a final save step
- Keep incomplete signed-in drafts automatically
- Do not allow editing while a timer is running
- Do not include notes, per-timer theme customization, or advanced bulk editing in MVP1

### 6. Live run experience
- Full-screen timer view optimized for portrait mobile use first
- Prominent display of:
  - current interval name
  - time remaining in current interval
  - next interval
  - current round / set / interval count
  - total time remaining
- Include a user-configurable preparation countdown before workouts
- Start, pause, resume, reset
- Skip forward and move backward one interval
- Do not support free jumping to arbitrary intervals
- Include optional control lock during playback, off by default
- Keep screen awake where supported via Wake Lock API
- Continue audio countdown cues when screen remains active and tab remains foregrounded
- Keep promotional and brand chrome minimal during active workouts
- Require confirmation before resetting an in-progress workout
- Show a simple completion screen with:
  - timer name
  - total completed duration
  - `Done / Back home` as the primary action
  - a subtle NoDoubt Fitness CTA as a secondary element

### 7. Alerts and audio
- Beep-based alerts
- Final countdown cue
- Vibration on supported devices, enabled by default
- One standard alert sound in MVP1
- Graceful fallback when autoplay or haptics are unavailable

### 8. Brand and promotion touchpoints
- Include a clear link to the NoDoubt Fitness Instagram profile from the home, settings, or about surfaces
- Include a lightweight coaching CTA that routes users to Instagram DM
- Include a simple `About NoDoubt Fitness` page
- Keep promotional touchpoints medium in prominence on home and subtle elsewhere
- Maintain a utility-first first impression even with strong branding
- Invest in a polished, branded home/dashboard experience

### 9. Settings and profile
- Include a dedicated settings/profile area
- Show a profile chip and the user's first name when signed in
- Include sign out, delete account, Instagram link, and basic defaults/preferences
- Support global defaults for new timers, including preparation countdown

### 10. Analytics
- Include basic product analytics in MVP1
- Track sign-ins, timer starts, timer completions, official template usage, and coaching / Instagram CTA clicks
- Keep personal timer analytics aggregated rather than per-user behavior reporting

### 11. PWA baseline
- Installable as a Progressive Web App
- Offline support for previously saved or loaded timers that already exist on the device
- Responsive layout with mobile as the primary breakpoint and tablet / desktop as secondary layouts

## Post-MVP
- Compound timers
- Stopwatch mode
- Simple countdown mode
- Community template gallery
- Coach mode for managing class playlists
- Bulk editing across selected intervals
- Rich audio library and custom sound uploads
- Push or reminder notifications
- Dark mode
- Music playlist integration
- Advanced display customization
- Analytics on workout completion and adherence
- Collaborative sharing and team libraries

## Deferred Because Web Constraints Or Lower Priority
- Apple Health / Google Fit integration
- Watch companion apps
- Background execution parity with native apps when the browser tab is suspended
- Heart-rate-based calorie calculations
- Headphone remote controls
- OS-level quick actions

## Core User Flows

### Flow 1: Quick workout
1. Guest user lands on the app and sees official NoDoubt Fitness starter templates first.
2. User opens a starter template or taps `Create timer`.
3. User configures a quick timer such as HIIT.
4. User taps `Run now`.
5. App runs immediately in full-screen timer mode with beeps and haptics.

### Flow 2: Build and save a custom routine
1. User signs in with Google.
2. User taps `Create timer` and chooses `Custom`.
3. User creates a custom timer.
4. User adds and reorders intervals.
5. User optionally adds warmup, cooldown, basic rest, and repeating sets.
6. App auto-saves the timer into `My Timers`.
7. User runs the timer now or later.

### Flow 3: Guest tries to save
1. Guest user creates or edits a temporary timer.
2. Guest attempts to save or leave with work they would lose.
3. App prompts the guest to sign in with Google to save permanently.
4. After sign-in, the timer is saved to the user's private library.

### Flow 4: Reuse an existing timer
1. Signed-in user opens a timer detail screen from `My Timers`.
2. User taps `Duplicate`.
3. User renames or edits the copy.
4. App auto-saves the new timer.
5. User starts the workout from `Run now`.

### Flow 5: Use an official template
1. User opens an official NoDoubt Fitness template.
2. User reviews the full interval breakdown on the detail screen.
3. User either runs it immediately or duplicates it before editing.
4. If the user is a guest, any edits remain temporary until sign-in.

## Functional Requirements

### Timer data model
The system must support:

- User
- Timer
- Interval
- Alert/default settings
- Run session state
- Official starter template

Each timer must support:

- `id`
- `ownerUserId` for personal timers
- `sourceType` such as `personal`, `official`, or `draft`
- `sourceTemplateId` when duplicated from an official template
- `name`
- `type`
- `intervals`
- `warmup`
- `cooldown`
- `basicRest`
- `sets` or `cycles`
- `preparationCountdownSeconds`
- `isDraft`
- `createdAt`
- `updatedAt`

Each interval must support:

- `id`
- `name`
- `durationMs`
- `kind`
- `excludeFromCount`

### Timer playback engine
The system must:

- Precompute the flattened playback sequence before starting
- Maintain deterministic timing across interval transitions
- Support pause / resume without drift
- Support previous / next interval controls
- Support user-configurable preparation countdown
- Preserve current session state if the page remains open and is refreshed unexpectedly

The system must not:

- allow editing while a timer is running
- allow arbitrary jump-to-interval controls in MVP1

### Library and template behavior
The system must:

- Keep personal timers private by default
- Show signed-in users a `My Timers` section first on home
- Show official NoDoubt Fitness templates in a separate curated section
- Show guests official templates first on home
- Support search across personal timers only
- Mark drafts and official templates clearly

### Guest mode behavior
The system must:

- Allow guests to run official templates
- Allow guests to create temporary timers
- Discard guest temporary timers after the guest session ends unless the user signs in and saves
- Prompt guests to sign in when they attempt to save permanently

### Editor usability
The system should:

- Minimize taps / clicks to create common workout structures
- Offer wizard-style creation for HIIT, Circuit / Tabata, and Round timers
- Open Custom timers into the full editor directly
- Allow drag-and-drop reordering on supported devices
- Offer live preview of total duration and interval sequence
- Keep detail screen quick edits limited, with rename as the primary quick edit in MVP1

### Authentication and authorization
The system must:

- Support Google authentication as the only sign-in method in MVP1
- Persist authenticated sessions securely across visits
- Prevent one authenticated user from reading or modifying another user's private timer data
- Enforce authorization at the database level, not only in the client
- Require re-authentication before destructive account deletion

### Persistence and backend assumptions
The system should be designed around:

- Supabase Postgres as the primary persisted store for user timers and official template records
- Supabase Auth as the required authentication layer for MVP1
- Google OAuth via Supabase Auth as the only initial provider
- Browser local storage or IndexedDB as a resilience layer for draft safety and offline playback of saved timers
- Minimal server-side logic, ideally using direct Supabase access from the client with row-level security and only small serverless functions where strictly necessary

## Non-Functional Requirements

### Performance
- Starting a timer should feel immediate on modern mobile devices and desktops
- Interval transitions should trigger audio and visual updates with minimal perceptible delay
- The app should remain usable with large custom timers containing at least 200 flattened intervals

### Reliability
- Timer state should persist across accidental refreshes when feasible
- Local timer data should survive normal browser restarts
- Invalid timer definitions should never crash the app
- Temporary Supabase or network unavailability should not prevent users from running previously saved local timers
- Authentication failures or expired sessions should fail gracefully and never expose another user's data
- Signing out or deleting an account must not leave private timers accessible on the device afterward

### Accessibility
- High-contrast timer display
- Keyboard operability on desktop
- Screen-reader labels for editor and controls
- Non-audio cues available for deaf or hard-of-hearing users
- Non-color-only state communication

### Compatibility
- Mobile Safari and Chrome on modern iOS and Android are primary supported platforms
- Latest major versions of Chrome, Safari, Edge, and Firefox on desktop are secondary supported platforms

## UX Requirements

### Home / library
- Home must be utility-first rather than hero-first
- Signed-in users should see `My Timers` first and official templates second
- Guests should see official templates first
- Timer cards must show name, total duration, and interval / round count
- Creating a timer must be prominent
- Bottom navigation should be used in MVP1
- The center bottom-nav action should be `Create timer`
- Reusing a timer must be easier than rebuilding it
- `Run now` should be available directly from timer cards or list items
- Primary actions must be reachable and usable comfortably on a phone
- The first-run and home experience should establish NoDoubt Fitness branding immediately through logo, palette, and confident messaging
- Official templates should be visibly marked as branded / official
- Empty states should guide users toward official templates first
- Search should apply to personal timers only

### Onboarding and guest experience
- Onboarding should be very short
- Guest sign-in messaging should be contextual rather than persistent
- The app should communicate the value of signing in, especially saving timers permanently

### Timer detail
- Timer detail should exist as a separate screen from the full editor
- Timer detail should show the full interval breakdown
- Timer detail should prioritize `Run now`, `Edit`, and `Duplicate`
- Quick edit on detail should be limited to rename in MVP1

### Editor
- The editor must expose simple mode first and advanced controls progressively
- Common templates should prefill sensible defaults
- Total workout duration should always be visible while editing
- Editing patterns should prefer mobile-native interaction models such as sheets, segmented controls, and large touch targets over dense desktop-style forms
- Brand styling can remain visible in the shell, but form clarity must take priority
- Signed-in timer creation should auto-save without a final save step
- Drafts should appear in the main list with a draft badge
- Destructive actions such as deleting a timer should require confirmation

### Run screen
- One dominant focal point: time remaining
- Current interval name must remain readable at distance
- Next interval must be visible without clutter
- Total remaining workout time must be visible
- Current set / round count must be visible
- Accidental taps must be mitigated through spacing, lock mode, and confirmation where needed
- Core controls must remain usable with sweaty hands, large thumbs, and quick glances during movement
- Promotional elements should be absent or extremely subdued while a timer is running
- The run screen should be portrait-first in MVP1
- Lock controls mode should be available but off by default

### Completion screen
- Completion should land on a simple dedicated finish state
- Primary action should be `Done / Back home`
- The completion screen should show timer name and total duration completed
- Any NoDoubt Fitness CTA here should remain subtle

## Success Metrics

### Product metrics
- 70%+ of first-session users successfully start a timer within 60 seconds
- 40%+ of active users save at least one custom timer
- 25%+ of active users reuse a saved timer at least twice in 30 days
- Percentage of guests who successfully run an official template without help
- Percentage of guests who convert to Google sign-in when trying to save a timer

### Business metrics
- Coaching CTA click-through rate to Instagram DM
- Instagram click-through rate from in-app brand touchpoints
- Percentage of testers who identify the app as a NoDoubt Fitness product without prompting
- Growth in branded social traffic attributable to the app
- Official NoDoubt Fitness starter template usage rate

### Quality metrics
- Less than 1% timer session failure rate caused by app errors
- Less than 100ms median transition drift in foreground playback on supported browsers

## Risks And Constraints

### Browser background limitations
Browsers may throttle timers, audio, haptics, and rendering when tabs are backgrounded or devices are locked. Native parity is not realistic. The PRD assumes:

- foreground reliability is mandatory
- background support is best-effort
- the product should communicate browser limitations clearly

### Audio restrictions
Autoplay and haptic behavior often require user interaction or device support. The app must:

- prime audio on first interaction
- expose clear permission or enable-audio states
- degrade cleanly when audio or vibration support is unavailable

### Storage model
The initial architecture will use Supabase free tier for persistence, but should still maintain local resilience for playback. The app should not depend on a constant network connection once a previously saved timer has been loaded locally.

### Free-tier hosting constraints
The initial deployment target introduces practical limits:

- avoid heavy server rendering requirements
- avoid long-running background compute
- avoid unnecessary scheduled jobs
- keep media storage modest
- keep data models simple enough to stay within free-tier database and bandwidth expectations

This favors a mostly client-driven application with lightweight API needs.

### Mobile browser behavior
Phone browsers introduce additional constraints around viewport changes, safe areas, orientation changes, address bar collapse, screen lock behavior, and audio permissions. The product should be tested against real mobile device behavior early, not just desktop responsive emulation.

## Open Product Decisions
- How many official NoDoubt Fitness starter templates should ship in MVP1?
- What should the default preparation countdown value be for new users?
- Which exact events and toolset should be used for analytics implementation on Vercel + Supabase?

## Recommended MVP Cutline
To ship quickly without weakening the product:

### Keep
- Library
- HIIT, Circuit / Tabata, Round, Custom
- Official NoDoubt Fitness starter templates
- Google sign-in for saving
- Guest try-before-save flow
- Flat personal timer library
- Wizard-based quick creation plus Custom editor
- Full-screen run mode
- Beeps and vibration
- Timer detail screen
- Bottom navigation
- PWA installability

### Cut if schedule pressure appears
- Polished completion screen details beyond the core finish state
- About page richness beyond the essentials
- Advanced timer detail quick edits beyond rename
- Any analytics beyond core business and usage events

## Acceptance Criteria For MVP
- A user can sign in with Google and return to the same private timer library on subsequent visits.
- A guest can open and run an official NoDoubt Fitness starter template without signing in.
- A guest can create a temporary timer and is prompted to sign in when attempting to save it.
- A user can create a HIIT timer in under 30 seconds and start it immediately.
- A user can create a custom timer with at least 20 intervals, reorder them, save the timer, and rerun it later.
- A user can duplicate a timer, change several intervals, and save it as a new timer.
- A user can duplicate an official NoDoubt Fitness template into a personal timer before editing it.
- During playback, the app clearly shows current interval, next interval, and total remaining time.
- During playback, the app provides audible transition cues and haptic feedback where supported.
- The run screen supports pause, resume, previous, next, reset, and optional control lock.
- Temporary guest timers are not accessible after the guest session ends unless the user signs in and saves.
- The app works as an installable PWA and supports offline use for previously saved local timers.
- One authenticated user cannot access another user's private timers through the UI or direct data requests.
- A signed-in user can delete their account after re-authentication and all personal timer data is removed.

## Suggested Next Deliverables
- Product sitemap and object model
- Brand-aware mobile wireframes for home, editor, and run screen
- UX wireframes for onboarding, home, timer detail, editor, run, completion, and settings
- Technical architecture for timing engine, persistence, and PWA behavior
- Auth and data model spec for Supabase
- MVP implementation plan with milestones

## Sources
- Apple App Store: Seconds Interval Timer
  - https://apps.apple.com/us/app/seconds-interval-timer/id475816966
- Runloop Manual: Seconds vs Seconds Pro
  - https://manual.runloop.com/docs/guides/seconds-vs-seconds-pro/
- Runloop Manual: Timer List
  - https://manual.runloop.com/docs/timer-list
- Runloop Manual: The Timer
  - https://manual.runloop.com/docs/overview/
- Runloop Manual: Common Properties
  - https://manual.runloop.com/docs/editors/common-properties
- Runloop Manual: Intervals
  - https://manual.runloop.com/docs/editors/intervals
- Runloop Manual: HIIT Timer
  - https://manual.runloop.com/docs/editors/hiit-timer/
- Runloop Manual: Circuit / Tabata Timer
  - https://manual.runloop.com/docs/editors/circuit-tabata-timer
- Runloop Manual: Round Timer
  - https://manual.runloop.com/docs/editors/round-timer/
- Runloop Manual: Custom Timer
  - https://manual.runloop.com/docs/editors/custom-timer
- Runloop Manual: Compound Timer
  - https://manual.runloop.com/docs/editors/compound-timer
- Runloop Manual: Sharing Timers
  - https://manual.runloop.com/docs/guides/sharing-timers
- Runloop Manual: Timer Settings
  - https://manual.runloop.com/docs/settings/timer-settings/
- Dribbble inspiration reference: Gym and Fitness App
  - https://dribbble.com/shots/27161453-Gym-and-Fitness-App
- NoDoubt Fitness Instagram
  - https://www.instagram.com/nodoubt.fitness/
