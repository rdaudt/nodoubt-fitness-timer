# Mobile IA / Wireframe Spec

## Product
No Doubt Fitness Timer

## Document Status
Draft v1

## Date
April 15, 2026

## Purpose
Translate the PRD into a mobile-first information architecture and low-fidelity wireframe specification for MVP1.

This document defines:

- app structure
- primary navigation
- screen inventory
- guest vs signed-in behavior
- wireframe content hierarchy
- key interaction rules

It is intentionally implementation-facing. It should be usable by design and engineering to build the first mobile UI without inventing structure from scratch.

## Design Intent
The product should feel:

- empowering
- fast
- athletic
- premium
- clear under physical stress

The visual system should use the NoDoubt Fitness brand language:

- deep navy / blue dominance
- high-contrast white type
- bold shapes
- energetic composition

The UI should be utility-first. Even with strong branding, the app must feel like a timer product first, not a promo site.

## Primary Mobile Principles
- Prioritize thumb-friendly actions in the lower half of the screen.
- Keep the main action obvious on every screen.
- Avoid dense forms on mobile; prefer stacked inputs, cards, sheets, segmented controls, and short wizard steps.
- Make active workout screens extremely glanceable.
- Reduce accidental destructive actions with confirmation and lock patterns.

## App Structure

### Global shell
The app should use a persistent mobile shell with:

- top app bar
- scrollable content area
- bottom navigation

### Bottom navigation
Bottom navigation should be present in the main app shell and include:

1. `Home`
2. `Create`
3. `Settings`

Rules:

- `Create` is the center, most visually prominent action.
- The run screen should hide bottom navigation entirely.
- Full-screen modal flows may also hide bottom navigation.

## Navigation Model

### Guest navigation model
- Guests land in the app without being forced to sign in.
- Guest home prioritizes official NoDoubt Fitness starter templates.
- Guests can enter create flows and run timers.
- Guests are prompted to sign in only when they try to save permanent data.

### Signed-in navigation model
- Signed-in users land on `Home`.
- Signed-in home prioritizes `My Timers`.
- Official templates remain visible below as a separate section.
- Account chip and first name are visible in the header area.

## Information Architecture

### Top-level screens
1. Splash / loading
2. Guest onboarding
3. Home
4. Create type picker
5. HIIT wizard
6. Circuit / Tabata wizard
7. Round wizard
8. Custom editor
9. Timer detail
10. Run screen
11. Completion screen
12. Sign-in prompt
13. Settings / profile
14. About NoDoubt Fitness
15. Delete account confirmation / re-auth flow

### Supporting overlays
1. Rename timer modal or bottom sheet
2. Delete timer confirmation dialog
3. Reset workout confirmation dialog
4. Lock controls affordance
5. Sign-in to save prompt
6. Toast / subtle confirmation messages

## Screen Hierarchy

### Guest path
1. Splash
2. Optional short onboarding
3. Home with official templates
4. Timer detail or create flow
5. Run
6. Completion
7. Sign-in prompt when saving

### Signed-in path
1. Splash
2. Session restore
3. Home with `My Timers`
4. Create or open timer detail
5. Edit as needed
6. Run
7. Completion

## Header Behavior

### Guest header
- compact NoDoubt Fitness wordmark in the app header
- optional small sign-in benefit message nearby or in content
- no avatar chip

### Signed-in header
- compact NoDoubt Fitness wordmark in the app header
- profile chip with avatar and first name
- optional subtle coaching CTA if it fits without crowding

## Home Screen

### Home goals
- Get users into a workout quickly
- Reinforce NoDoubt Fitness branding
- Make the app structure legible immediately
- Support repeat use for signed-in users

Brand note:

- home can support a stronger brand moment than utility-heavy screens
- if the full logo is used, it should appear in a contained hero, onboarding, or empty-state treatment rather than the default small top bar

### Guest home layout
Order:

1. app header
2. short contextual message about saving with Google sign-in
3. official NoDoubt Fitness templates section
4. optional CTA card for coaching / Instagram DM

Guest home should not open with an empty-state-feeling `My Timers` section.

### Signed-in home layout
Order:

1. app header with first name
2. `My Timers` section
3. official NoDoubt Fitness templates section
4. coaching / Instagram CTA strip or card

