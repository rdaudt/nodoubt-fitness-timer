# Stack

## Current State
This repository is documentation-heavy and appears pre-implementation. The root contains `package.json`, `package-lock.json`, product/spec docs under `docs/`, generated mockups in `output/playwright/`, and a branded asset in `media/`. There is no visible application source tree yet (for example no `src/`, `app/`, `pages/`, or `server/` directory), so the stack below reflects the repo's declared tooling and the product's intended runtime, not a running app.

## Languages and Runtime
- `package.json` declares `type: "commonjs"`, so the Node entry/runtime is CommonJS rather than ESM.
- The only declared package-manager metadata is standard npm (`package-lock.json` is present); there is no `pnpm-lock.yaml` or `yarn.lock`.
- There is no frontend framework code checked in yet, so no confirmed React/Vue/Svelte/Next/Vite runtime can be inferred from source.
- The repo currently includes HTML documentation/artifact files, so plain browser-rendered HTML is part of the working set.
- The docs describe a mobile web/PWA product, but that is a product direction rather than an implemented runtime.

## Dependency Summary
- `devDependencies`: `playwright` `^1.59.1` is the only declared dependency in `package.json`.
- No production dependencies are declared yet.
- There is no evidence of framework packages such as `react`, `next`, `vite`, `vue`, or `svelte` in the manifest.
- There is no evidence of backend client SDKs such as `@supabase/supabase-js`, analytics SDKs, or auth SDKs.
- The presence of `package-lock.json` indicates npm has already resolved at least the Playwright dependency tree.

## Tooling
- `npm` is the effective package manager based on the lockfile and manifest.
- `playwright` is used for browser-driven artifact capture; `output/playwright/*.png` suggests screenshots were generated from that workflow.
- `docs/WIREFRAMES.html` is a hand-built HTML artifact for grayscale wireframes and can be opened directly in a browser.
- There is a root `.gitignore`, but no repo-level formatter/linter/test configuration is visible yet.
- `package.json` defines only a placeholder `test` script that exits with an error, so there is no active test harness wired up in the manifest.

## Artifact Types Present
- Product and planning docs: `docs/PRD.md`, `docs/MOBILE_IA_WIREFRAME_SPEC.md`, `docs/MOBILE_BRANDING_SYSTEM.md`.
- Browser-renderable artifact: `docs/WIREFRAMES.html`.
- Generated screenshots: `output/playwright/*.png` including guest home, signed-in home, create flows, editor, run screen, completion, sign-in prompt, and settings.
- Brand asset: `media/nodoubt-fitness-logo.png`.
- Package metadata: `package.json` and `package-lock.json`.

## Notable Absences
- No app source directories yet, so there is no confirmed implementation stack.
- No environment example file such as `.env.example` and no visible runtime config for deployment.
- No CI configuration, linting rules, formatting config, or build pipeline are present in the repo root.
- No database schema, migration files, or client SDK initialization code is present yet.
- No service-worker, manifest, or other concrete PWA implementation files are visible yet.
- No audio, timer engine, or auth code exists in the checked-in tree at this stage.

## Practical File References
- `package.json`
- `package-lock.json`
- `docs/PRD.md`
- `docs/MOBILE_IA_WIREFRAME_SPEC.md`
- `docs/MOBILE_BRANDING_SYSTEM.md`
- `docs/WIREFRAMES.html`
- `output/playwright/01-guest-home.png`
- `output/playwright/10-settings-profile.png`
