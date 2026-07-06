# Changelog

All notable changes to the Thai Wet-Season Rice Simulator are documented here.

Thai version: [CHANGELOG.th.md](CHANGELOG.th.md)

This project follows a lightweight changelog style inspired by [Keep a Changelog](https://keepachangelog.com/). Dates use `YYYY-MM-DD`.

## [0.1.0] - 2026-07-06

### Added

- Converted the original Claude Design prototype into a working React, Vite, and Tailwind CSS web app.
- Added the core rice farming simulation engine for Thai wet-season rice planning.
- Added linked scoring for growth, fertilizer, water, soil, pest and disease, weather, timing, yield, cost, revenue, profit, and risk.
- Added editable fertilizer applications by growth stage with total N/P/K nutrient calculation.
- Added editable production cost model for seed, fertilizer, chemicals, labor and machinery, rent, fuel, transport, and total cost override.
- Added linked cost drivers so field risks such as pest, disease, weed, water stress, flood, soil condition, and timing affect cost pressure.
- Added rice field animation that reflects crop condition from excellent to poor.
- Added Thai/English language toggle.
- Added scenario presets, farm system presets, and white-rice survival cases.
- Added collectable straw estimation using the rice-map-style residue method with caps against surplus straw availability.
- Added default farmer net straw price guidance and straw revenue calculations.
- Added farm-size totals for revenue, cost, rice income, straw income, profit, and carbon estimate.
- Added break-even sensitivity, survival target planning, debt and cashflow layer, and planning workflow panels.
- Added A/B/C scenario comparison and scenario history/reporting flows.
- Added methodology, assumptions and sources, data quality badges, onboarding, export report, and shareable scenario report.
- Added mobile tabs and responsive panel behavior.
- Added simulation unit tests.
- Added ESLint, Prettier, `npm run lint`, `npm run format`, `npm run format:check`, and `npm run check`.
- Added Netlify production deployment.

### Changed

- Reworked presets into a tabbed starter library to reduce left-panel clutter.
- Moved white-rice survival cases into the scrollable control flow.
- Made the left control panel a single scroll area.
- Grouped right-side dashboard sections for easier scanning.
- Renamed sale price to average paddy price.
- Changed price logic so market price remains an external input, while field conditions mainly affect yield, quality, and costs.
- Updated white rice and Hom Mali default paddy prices and default production cost assumptions.
- Updated the UI toward a cleaner minimal style.
- Improved rice field plant graphics and removed duplicate field overlays.
- Improved English fertilizer formula labels.
- Improved mobile panel behavior and localization bugs.
- Clarified debt cash need calculation and white-rice survival economics.
- Enhanced the shareable scenario report.
- Formatted the codebase with Prettier.

### Fixed

- Fixed total nutrient calculation review concerns by keeping N/P/K based on formula percentage times kg/rai application rate.
- Fixed collectable straw so it cannot exceed surplus straw availability or exceed 100% collection.
- Fixed condition linkage so sale price is not incorrectly driven by farm conditions except quality/moisture-related adjustments.
- Fixed scenario preset active-state visibility and clear-condition behavior.
- Fixed duplicate irrigated/AWD farm preset.
- Fixed UI regressions from prior simplification experiments by reverting rejected layout changes.

### Removed

- Removed the auto recommendation panel from the left control panel while keeping underlying planning logic where needed.
- Removed the farmer profile panel from the left control panel while keeping cost-base assumptions behind the goal wizard.
- Removed the field-style header toggle and kept the primary dense rice-clump view.
- Removed the guide button from the header while keeping first-run onboarding.
- Removed the rejected simple/advanced view mode after review.

### Tooling

- Added `eslint.config.js` using ESLint flat config for React and hooks.
- Added `.prettierrc.json`.
- Added an `esbuild` override to resolve the low-severity development-server audit advisory.
- Verified current quality gate:
  - `npm run format:check`
  - `npm run check`
  - `npm audit --audit-level=low`