### Home wireframe: guest
```text
+--------------------------------------------------+
| NoDoubt Fitness                    [Sign in]     |
| Train now. Sign in to save timers permanently.   |
|                                                  |
| Official NoDoubt Templates                       |
| +----------------------------------------------+ |
| | [Official] 20 Min HIIT                       | |
| | 20:00 • 12 intervals                [Run now]| |
| +----------------------------------------------+ |
| +----------------------------------------------+ |
| | [Official] Beginner Circuit                  | |
| | 18:00 • 10 intervals                [Run now]| |
| +----------------------------------------------+ |
|                                                  |
| Train with NoDoubt Fitness -> Instagram DM       |
|                                                  |
| [Home]        [Create]        [Settings]         |
+--------------------------------------------------+
```

### Home wireframe: signed-in
```text
+--------------------------------------------------+
| NoDoubt Fitness                     [Ana v]      |
|                                                  |
| My Timers                               [Search] |
| +----------------------------------------------+ |
| | Leg Day Rounds                               | |
| | 24:00 • 16 intervals               [Run now] | |
| +----------------------------------------------+ |
| +----------------------------------------------+ |
| | Core Blast                          [Draft]   | |
| | 12:00 • 8 intervals                [Run now] | |
| +----------------------------------------------+ |
|                                                  |
| Official NoDoubt Templates                       |
| +----------------------------------------------+ |
| | [Official] 20 Min HIIT              [Run now] | |
| +----------------------------------------------+ |
|                                                  |
| Train with NoDoubt Fitness -> Instagram DM       |
|                                                  |
| [Home]        [Create]        [Settings]         |
+--------------------------------------------------+
```

### Home component rules
- Timer cards must show:
  - name
  - total duration
  - interval / round count
  - draft badge if applicable
  - official badge if applicable
  - `Run now`
- Tapping a card opens timer detail.
- Search applies only to personal timers.
- No swipe actions in MVP1.

## Empty State

### Signed-in empty state
If a signed-in user has no personal timers yet, `My Timers` should become a guided empty state.

Content priority:

1. simple motivational message
2. primary action: use official template
3. secondary action: create timer

### Empty-state wireframe
```text
+--------------------------------------------------+
| NoDoubt Fitness                     [Ana v]      |
|                                                  |
| My Timers                                        |
| You do not have any timers yet.                  |
| Start with a NoDoubt workout or build your own.  |
|                                                  |
| [Try Official Templates]                         |
| [Create Timer]                                   |
|                                                  |
| Official NoDoubt Templates                       |
| ...                                              |
|                                                  |
| [Home]        [Create]        [Settings]         |
+--------------------------------------------------+
```

## Create Entry

### Create action behavior
When the user taps `Create`, the app opens a timer type picker.

### Type picker options
1. HIIT
2. Circuit / Tabata
3. Round
4. Custom

### Create type picker wireframe
```text
+--------------------------------------------------+
| Create Timer                                     |
| Choose the timer type that fits your workout.    |
|                                                  |
| [HIIT]                                           |
| Work / rest repeats                              |
|                                                  |
| [Circuit / Tabata]                               |
| Exercise list with repeating rounds              |
|                                                  |
| [Round]                                          |
| Timed rounds with rest                           |
|                                                  |
| [Custom]                                         |
| Build your own interval structure                |
|                                                  |
|                               [Close]            |
+--------------------------------------------------+
```

## Wizard Flows

### Wizard design rules
- Use one question cluster per screen.
- Keep total wizard steps short.
- Show progress indicator at top.
- Use large numeric and segmented controls.
- Auto-generate the timer name.
- No explicit final save step for signed-in users.

### HIIT wizard
Recommended step grouping:

1. work duration
2. rest duration
3. number of rounds
4. optional warmup / cooldown / prep countdown
5. review + run

### Circuit / Tabata wizard
Recommended step grouping:

1. work duration
2. rest duration
3. number of exercises
4. number of rounds
5. optional warmup / cooldown / prep countdown
6. review + run

### Round wizard
Recommended step grouping:

1. round duration
2. rest duration
3. number of rounds
4. optional warmup / cooldown / prep countdown
5. review + run

### Wizard step wireframe
```text
+--------------------------------------------------+
| HIIT Setup                             Step 2/4  |
|                                                  |
| Rest Duration                                    |
|                 00:15                            |
|            [-]         [+]                       |
|                                                  |
| Common picks                                     |
| [10s] [15s] [20s] [30s]                          |
|                                                  |
|                                   [Next]         |
+--------------------------------------------------+
```

