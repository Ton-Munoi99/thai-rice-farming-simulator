# Simple / Advanced Mode Design

## Context

The simulator has grown into a capable decision tool, but the current interface exposes too many panels at once. The user wants a cleaner experience without losing the agronomic, financial, and reference layers already built.

A previous attempt simplified the interface globally and was reverted because it removed too much of the original working-tool feel. This design keeps all existing capability and introduces a display-mode layer instead.

## Goal

Add a `Simple / Advanced` mode switch.

- `Simple` is the default for farmers and general users.
- `Advanced` preserves the current detailed dashboard for analysts, advisors, and deeper review.
- No formulas, data models, or major features are removed.

## Non-Goals

- Do not redesign the rice field animation.
- Do not change simulation formulas.
- Do not remove existing panels permanently.
- Do not rebuild the app into a new tabbed product shell.
- Do not alter pricing, cost, straw, carbon, or report calculations.

## Header Behavior

Add a mode toggle near the existing language/export/method controls:

- Thai: `ง่าย / ละเอียด`
- English: `Simple / Advanced`

Default:

- First visit uses `Simple`.
- Store the selected mode in localStorage.
- Returning users see their last selected mode.

State:

- Add `viewMode` to app-level UI state.
- Pass `viewMode` into layout, control panel, and score panel.

## Left Panel: Control Panel

### Simple Mode

Show the minimum controls needed to understand and adjust the simulation:

- Rice variety.
- Quick preset scenarios.
- Water management.
- Soil condition.
- Pest, disease, and weed pressure.
- Weather scenario.
- Management timing.

Hide by default:

- Farmer profile.
- Auto recommendation.
- Fertilizer program.
- Farm-system presets.
- White-rice survival presets.

These hidden controls should still be available through a compact `Advanced controls` accordion or by switching to Advanced mode.

### Advanced Mode

Preserve the current detailed left panel:

- Preset library with Scenario / Farm system / Survival tabs.
- Farmer profile.
- Auto recommendation.
- Fertilizer program.
- All manual condition controls.

## Right Panel: Score Panel

### Simple Mode

Show a short decision summary first:

1. Decision status: viable, watch closely, or needs fixing.
2. Profit/loss per rai and whole-farm total.
3. Key numbers: yield, revenue, cost.
4. Top three causes from the existing risk contribution engine.
5. Top three recommended actions.
6. One clear path forward from the best auto plan.

Use familiar labels:

- `สรุปผล` / `Result`
- `สาเหตุหลัก` / `Main causes`
- `คำแนะนำ` / `Actions`

Avoid showing these in the default Simple right panel:

- Calibration.
- Carbon.
- Scenario history.
- Compare A/B/C.
- Sensitivity table.
- Debt/cashflow.
- Assumptions and source panel.

Provide one collapsed `Details` accordion for users who want more context without switching modes.

### Advanced Mode

Preserve the current detailed right panel:

- Snapshot.
- Finance.
- Yield & risk.
- Edit assumptions.
- Compare & references.
- Carbon.
- Calibration.
- Debt/cashflow.
- Sensitivity.
- Assumptions and sources.

## Mobile Behavior

Keep the existing bottom tabs.

In Simple mode:

- `Field`: field animation and timeline.
- `Inputs`: simplified control panel.
- `Results`: simplified score summary.
- `Plans`: recommended actions and auto plans.
- `Method`: existing methodology modal.

In Advanced mode:

- Bottom tabs expose the same areas, but panels show the full detailed content.

## Component Changes

Likely files:

- `src/App.jsx`
  - Add `viewMode` state with localStorage persistence.
  - Pass mode to children.

- `src/components/AppLayout.jsx`
  - Add header mode toggle.

- `src/components/ControlPanel.jsx`
  - Conditionally render Simple vs Advanced sections.
  - Reuse existing controls, not duplicate simulation state.

- `src/components/PresetLibrary.jsx`
  - Support compact scenario-only rendering for Simple mode.

- `src/components/ScorePanel.jsx`
  - Add a Simple summary view.
  - Keep current view for Advanced mode.

- `src/i18n.js`
  - Add labels for mode toggle and simple summary sections.

## Data Flow

The mode is presentation-only.

It must not change:

- `inputs`.
- `costOverrides`.
- `pricePerTon`.
- `strawPricePerKg`.
- `liveModel`.
- Saved scenarios.
- Compare slots.
- Reports.

## Testing

Automated checks:

- `npm test`
- `npm run build`
- `git diff --check`

Browser smoke tests:

- Header toggle switches between Simple and Advanced.
- Simple left panel shows quick controls and hides detailed fertilizer/profile panels.
- Advanced left panel shows the existing detailed controls.
- Simple right panel shows result, causes, and actions.
- Advanced right panel shows detailed groups.
- Mobile tabs work in both modes.
- No console errors.

## Rollout Notes

This should be implemented as a reversible UI layering change. If Simple mode feels too sparse later, Advanced mode remains unchanged and can guide refinements.
