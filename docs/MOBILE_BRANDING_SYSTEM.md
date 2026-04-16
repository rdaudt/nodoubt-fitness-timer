# Mobile Branding System

## Product
No Doubt Fitness Timer

## Document Status
Draft v1

## Date
April 15, 2026

## Purpose
Define how NoDoubt Fitness branding should appear in the mobile product so the app is clearly branded without compromising usability.

This document answers:

- where the logo should appear
- where it should not appear
- which brand treatments are needed for mobile
- how to adapt the current logo for app UI use

## Core Position
The app should feel unmistakably like a NoDoubt Fitness product, but it should not behave like a logo showcase.

Branding in this product should follow a simple rule:

- use strong branding to establish identity
- use compact branding in persistent app chrome
- reduce branding during active workouts

## The Current Logo
The current logo in [media/nodoubt-fitness-logo.png](C:/Users/Carboteiro/projects/nodoubt-fitness-timer/media/nodoubt-fitness-logo.png) is effective as a primary brand asset because it is:

- distinctive
- bold
- athletic
- visually memorable

However, for mobile UI it also has constraints:

- it is horizontally wide
- it contains multiple figures and detailed shapes
- it is visually dense for small top bars
- it competes with utility controls if used too often at small sizes

## Branding Recommendation
Do not use the full current logo as the default header asset on every screen.

Instead, the mobile brand system should use three brand treatments:

### 1. Full logo
Use the current full logo on brand-establishing surfaces.

### 2. Compact app wordmark
Create a simpler horizontal treatment for regular app header use.

Recommended content:

- `NODOUBT FITNESS`
- or `NoDoubt Fitness`

This can be text-based initially if no refined wordmark asset exists yet.

### 3. Small brand mark / badge
Create a reduced symbol for tight spaces such as:

- splash screen accents
- official template badges
- future app icon studies

Recommended source for the small mark:

- mountain + upward arrow motif
- or a simplified `ND` monogram if a cleaner symbol is designed later

## Required Brand Assets For MVP
The product can launch with the current full logo plus a temporary text-based compact wordmark.

Recommended asset set:

1. `Primary full logo`
The existing logo asset.

2. `Compact wordmark`
A simpler brand treatment for app headers.

3. `Official template badge`
A small locked-up label or pill that clearly marks NoDoubt-owned content.

4. `App icon candidate`
Not required for core UI layouts, but needed soon for PWA install quality.

## Screen-Level Usage Rules

## 1. Splash / loading
Brand treatment:

- full logo allowed

Reason:

- this is a brand-establishing moment
- detail is acceptable because the screen is singular and intentional

Recommendation:

- center the full logo
- keep supporting copy minimal

## 2. Guest onboarding
Brand treatment:

- full logo or large compact wordmark

Reason:

- this is another identity-establishing surface
- branding should feel confident and official

## 3. Home screen
Brand treatment:

- compact wordmark in the header
- optional larger full-logo moment in a hero strip only if it does not push timer content too low

Recommendation:

- do not use the full detailed logo inside the small top bar
- keep the first scroll view utility-first
- if the full logo is used, place it in a contained top card or onboarding state, not as a persistent header element

## 4. Timer detail
Brand treatment:

- compact wordmark in app chrome
- official badge for NoDoubt-owned templates

Recommendation:

- do not place the full logo above every timer detail screen
- use the official template indicator to reinforce brand ownership instead

## 5. Create flows and editor
Brand treatment:

- compact wordmark only

Reason:

- these are utility-heavy screens
- large branding would hurt editing clarity

## 6. Run screen
Brand treatment:

- no full logo
- no large brand presence
- optional extremely subtle compact branding only if it does not compete with timing information

Recommendation:

- prioritize workout readability entirely
- if any brand presence exists, it should be secondary text or a tiny top label, not a visual focal point

## 7. Completion screen
Brand treatment:

- compact wordmark or small badge
- subtle CTA to NoDoubt Fitness

Reason:

- branding can return once the timer task is complete

## 8. Settings
Brand treatment:

- compact wordmark in header
- full logo may appear in an about card or brand section

## 9. About NoDoubt Fitness
Brand treatment:

- full logo strongly encouraged

Reason:

- this is a business-oriented screen, not a utility-heavy one

## Brand Hierarchy By Surface

### High-brand surfaces
- splash
- onboarding
- about

These can use the full logo.

### Medium-brand surfaces
- home
- settings
- completion

These should use compact brand treatments first, with selective full-logo use in supporting sections.

### Low-brand surfaces
- create flows
- custom editor
- timer detail

These should use compact branding only.

### Minimal-brand surfaces
- run screen

These should minimize branding almost entirely.

## Header Rules
The mobile app header should use a compact brand treatment, not the full logo.

Recommended header pattern:

- compact wordmark on the left
- profile chip or contextual action on the right

Why:

- it preserves vertical space
- it keeps the top bar readable
- it avoids shrinking the full logo into illegibility

## Official Template Branding
Official NoDoubt templates should not rely on the full logo repeated on every card.

Instead, use a reusable official treatment:

- `Official`
- `NoDoubt Official`
- or `Coach Pick`

Recommended UI form:

- pill badge
- small card ribbon
- section label

This is cleaner and more scalable than repeating the full logo on every card.

## CTA Branding
Business CTAs should feel connected to the brand system.

Recommended CTA language:

- `Train with NoDoubt Fitness`
- `Message NoDoubt Fitness`
- `Coach with NoDoubt Fitness`

Recommended CTA placement:

- home support card
- completion screen secondary action area
- about screen primary CTA

Not recommended:

- intrusive banners inside run mode
- repeated large promo blocks across utility screens

## Color Use Guidance
When the product moves from grayscale to visual design:

- use deep navy / blue as the brand anchor
- use white for key contrast
- use lighter steel / slate neutrals for support
- use high-contrast accent states for action and progress

The palette should feel:

- strong
- athletic
- clean
- premium

Avoid:

- soft pastel wellness palettes
- generic purple SaaS palettes
- overusing black in a way that loses the brand's blue identity

## Typography Guidance
Because the full logo is visually heavy, the UI typography must carry some of the brand tone.

Recommended direction:

- strong, condensed or semi-condensed display treatment for key headings
- clean readable body type for utility areas
- avoid bland default app typography for hero and key labels

The header wordmark should feel firm and athletic, not delicate.

## Clear Space And Sizing Guidance

### Full logo
- use only when it can remain legible
- do not squeeze it into a standard 44 to 56px app header
- give it clear space above and below

### Compact wordmark
- optimize for header height around 20 to 28px visual height
- keep it readable at small sizes

### Official badge
- keep it compact and repeatable
- do not let it overpower timer names

## MVP Implementation Guidance
If no new brand assets are designed yet, use this fallback sequence:

### Immediate fallback
- use styled text `NoDoubt Fitness` as the compact wordmark
- use the current full logo on splash and about
- use a simple `Official` badge for NoDoubt templates

### Next asset pass
Design and export:

1. compact wordmark SVG
2. reduced symbol / badge mark
3. PWA icon set

## Recommended Asset Decisions
For the next design pass, I recommend:

1. Keep the current full logo as the primary business logo.
2. Create a compact app wordmark specifically for in-app headers.
3. Create a simplified symbol derived from the mountain / arrow motif for badges and icon studies.
4. Do not force the full logo into the run screen or dense utility headers.

## Explicit Placement Decision
To answer the product question directly:

Yes, the logo should be shown in the app.

But it should be shown selectively:

- definitely on splash, onboarding, and about
- optionally in a controlled home hero area
- not as the default tiny header logo on every screen
- effectively absent during active workout playback

That approach preserves both:

- brand recognition
- product usability

## Suggested Next Steps
1. Create a compact `NoDoubt Fitness` wordmark for header use.
2. Create an `Official NoDoubt` badge style for starter templates.
3. Update the wireframes so they show full-logo vs compact-brand usage explicitly.
4. Create a visual design direction board using the logo-derived palette.