### Wizard review wireframe
```text
+--------------------------------------------------+
| HIIT Review                                      |
| HIIT 30/15 x 8                                   |
|                                                  |
| Warmup: 00:30                                    |
| Work:   00:30                                    |
| Rest:   00:15                                    |
| Rounds: 8                                        |
| Cooldown: 00:30                                  |
| Total: 06:30                                     |
|                                                  |
| [Run now]                                        |
| [Edit setup]                                     |
+--------------------------------------------------+
```

## Custom Editor

### Editor goals
- Support more flexible builds than the wizards
- Stay mobile-usable
- Show structure clearly without feeling like a spreadsheet

### Editor structure
Recommended vertical order:

1. top bar with timer name and close/back
2. summary block with total duration
3. optional setup blocks:
   - warmup
   - cooldown
   - preparation countdown
   - sets / cycles
4. interval list
5. add interval action
6. sticky bottom actions:
   - run
   - duplicate if editing existing timer

### Editor interaction patterns
- Reordering via drag handle
- Interval editing via expandable cards or bottom sheets
- Rest modeled as interval kind or basic rest controls
- Auto-save subtly

### Custom editor wireframe
```text
+--------------------------------------------------+
| Custom Timer                           [Close]   |
| Full Body Flow                                    |
| Total: 18:30                                      |
|                                                  |
| Warmup        00:30                               |
| Cooldown      00:30                               |
| Sets          3                                   |
| Prep          00:05                               |
|                                                  |
| Intervals                                         |
| [::] Squats                         00:40         |
| [::] Rest                           00:20         |
| [::] Push Ups                       00:40         |
| [::] Rest                           00:20         |
|                                                  |
| [+ Add interval]                                  |
|                                                  |
| [Run now]                                         |
+--------------------------------------------------+
```

## Timer Detail

### Detail goals
- Provide a safe review surface before action
- Support fast run and duplicate behavior
- Avoid dropping the user into editing immediately

### Detail content hierarchy
1. timer name
2. badges:
   - official
   - draft
3. summary row:
   - duration
   - interval / round count
   - type
4. primary action: `Run now`
5. secondary actions:
   - edit
   - duplicate
   - rename
   - delete for personal timers
6. full interval breakdown

### Detail wireframe
```text
+--------------------------------------------------+
| [Back] Timer Detail                              |
| Leg Day Rounds                                   |
| 24:00 • 16 intervals • Round                     |
|                                                  |
| [Run now]                                        |
| [Edit]   [Duplicate]   [Rename]                  |
|                                                  |
| Interval Breakdown                               |
| Warmup                            00:30          |
| Round 1                           02:00          |
| Rest                              00:30          |
| Round 2                           02:00          |
| ...                                              |
| Cooldown                          00:30          |
+--------------------------------------------------+
```

### Official template detail behavior
- Guests may open full detail.
- Editing an official template requires duplication first.
- The original official template should remain immutable in the main library.
- Official ownership should be shown via badge treatment rather than repeated full-logo placement.

## Run Screen

### Run goals
- Be readable at distance
- Work under physical movement
- Emphasize only the information needed right now

### Run hierarchy
1. current interval name
2. time remaining
3. next interval
4. set / round progress
5. total remaining
6. controls

### Run controls
1. pause / resume
2. previous
3. next
4. reset
5. lock controls

Rules:

- no arbitrary interval jumping in MVP1
- no bottom navigation
- no promotional banners
- portrait-first layout only
- branding should be minimal to nearly absent during active playback

### Run wireframe
```text
+--------------------------------------------------+
| Round 3                                          |
|                                                  |
|                    00:42                         |
|                                                  |
| Next: Rest                                       |
| Set 2 of 4 • Total left 12:18                    |
|                                                  |
| [Prev]   [Pause]   [Next]                        |
| [Reset]                         [Lock]           |
+--------------------------------------------------+
```

### Locked run state
- Controls collapse to a minimal unlocked affordance.
- Unlock action should require intent, not accidental tap.

### Locked run wireframe
```text
+--------------------------------------------------+
| Round 3                                          |
|                                                  |
|                    00:42                         |
|                                                  |
| Next: Rest                                       |
| Set 2 of 4 • Total left 12:18                    |
|                                                  |
|                     [Unlock]                     |
+--------------------------------------------------+
```

## Completion Screen

### Completion goals
- Mark the session as finished clearly
- Offer clean next actions
- Avoid turning into a heavy analytics/history screen

