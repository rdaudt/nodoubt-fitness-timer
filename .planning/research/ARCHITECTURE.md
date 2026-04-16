# Architecture Research

## Question
How should a mobile-first web interval timer/PWA like No Doubt Fitness Timer typically be structured, and which major components and data flows matter most?

## Short Answer
This kind of product is usually best built as a mostly client-driven app with a thin backend surface:

- A browser UI shell owns navigation, editing, and playback views.
- A deterministic timer engine owns run state and interval transitions.
- Supabase owns authentication, persistence, and authorization.
- IndexedDB owns offline cache and temporary guest state.
- A service worker makes the app installable and resilient offline, but not magically background-capable.
- Analytics should be event-based, minimal, and separated from workout playback.

The core architectural constraint is that browser timing is not native timing. The run loop must be designed around monotonic time and state rehydration, not around trusting timer callbacks to fire on time.

## Product Fit
The local docs already define the product shape:

- mobile-first, browser/PWA delivery
- guest and signed-in flows
- Supabase persistence
- official templates plus personal timers
- deterministic foreground timer behavior
- offline support for previously loaded timers

That means the architecture should optimize for three modes:

1. browse and edit
2. run a workout
3. recover state after refresh, tab switch, or partial offline loss

## Recommended System Boundary

### Client
The client should own:

- screen routing and shell layout
- timer authoring UI
- run screen rendering
- local draft/session cache
- audio/haptic permission priming
- event capture and batching

### Backend
The backend should stay narrow:

- Supabase Auth for Google sign-in
- Supabase Postgres for timer records, templates, and run/event records
- Row-level security for private user data
- optional serverless functions only for privileged or aggregated operations

### Shared rule
No business logic should rely on the server for the live workout clock. The server can store state and analytics, but the client must remain authoritative for the current run.

## Component Model

### 1. App Shell
Responsible for:

- top bar, bottom nav, and full-screen route switching
- guest vs signed-in entry state
- loading, session restore, and error states

It should be presentation-only except for auth/session bootstrapping.

### 2. Timer Library
Responsible for:

- listing timers and templates
- search over personal timers
- duplication, rename, delete, and create entry points
- draft badges and official badges

The library should read from local cache first, then reconcile with Supabase.

### 3. Timer Editor
Responsible for:

- structured timer authoring
- interval add/reorder/delete
- quick-create wizard flows
- auto-save for signed-in users

The editor should emit a validated timer definition, not playback state.

### 4. Timer Detail
Responsible for:

- read-only breakdown review
- run, duplicate, rename, and edit entry points
- duplication-before-edit for official templates

This screen is the stable boundary between browse and run.

### 5. Run Engine
Responsible for:

- flattening a timer definition into a playback sequence
- computing current step from absolute elapsed time
- pause/resume/reset/skip logic
- prep countdown, warning cues, and completion detection

This is the highest-risk subsystem and should be isolated from UI details.

### 6. Device Feedback Layer
Responsible for:

- audio cue playback
- vibration/haptics
- screen wake lock management
- fallback messaging when features are unavailable

These are capability adapters, not timing sources.

### 7. Sync Layer
Responsible for:

- local cache writes
- Supabase reads/writes
- conflict handling
- offline queue draining

This layer should be boring and explicit.

### 8. Analytics Layer
Responsible for:

- sign-in events
- timer start/completion events
- template usage
- Instagram CTA clicks

It should never block the run path.

## Timer Engine Shape

### Recommended internal model
Authoring data should be compiled into a flattened run plan before playback:

- header metadata
- ordered segments
- total duration
- cue points
- sequence hash/version

Each segment should include:

- segment id
- label
- kind
- duration
- visible count metadata
- cue metadata

### State machine
A practical run state machine is:

- idle
- prep
- running
- paused
- completed
- interrupted or restored

Transitions should be explicit and idempotent.

### Timing principle
Use a monotonic clock and derive the current segment from elapsed time. Do not advance the run by trusting repeated tick callbacks.

This matters because:

- `setTimeout()` and `requestAnimationFrame()` are throttled or paused in background contexts
- page visibility changes are common on mobile
- refreshes and tab switches can happen mid-workout

