# Stack Research: No Doubt Fitness Timer

## Question
What is the standard 2026 stack for building this kind of mobile-first interval timer/PWA well, under Vercel + Supabase constraints?

## Short Answer
The best-fit 2026 stack is:

- `Next.js 16.x` App Router on `React 19.2` and `TypeScript`
- `Tailwind CSS v4` plus `Radix Primitives` for accessible UI building blocks
- `Supabase` for auth, Postgres, RLS, and persistence, using `@supabase/ssr` and `@supabase/supabase-js`
- `Zustand` for client state and timer/playback UI state
- `Dexie` over IndexedDB for offline cache, drafts, and local playback copies
- `Serwist` for service-worker-based PWA installability and precaching
- `Web Audio API`, `navigator.vibrate()`, and `navigator.wakeLock` for run-mode cues and screen wake behavior
- `Vitest`, `Testing Library`, and `Playwright` for unit, component, and device/emulation coverage
- `Vercel` for deployment and previews, with `Supabase CLI` for local DB/auth development, migrations, and generated types

This is the current "boring but strong" stack for a browser-first workout timer: modern React routing, a thin backend surface, offline-safe local storage, and browser-native timing/audio primitives instead of native-app assumptions.

## Why This Stack

### Frontend App Shell
- Use `Next.js 16.x` App Router because it is the current standard on Vercel and works cleanly with server/client boundaries, route layouts, and auth bootstrapping. Next.js docs now call out `16.1.0` as the point where the new `upgrade` command is available, so this repo should target `16.x`, not `15.x`.
- Keep most product screens as client components, but use server components or server actions only where they materially help, such as session bootstrap, protected writes, or account deletion flows.
- Use `TypeScript` from day one. This app has a structured timer model, playback state, and RLS-backed data contracts; the type safety pays off immediately.

### UI System
- Use `Tailwind CSS v4` because it is the current Tailwind generation and now centers CSS-first configuration instead of the old `tailwind.config.js`-heavy model.
- Pair Tailwind with `Radix Primitives` for dialogs, sheets, tabs, labels, toolbars, and other accessibility-sensitive controls. Radix is explicitly built for accessible, unstyled primitives and fits the app's need for large touch targets without custom keyboard/focus bugs.
- If the team wants starter components, `shadcn/ui` can sit on top of the same primitives, but the underlying dependency should still be Radix, not a heavyweight design system.

### State And Data Layer
- Use `Zustand` for editor state, playback state, selection state, and transient UI flags. It is lightweight, hook-based, and better aligned with this app than Redux-style ceremony.
- Keep timer compilation and run-state logic in pure functions or a small local domain module, not in a global store. The store should hold snapshots, not compute the workout.
- Use `@supabase/supabase-js` for the browser client and `@supabase/ssr` for cookie/session-aware server usage. Supabase docs recommend `@supabase/ssr` for Next.js, while noting the package is still beta and may change, so wrap it behind a small local adapter layer.
- Use Supabase Postgres as the source of truth for private timers, official templates, drafts, and account-linked metadata. Use RLS for all private tables and generate TypeScript types from the schema with `supabase gen types`.

### Offline, PWA, And Persistence
- Use `Dexie` with IndexedDB for local drafts, cached saved timers, and previously loaded timer copies. MDN describes IndexedDB as the browser API for significant structured client storage; it is the right fit here.
- Do not use `localStorage` for core timer data. MDN notes that Web Storage is synchronous, which makes it a poor fit for larger structured timer payloads, offline caches, and refresh recovery.
- Use `Serwist` for the service worker layer. It is the current actively maintained PWA stack in the Next.js ecosystem, and its docs explicitly position it as a forked replacement for the stagnated Workbox path.
- Cache the app shell, static assets, and previously loaded timer data. Do not claim background reliability beyond what browsers actually support.

### Timing, Audio, Haptics, And Wake Behavior
- Keep the workout clock entirely client-side. The timer engine should derive state from monotonic time and absolute boundaries, not from repeated tick callbacks.
- Use the `Web Audio API` for cues. MDN documents audio scheduling against `AudioContext.currentTime`, which is the right basis for consistent beeps and pre-scheduled transitions.
- Prime audio on the first deliberate user interaction. MDN documents that autoplay and vibration-style features are gated by user activation.
- Use `navigator.vibrate()` as a best-effort haptic layer and `navigator.wakeLock.request('screen')` while a workout is actively running. MDN notes both the secure-context requirement and the need to reacquire wake lock after visibility changes.