### Completion hierarchy
1. success / completion state
2. timer name
3. completed duration
4. primary action: `Done / Back home`
5. secondary action: `Run again`
6. subtle coaching CTA

### Completion wireframe
```text
+--------------------------------------------------+
| Workout Complete                                 |
| Leg Day Rounds                                   |
| Completed: 24:00                                 |
|                                                  |
| [Done / Back home]                               |
| [Run again]                                      |
|                                                  |
| Want coaching from NoDoubt Fitness?              |
| [Message on Instagram]                           |
+--------------------------------------------------+
```

## Sign-In Prompt

### Prompt goals
- Explain value, not just demand authentication
- Keep the user’s context visible
- Route only through Google sign-in

### Sign-in trigger moments
1. guest tries to save
2. guest is about to leave temporary work
3. guest wants persistent ownership of a timer

### Sign-in prompt wireframe
```text
+--------------------------------------------------+
| Save Your Timer                                  |
| Sign in with Google to save this timer to your   |
| private NoDoubt Fitness library.                 |
|                                                  |
| [Continue with Google]                           |
| [Not now]                                        |
+--------------------------------------------------+
```

## Settings / Profile

### Settings goals
- centralize account and app defaults
- provide business links without cluttering workout flows

### Settings sections
1. profile
2. workout defaults
3. account actions
4. business links

### Settings wireframe
```text
+--------------------------------------------------+
| Settings                                         |
| Ana                                              |
| ana@example.com                                  |
|                                                  |
| Workout Defaults                                 |
| Preparation Countdown                00:05       |
| Haptics                              On          |
| Lock Controls Default                Off         |
|                                                  |
| NoDoubt Fitness                                   |
| [About NoDoubt Fitness]                          |
| [Instagram]                                      |
|                                                  |
| Account                                          |
| [Sign out]                                       |
| [Delete account]                                 |
+--------------------------------------------------+
```

## About NoDoubt Fitness

### About goals
- explain the business briefly
- support lead generation
- avoid bloating the core utility flow

### About content
1. logo / brand header
2. short brand story
3. coaching CTA to Instagram DM
4. Instagram link

## Account Deletion Flow

### Deletion rules
- only available to signed-in users
- requires re-authentication
- clearly communicate data removal

### Deletion wireframe
```text
+--------------------------------------------------+
| Delete Account                                   |
| This will permanently delete your account and    |
| all personal timers and drafts.                  |
|                                                  |
| [Re-authenticate with Google]                    |
| [Cancel]                                         |
+--------------------------------------------------+
```

## Guest vs Signed-In Rules Summary

### Guests can
- browse official templates
- open official template detail
- create temporary timers
- run timers
- duplicate and temporarily edit official templates

### Guests cannot
- save timers permanently
- keep temporary timers after the session ends
- access a personal timer library

### Signed-in users can
- save unlimited personal timers
- create drafts
- search personal timers
- duplicate personal timers
- duplicate official templates into personal copies
- delete account

## Component Inventory

### Required reusable components
1. app header
2. bottom navigation
3. timer card
4. official badge
5. draft badge
6. section header
7. profile chip
8. CTA card / strip
9. wizard step layout
10. interval row
11. run controls cluster
12. confirmation dialog
13. toast

## Motion Guidance
- Keep motion functional, not decorative.
- Use short transitions between wizard steps.
- Use clear state transitions entering run mode.
- Use subtle card and section reveals on home.
- Avoid animation that competes with timer readability during active workouts.

## Copy Guidance
- Use short, confident labels.
- Prefer action-first wording such as `Run now`, `Create timer`, `Continue with Google`.
- Keep motivational copy light and brand-aligned.
- Do not use generic wellness clichés.

## Responsive Notes
- Phone portrait is the primary design target.
- Tablet may reuse the same architecture with more breathing room.
- Desktop can adapt from the same screen model, but should not drive layout decisions for MVP1.

## Wireframe Priorities For Design
If only a subset is designed first, prioritize:

1. signed-in home
2. guest home
3. create type picker
4. HIIT wizard
5. custom editor
6. timer detail
7. run screen
8. completion screen
9. sign-in prompt
10. settings

## Suggested Next Steps
1. Convert this spec into grayscale mobile wireframes.
2. Derive a visual design system from the logo and brand direction.
3. Create a screen-by-screen implementation plan.
4. Define the Supabase-backed data model to match these screens and states.