MDN documents that background tabs can throttle timers significantly, `requestAnimationFrame()` pauses in hidden tabs, and `performance.now()` is monotonic. Sources:

- [MDN setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
- [MDN requestAnimationFrame()](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame)
- [MDN performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)

### Practical implementation shape
The run loop should keep three values in sync:

- planned sequence
- wall-clock start/pause timestamps
- derived playback snapshot

On every render, derive:

- current segment
- remaining time in the segment
- total remaining time
- next segment

That keeps UI rendering and persistence independent from timing drift.

## Persistence Model

### Suggested record classes
The product should separate these concepts:

- template definitions
- user timers
- draft timers
- run sessions
- analytics events

Do not overload one table or one JSON blob with all concerns.

### Recommended storage split

#### Supabase Postgres
Use for:

- authenticated personal timers
- official templates
- persisted drafts for signed-in users
- run history or session summary data if needed
- aggregated analytics events

#### IndexedDB
Use for:

- guest temporary timers
- local cache of saved timers
- offline-loaded official templates
- active run session snapshots

IndexedDB is the better browser persistence layer for structured offline data. MDN describes it as the browser API designed for significant structured storage and offline use.

- [MDN IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [MDN Using IndexedDB](https://developer.mozilla.org/docs/Web/API/IndexedDB_API/Using_IndexedDB)

### Why not localStorage
localStorage is simple but too fragile and too limited for this use case:

- it is synchronous
- it is not a good fit for larger structured timer data
- it is a weak foundation for offline caches and run snapshots

Use it only for trivial flags if at all.

## Supabase Boundaries

### Auth
Use Supabase Auth with Google only for MVP. Keep auth state as the source of truth for signed-in user identity.

Supabase documentation confirms Google is a supported provider and that Auth is intended to work with OAuth-based sign-in.

- [Supabase Auth docs](https://supabase.com/docs/guides/auth)
- [Supabase Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google)

### Authorization
All private user tables must have row-level security enabled. Policies should key off the authenticated user id and never rely on the client for access control.

Supabase explicitly recommends enabling RLS on tables, views, and functions that protect data, and using policies tied to `auth.uid()`.

- [Supabase securing your API](https://supabase.com/docs/guides/api/securing-your-api)
- [Supabase RLS guide](https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security)

### Key rule
The client may safely use the public anon key, but the service role key must stay server-side only. Any privileged delete, admin, or cleanup operation should run through a serverless boundary, not from the browser.

- [Supabase API keys](https://supabase.com/docs/guides/api/api-keys)

## Offline And PWA Model

### What the PWA should do
The PWA layer should provide:

- installability
- cached shell assets
- offline access to previously loaded content
- fast repeat launch

### What it should not do
It should not promise native-like background execution. Browsers do not guarantee that timers, rendering, or audio continue reliably when the tab is hidden or the screen is off.

MDN documents that:

- `visibilitychange` fires when the page becomes hidden or visible
- hidden tabs are a signal to reduce work
- service workers support offline-first caching, but they do not solve foreground timing drift

Sources:

- [MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN Service Worker API](https://developer.mozilla.org/docs/Web/API/Service_Worker_API)
- [MDN Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)

### Offline strategy
Recommended offline order:

1. load shell and cached app assets
2. load local timer cache
3. render saved timers and official templates already on device
4. revalidate with Supabase when online
5. defer sync until connectivity returns

### Wake lock and playback
Request the Screen Wake Lock API while a workout is actively running and the browser supports it. Release it on pause, completion, interruption, or feature loss.

MDN documents the Screen Wake Lock API as a way to prevent the screen from dimming or locking while an app needs to keep running.

- [MDN Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)

## Auth And Guest Boundaries

### Guest mode
Guests should be allowed to:

- open official templates
- run a workout
- create a temporary timer
- keep local drafts for the current device/session

Guests should not get server-backed ownership until they sign in.

### Signed-in mode
Signed-in users should:

- save timers to Supabase
- restore their library on new devices
- keep drafts automatically
- delete their account with re-authentication

### Local privacy
After sign-out or account deletion, the client should clear local data that could expose private timers. Otherwise offline cache becomes a data leak vector on shared devices.

## Analytics And Events

### Event shape
Analytics should be treated as a separate pipeline with a narrow event contract:

- event name
- timestamp
- anonymous/session id
- timer/template id where relevant
- minimal context such as screen or CTA source

Avoid collecting timer contents, freeform notes, or personal workout semantics in analytics payloads.

### Events worth tracking first
Track only the events that inform product learning:

- sign in success
- timer created
- timer saved
- timer start
- timer complete
- official template opened
- official template duplicated
- coaching CTA clicked
- Instagram CTA clicked

### Delivery model
Best practice is to batch analytics asynchronously so the UI never waits on network reporting. If the implementation needs a trusted sink, use a small serverless endpoint or a Supabase table with constrained writes and aggregation later.

## Build Order Dependencies

### Phase 1: Foundation
Build first:

- app shell
- route model
- local storage adapter
- auth bootstrap
- basic timer data model

Without this, the rest of the app cannot be loaded, edited, or restored.

### Phase 2: Timer authoring
Build next:

- create flow
- timer editor
- wizard presets
- timer detail screen

These depend on the canonical timer data model.

### Phase 3: Run engine
Build after authoring:

- compile timer to flattened sequence
- deterministic playback snapshot
- pause/resume/reset/skip
- audio/haptic hooks
- completion state

This depends on stable timer definitions and local snapshot storage.

### Phase 4: Sync and offline
Build after the run engine exists:

- Supabase persistence
- RLS policies
- local-to-cloud reconciliation
- service worker caching
- offline rehydration

This depends on data model decisions made earlier.

### Phase 5: Analytics and hardening
Build last:

- event collection
- batching
- dashboard-ready summaries
- recovery and error telemetry

This should not block launch-critical timer flows.

## Major Architectural Risks

### 1. Timer drift and false precision
If the app counts down by incrementing every second, it will drift. The timer must derive state from absolute elapsed time.

### 2. Background throttling
Browsers throttle or pause work when hidden. The product should treat foreground reliability as the real guarantee and degrade gracefully otherwise.

### 3. Autoplay and haptic restrictions
Audio contexts and haptics are often gated by user interaction or device support. Cue priming must happen on a deliberate tap, and fallback UI must exist.

### 4. RLS mistakes
A single weak policy can leak private timers. RLS should be the default, not an afterthought.

### 5. Offline cache leakage
Guest or signed-in local caches can expose private data on shared devices if sign-out and deletion do not clear browser storage carefully.

### 6. Overbuilt backend
This product does not need a broad custom API. Extra backend layers would add failure modes and slow the MVP.

### 7. Event pollution
If analytics is mixed into workout state, the run path gets fragile. Keep it isolated and best-effort.

## Recommended Roadmap Implication
The architecture suggests roadmap phases should be ordered by dependency, not by feature popularity:

1. shell, auth, and local data model
2. editor and timer CRUD
3. deterministic run engine
4. Supabase sync and offline/PWA hardening
5. analytics, account deletion, and operational polish

That sequence minimizes rework because the timer engine and persistence model are the main structural decisions that everything else must conform to.

## Source References

- [PROJECT.md](../PROJECT.md)
- [PRD.md](../../docs/PRD.md)
- [MOBILE_IA_WIREFRAME_SPEC.md](../../docs/MOBILE_IA_WIREFRAME_SPEC.md)
- [MOBILE_BRANDING_SYSTEM.md](../../docs/MOBILE_BRANDING_SYSTEM.md)
- [MDN setTimeout()](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout)
- [MDN requestAnimationFrame()](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame)
- [MDN performance.now()](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)
- [MDN Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [MDN Service Worker API](https://developer.mozilla.org/docs/Web/API/Service_Worker_API)
- [MDN Using Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers)
- [MDN IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Supabase Auth docs](https://supabase.com/docs/guides/auth)
- [Supabase Google sign-in](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase securing your API](https://supabase.com/docs/guides/api/securing-your-api)
- [Supabase RLS guide](https://supabase.com/docs/learn/auth-deep-dive/auth-row-level-security)
- [Supabase API keys](https://supabase.com/docs/guides/api/api-keys)
