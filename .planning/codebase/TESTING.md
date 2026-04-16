# Testing

This repository has very limited automated testing in its current state. The only explicit test-related dependency is `playwright` in `package.json`, and the only package script is a placeholder `npm test` that exits with an error. There are no committed app tests, no config files for a test runner, and no source code yet to exercise.

## Current Test Tooling

- `package.json` includes `playwright` under `devDependencies`.
- There is no `playwright.config.*` file in the repository root.
- There are no `*.spec.*` or `*.test.*` files in the committed tree.
- The `test` script is currently the default scaffold:
  - `echo "Error: no test specified" && exit 1`
- The presence of checked-in screenshots under `output/playwright/` suggests Playwright is being used for visual capture or documentation, even if not for formal regression tests yet.

## Existing Test Artifacts

- The repository contains rendered PNG outputs in `output/playwright/`, including:
  - `01-guest-home.png`
  - `02-signed-in-home.png`
  - `03-create-type-picker.png`
  - `04-hiit-wizard.png`
  - `05-custom-editor.png`
  - `06-timer-detail.png`
  - `07-run-screen.png`
  - `08-completion-screen.png`
  - `09-sign-in-prompt.png`
  - `10-settings-profile.png`
  - `wireframes-overview.png`
- These appear to be visual QA or design-validation artifacts rather than executable tests.
- `docs/WIREFRAMES.html` is also a visual artifact that likely acts as a manual review surface.

## What Is Automated Today

- Package installation is automated through npm lockfile state, but that is dependency management rather than test coverage.
- Playwright is available as a tool, but there is no evidence of an active automated test suite.
- There is no evidence of assertions, report output, snapshot baselines, CI hooks, or test command wiring.
- No coverage tooling is present.

## What Is Manual Today

- Document review is manual.
- Product and UX validation are manual through `docs/PRD.md`, `docs/MOBILE_IA_WIREFRAME_SPEC.md`, and `docs/WIREFRAMES.html`.
- Visual verification appears manual through the checked-in Playwright screenshots in `output/playwright/`.
- Brand consistency is also manually reviewed through `docs/MOBILE_BRANDING_SYSTEM.md` and `media/nodoubt-fitness-logo.png`.

## Gaps

- No automated unit, integration, or end-to-end test suite exists yet.
- No test environment, browser launch config, or CI trigger is documented.
- No linting or formatting checks are visible, so code quality gates are not established.
- There are no snapshot assertions or regression baselines to detect UI drift.
- Because the repo is currently pre-implementation, the main risk is that quality validation will remain ad hoc unless a test scaffold is added with the first source files.

## Practical Implications

- Any future implementation work should treat Playwright as the obvious starting point for automated UI coverage.
- The current visual artifacts can serve as baseline references when actual tests are introduced.
- Until then, quality is mostly enforced through documentation fidelity and manual visual review.
- If app code is added later, the repository will need at least one of:
  - a real `test` script
  - a Playwright config
  - executable smoke tests
  - CI wiring for regression checks

## File References

- `package.json`
- `package-lock.json`
- `output/playwright/01-guest-home.png`
- `output/playwright/wireframes-overview.png`
- `docs/WIREFRAMES.html`
- `docs/PRD.md`
