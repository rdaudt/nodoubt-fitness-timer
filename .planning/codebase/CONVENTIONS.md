# Conventions

This repository is currently documentation-heavy and implementation-light. The dominant artifacts are product/spec docs in `docs/`, generated visual outputs in `output/playwright/`, and a single brand asset in `media/`. There is no committed app source tree yet, so most conventions are emerging from documentation rather than code.

## Naming Patterns

- Document files use uppercase, descriptive snake-style names in `docs/`, such as `PRD.md`, `MOBILE_BRANDING_SYSTEM.md`, and `MOBILE_IA_WIREFRAME_SPEC.md`.
- The wireframe artifact follows the same naming style but uses HTML: `docs/WIREFRAMES.html`.
- Generated screenshot files in `output/playwright/` are numbered with two digits and a slug, such as `01-guest-home.png` and `10-settings-profile.png`.
- The screenshot naming suggests ordered coverage of user flows, not arbitrary capture names.
- The brand image uses a stable asset-style name: `media/nodoubt-fitness-logo.png`.

## Documentation Style

- Markdown docs start with a short title and a repeated metadata block:
  - `## Product`
  - `## Document Status`
  - `## Date`
  - `## Purpose`
- The docs use clear sectioning and short, declarative paragraphs.
- Lists are preferred over long prose when defining requirements or behavior.
- Requirements are written with implementation-facing language such as “should,” “do not,” and “recommended.”
- The `docs/PRD.md` explicitly distinguishes product facts from inference, which is a good cue for future docs to label assumptions instead of presenting them as settled standards.
- External references are used sparingly and directly, often with file links or source notes rather than long narrative citations.
- The docs are written for design and engineering consumption, not for marketing copy.

## Repo Hygiene

- The repo keeps generated or bulky artifacts out of the source root by separating them into `docs/`, `media/`, and `output/`.
- `node_modules/`, build outputs, coverage, and local environment files are ignored in `.gitignore`.
- The presence of `output/playwright/` in the repo indicates that visual QA artifacts are intentionally retained, at least for now.
- The project already includes Playwright in `devDependencies`, so browser-based verification is treated as a first-class workflow even before app code exists.
- There is no lint config, formatter config, or editor config committed yet, so there is no enforced code-style automation visible in the repository.

## Commit Clues

- Recent commits describe work in product artifact terms rather than source-code terms:
  - `Add initial product requirements and brand assets`
  - `Add mobile IA and wireframe specification`
  - `Add grayscale mobile wireframes`
  - `Set up Playwright`
  - `Add mobile branding system`
- That history implies the current workflow is spec-first and visual-spec-first.
- The commits also suggest a clean layering of work: requirements first, then IA, then wireframes, then branding, then test tooling.
- Commit titles are short, imperative, and feature-oriented.

## Generated Assets

- `output/playwright/*.png` appears to be generated from Playwright-based visual capture.
- The repository keeps those PNGs checked in, so they function as documentation evidence as well as artifacts.
- The large `wireframes-overview.png` suggests a summary or contact sheet image rather than a hand-authored asset.
- There is no sign of source files for these images in the repository, so they should be treated as derived outputs.
- The `media/` directory appears to hold authored brand assets, while `output/` holds generated verification or presentation assets.

## Emerging Quality Conventions

- Visual hierarchy and usability are emphasized over decorative detail in the docs, especially in `docs/MOBILE_IA_WIREFRAME_SPEC.md` and `docs/WIREFRAMES.html`.
- The docs consistently frame the product as mobile-first and utility-first.
- Brand presence is explicitly constrained so it does not interfere with timer usability.
- The docs prefer compact, scannable structures that would be easy to update as the product evolves.
- The repo currently looks like a pre-implementation planning workspace, so conventions should be considered provisional until app source lands.

## File References

- `docs/PRD.md`
- `docs/MOBILE_IA_WIREFRAME_SPEC.md`
- `docs/MOBILE_BRANDING_SYSTEM.md`
- `docs/WIREFRAMES.html`
- `output/playwright/01-guest-home.png`
- `output/playwright/wireframes-overview.png`
- `.gitignore`
- `package.json`