### Testing And Tooling
- Use `Vitest` for unit tests on timer compilation, segment math, persistence helpers, and validation logic.
- Use `Testing Library` for React component tests around forms, modals, and run controls.
- Use `Playwright` for end-to-end coverage, including mobile viewport emulation for iPhone/Android and desktop regression checks. Playwright explicitly supports mobile device emulation and browser coverage across Chromium, WebKit, and Firefox.
- Keep `npm` as the package manager for now because the repo already has `package-lock.json` and no evidence of pnpm/yarn adoption.

### Deployment And Ops
- Use `Vercel` for frontend hosting, previews, and edge/runtime deployment. Next.js remains Vercel's first-class full-stack path.
- Use the `Supabase CLI` locally for `supabase init`, `supabase start`, schema migrations, type generation, and auth/provider setup. Supabase docs explicitly recommend developing locally with the CLI and checking migrations into version control.
- Keep backend surface area minimal. Prefer direct client-to-Supabase traffic with RLS, plus only small server actions or route handlers for privileged operations.

## What Not To Use For MVP

- Do not use `localStorage` for core app state. It is synchronous and is the wrong storage layer for structured offline timer data.
- Do not use Redux or a large event-sourced state architecture. This app needs fast, local, form-heavy UI state, not broad enterprise state ceremony.
- Do not introduce a custom Express/Nest backend unless a real privileged workflow appears. Supabase already covers auth, persistence, and authorization.
- Do not use React Native, Expo, or any native-only audio/background assumption. The product is explicitly a browser/PWA MVP and must respect mobile browser limits.
- Do not default to a stale Workbox-era PWA setup or `next-pwa` clone first. Serwist is the more current active path for Next.js PWA work.
- Do not depend on background timer fidelity, lock-screen playback, or OS-level media controls. The browser can only offer best-effort foreground reliability.

## Current Version Snapshot

- `Next.js`: current docs point to `16.x`, with `16.1.0` as the current upgrade-command threshold.
- `React`: current docs and blog posts show `19.2` as the active line, and React Compiler defaults to targeting React 19.
- `Tailwind CSS`: v4 is current, with v4.1 already documented and v4.2 docs present.
- `Zod`: v4 is stable and recommended by the project docs.
- `Supabase SSR`: `@supabase/ssr` is recommended for Next.js, but the docs label it beta, so isolate it behind a local wrapper.

## Confidence

| Area | Recommendation confidence | Notes |
| --- | --- | --- |
| Frontend framework | High | Next.js 16.x + React 19.2 is the current mainstream Vercel path. |
| UI primitives | High | Tailwind v4 + Radix is a proven fit for a touch-heavy, accessible app. |
| State/data layer | Medium-high | Zustand + Supabase + Dexie is the right shape, but exact store boundaries should be validated in implementation. |
| Offline/PWA | Medium | Serwist is current, but service-worker behavior still needs browser testing on iOS and Android. |
| Timing/audio | High | Browser-native timing and Web Audio scheduling are the correct primitives. |
| Testing/tooling | High | Vitest + Testing Library + Playwright is the current practical setup for this app class. |
| Deployment | High | Vercel + Supabase CLI is a low-ops fit for the stated constraints. |

## Practical References

- Next.js App Router docs: https://nextjs.org/docs/app
- Next.js 16 upgrade docs: https://nextjs.org/docs/app/getting-started/upgrading
- React blog and versions: https://react.dev/blog and https://react.dev/versions
- Supabase Next.js SSR guide: https://supabase.com/docs/guides/auth/server-side/nextjs
- Supabase Google login guide: https://supabase.com/docs/guides/auth/social-login/auth-google
- Supabase CLI docs: https://supabase.com/docs/guides/cli/getting-started
- MDN Wake Lock API: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API
- MDN Vibration API: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/vibrate
- MDN IndexedDB: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- Serwist docs: https://serwist.pages.dev/
- Playwright emulation docs: https://playwright.dev/docs/emulation
- Vitest browser mode docs: https://vitest.dev/guide/browser/
