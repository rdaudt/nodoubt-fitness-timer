# Phase 1 Research: Foundation, Access, and Data Boundaries

## What This Phase Needs To Solve

Phase 1 is not about shipping timer features. It needs to establish the app shell, the guest versus signed-in entry split, Google auth bootstrap, signed-in identity context, official-template home behavior, and the Supabase ownership boundary that keeps personal timers private.

The planning risk here is front-loading the wrong abstractions. If the app shell, auth session model, and ownership model are vague now, later authoring and run work will inherit rework.

## Source Inputs That Matter

- [REQUIREMENTS.md](../../../REQUIREMENTS.md)
- [ROADMAP.md](../../../ROADMAP.md)
- [PROJECT.md](../../../PROJECT.md)
- [STATE.md](../../../STATE.md)
- [PROJECT RESEARCH SUMMARY](../../../research/SUMMARY.md)
- [PRD.md](../../../docs/PRD.md)
- [MOBILE_IA_WIREFRAME_SPEC.md](../../../docs/MOBILE_IA_WIREFRAME_SPEC.md)
- [MOBILE_BRANDING_SYSTEM.md](../../../docs/MOBILE_BRANDING_SYSTEM.md)
- [Next.js pages and layouts](https://nextjs.org/docs/14/app/building-your-application/routing/pages-and-layouts)
- [Next.js loading UI and streaming](https://nextjs.org/docs/13/app/building-your-application/routing/loading-ui-and-streaming)
- [Supabase SSR with Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Supabase auth and users](https://supabase.com/docs/guides/auth/users)
- [Supabase Google login](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Supabase RLS guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase API hardening](https://supabase.com/docs/guides/api/securing-your-api)

## Recommended Implementation Shape

Use the App Router with a root layout for global document chrome, then split the product into route groups so the shell can differ between the main app, auth-related surfaces, and the full-screen run experience.

The important architectural point is that layouts are shared and nested by default, route groups can opt segments in and out of shared layouts, and route-level `loading.tsx` can provide a skeleton while session state resolves. That gives a clean way to render a mobile shell for home/settings while keeping the run surface free of bottom navigation.

For Supabase, use the current SSR pattern with `@supabase/ssr`, a browser client for client components, a server client for server code, and a proxy/middleware layer that refreshes cookies. Supabase’s own Next.js guidance says server components cannot write cookies and that `supabase.auth.getClaims()` is the trust boundary for server-side page protection.

## Planning Guidance By Requirement

### AUTH-01, AUTH-02, AUTH-03

The app must allow guest entry, Google sign-in, and session persistence across return visits. The best planning assumption is:

- guests can browse the public shell without any auth gate
- signed-in sessions should restore from cookies on initial load
- the app should derive auth state server-side first, then hydrate client state

Do not plan around `getSession()` as a security boundary. Supabase explicitly warns that server code should use `getClaims()` to protect pages and user data.

### LIBR-07, LIBR-08, TMPL-01

Guest and signed-in home are the same product surface with different prioritization:

- guest home should lead with official NoDoubt templates
- signed-in home should lead with `My Timers`
- official templates should stay visible in a separate section in both states

The planning question is whether official templates live in a dedicated read-only table/view or as seeded immutable rows in the same timer table. Either can work, but the decision affects later duplication, RLS, and admin tooling. My recommendation is a read-only official-template source of truth that is clearly separate from personal timers, even if the user-facing card component is shared.

### SETG-02

The signed-in header chip needs first-name context, but that value should be display-only. Supabase’s user docs note that `user_metadata` comes from provider identity data and is not security-sensitive, so it should not drive authorization. For planning, prefer a small `profiles` table or equivalent derived display record for first-name rendering, with a fallback if the provider payload is missing or unhelpful.

### PRIV-01

This is the real boundary work of Phase 1. The database must ensure a signed-in user can only read and write their own personal timers and drafts.

Supabase’s security docs are explicit:

- every exposed public table should have RLS enabled
- any table without RLS in `public` is publicly accessible through the Data API
- `anon` and `authenticated` are distinct Postgres roles
- `auth.uid()` returns `null` for unauthenticated requests

That means Phase 1 should define the ownership contract before any feature code assumes it exists.

## Recommended Data Boundary Model

For planning purposes, separate data into three buckets:

1. `official_templates`: immutable NoDoubt-owned starter timers, readable by everyone
2. `personal_timers`: user-owned timers and drafts, readable and writable only by the owner
3. `profiles`: minimal user-display record for first name and header chip context

The timer table should include an owner field and a source/type field so later duplication and draft handling do not require a schema rewrite. For access control, the most common pattern is an RLS policy using `(select auth.uid()) = user_id` on authenticated-only tables, with explicit `TO authenticated` clauses.

One detail to settle now: whether official templates are copied into user space when opened for edit, or only when explicitly duplicated. The roadmap and PRD point to duplication before editing, so Phase 1 should preserve that rule in the data model even before the editor exists.

## Recommended Implementation Order

1. Define the route and layout skeleton first.
2. Add Supabase SSR client utilities and session refresh plumbing.
3. Establish the auth bootstrap and signed-in identity source.
4. Seed or expose official templates as read-only data.
5. Freeze the timer ownership schema and RLS policies.
6. Add the shell-level guest versus signed-in home split.

That order keeps the app shell and security boundary ahead of UI details. It also minimizes the chance that home layout work gets coupled to an unstable auth or data contract.

## Risky Assumptions To Surface In Planning

- The first-name chip can be built directly from Google metadata. This is convenient, but metadata is not a security boundary and may be incomplete or inconsistent.
- A single shared timer table can represent both personal timers and official templates. That is possible, but only if the ownership and immutability rules are explicit and enforced.
- Client-only session state is enough for the shell. It is not, if the initial home render needs to reflect signed-in identity reliably after a refresh.
- Public template reads are harmless. They are only harmless if the read policies are deliberate and personal rows remain isolated by RLS.

## Open Questions To Resolve Before Planning Starts

- Are official templates stored as a dedicated table, a view over seeded rows, or static config loaded into the app?
- Should the signed-in first-name chip come from Google metadata, a `profiles` row, or a derived server field?
- Which shell route should be the default landing page for guests versus signed-in users?
- Should auth bootstrap happen in a route-level loading state, a root-level shell gate, or both?
- Do we want the official template section to use the same timer-card component as personal timers from day one?
- What minimum profile data should exist in Phase 1 so later settings work does not require a schema migration?

## Validation Architecture

Phase 1 validation should be mostly structural and security-focused.

- Confirm the guest route renders without requiring auth and shows official templates first.
- Confirm the signed-in route restores session state after refresh and shows the first-name header chip.
- Confirm the app shell keeps bottom navigation on home/settings but not on the run route.
- Confirm a direct database read from another user cannot return personal timers when RLS is enabled.
- Confirm unauthenticated requests fail closed on private tables because `auth.uid()` is null.
- Confirm the auth bootstrap path uses the SSR cookie flow and not only client memory.

The plan should preserve at least one integration check for each of these. If a check is missing now, later authoring work will have to rediscover the boundary under feature pressure.

## Practical Recommendation

Treat Phase 1 as a foundation contract, not a UI milestone. The minimum successful outcome is:

- shell structure exists
- guest can enter and browse official templates
- signed-in user restores correctly and sees their identity context
- private timer data is protected at the database level
- official templates are clearly separated from personal timers

If those five things are stable, Phase 2 can build on a predictable app surface instead of a moving target.
