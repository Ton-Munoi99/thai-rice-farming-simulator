# Simple / Advanced Mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a presentation-only Simple / Advanced display mode so the simulator opens in a simpler farmer-facing view while preserving the current detailed dashboard in Advanced mode.

**Architecture:** Store `viewMode` at the app UI layer and pass it into layout, left controls, and right score panel. Reuse existing simulation state and components; add compact presentation components only where the current dense panels are too noisy for Simple mode. Advanced mode should render the existing layout as it does today.

**Tech Stack:** React, Vite, Tailwind CSS utility classes, existing Node test runner, Playwright/Chrome smoke testing via `node_repl`.

---

## File Structure

- Modify `src/App.jsx`
  - Own `viewMode` state.
  - Persist mode in localStorage.
  - Pass `viewMode` and `onViewMode` into child components.

- Modify `src/components/AppLayout.jsx`
  - Add a header segmented toggle for Simple / Advanced.
  - Keep existing language/export/method/guide controls.

- Modify `src/components/PresetLibrary.jsx`
  - Add a `compact` prop.
  - In compact mode, show only quick scenario presets and a collapsed advanced presets area.
  - In full mode, preserve the current Scenario / Farm / Survival tabs.

- Modify `src/components/ControlPanel.jsx`
  - Accept `viewMode`.
  - In Simple mode, show rice variety, compact preset library, and condition controls only.
  - In Advanced mode, preserve current detailed rendering.

- Modify `src/components/ScorePanel.jsx`
  - Accept `viewMode`.
  - Add a Simple summary view using existing model, risk contribution, recommendations, and best survival plan.
  - In Advanced mode, preserve current detailed rendering.

- Modify `src/i18n.js`
  - Add labels for mode toggle and Simple summary sections.

- Test `tests/simulation.test.js`
  - Keep existing model tests. This change is presentation-only, so no new simulation unit test is required.

---

### Task 1: App-Level View Mode State

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add localStorage key**

Add this constant near the existing onboarding key:

```jsx
const VIEW_MODE_KEY = "rice-simulator-view-mode-v1";
```

- [ ] **Step 2: Add view mode state**

Inside `App`, after modal state declarations, add:

```jsx
const [viewMode, setViewMode] = useState(() => {
  if (typeof window === "undefined") return "simple";
  const stored = window.localStorage.getItem(VIEW_MODE_KEY);
  return stored === "advanced" ? "advanced" : "simple";
});
```

- [ ] **Step 3: Add view mode setter**

Add this callback below `closeOnboarding`:

```jsx
const changeViewMode = useCallback((mode) => {
  const nextMode = mode === "advanced" ? "advanced" : "simple";
  if (typeof window !== "undefined") {
    window.localStorage.setItem(VIEW_MODE_KEY, nextMode);
  }
  setViewMode(nextMode);
}, []);
```

- [ ] **Step 4: Pass mode into layout and panels**

Update `AppLayout` props:

```jsx
viewMode={viewMode}
onViewMode={changeViewMode}
```

Update `ControlPanel`:

```jsx
<ControlPanel simulation={simulation} mobileActive={mobileTab === "controls"} viewMode={viewMode} />
```

Update `ScorePanel`:

```jsx
<ScorePanel
  simulation={simulation}
  mobileActive={mobileTab === "results" || mobileTab === "plans"}
  mobileMode={mobileTab}
  viewMode={viewMode}
/>
```

- [ ] **Step 5: Run build check**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

### Task 2: Header Mode Toggle

**Files:**
- Modify: `src/components/AppLayout.jsx`
- Modify: `src/i18n.js`

- [ ] **Step 1: Add i18n labels**

Add these keys to `TEXT` in `src/i18n.js` near existing header labels:

```js
viewMode: { en: "View mode", th: "โหมดการแสดงผล" },
simpleMode: { en: "Simple", th: "ง่าย" },
advancedMode: { en: "Advanced", th: "ละเอียด" },
```

- [ ] **Step 2: Accept view mode props**

Add props in `AppLayout`:

```jsx
viewMode,
onViewMode,
```

- [ ] **Step 3: Add segmented toggle**

Add this before the language button in the header actions:

```jsx
<div className="hidden rounded-lg bg-white/10 p-1 sm:flex" aria-label={t(language, "viewMode")}>
  <ModeButton active={viewMode === "simple"} onClick={() => onViewMode("simple")}>
    {t(language, "simpleMode")}
  </ModeButton>
  <ModeButton active={viewMode === "advanced"} onClick={() => onViewMode("advanced")}>
    {t(language, "advancedMode")}
  </ModeButton>
</div>
```

- [ ] **Step 4: Add mobile-friendly mode button**

Add this next to the hidden segmented toggle so narrow screens can still switch:

```jsx
<button
  type="button"
  onClick={() => onViewMode(viewMode === "simple" ? "advanced" : "simple")}
  className="whitespace-nowrap rounded-lg bg-white/10 px-3 py-[7px] text-[12px] font-semibold text-white transition hover:bg-white/20 sm:hidden"
  aria-label={t(language, "viewMode")}
>
  {viewMode === "simple" ? t(language, "simpleMode") : t(language, "advancedMode")}
</button>
```

- [ ] **Step 5: Add ModeButton helper**

Add below `HeaderActionButton`:

```jsx
function ModeButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-[11px] py-[5px] text-[11.5px] font-semibold transition ${
        active ? "bg-[#fffdf7] text-rice-dark" : "bg-transparent text-white/75 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 6: Run build check**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

### Task 3: Compact Preset Library

**Files:**
- Modify: `src/components/PresetLibrary.jsx`
- Modify: `src/i18n.js`

- [ ] **Step 1: Add i18n labels**

Add these keys to `TEXT`:

```js
quickScenarios: { en: "Quick scenarios", th: "สถานการณ์เร็ว" },
quickScenariosSub: {
  en: "Start with one common case, then adjust water, soil, pests, weather, and timing.",
  th: "เริ่มจากสถานการณ์ที่พบบ่อย แล้วค่อยปรับน้ำ ดิน โรคแมลง อากาศ และเวลา",
},
advancedPresets: { en: "More presets", th: "ตัวเลือกละเอียด" },
```

- [ ] **Step 2: Accept compact prop**

Change the function signature:

```jsx
export default function PresetLibrary({ compact = false, simulation }) {
```

- [ ] **Step 3: Add compact branch before the current return**

Insert before the existing full return:

```jsx
if (compact) {
  return (
    <section className="rounded-lg border border-[#d8ddd2] bg-[#fbfaf6] px-3.5 py-[13px]">
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <div>
          <div className="text-[12.5px] font-bold text-rice-dark">{t(language, "quickScenarios")}</div>
          <div className="text-[10px] leading-snug text-rice-faint">{t(language, "quickScenariosSub")}</div>
        </div>
        <button
          type="button"
          onClick={simulation.resetConditions}
          className="flex-none rounded-md border border-[#d8ddd2] bg-white px-2 py-1 text-[9.5px] font-bold text-rice-muted transition hover:border-[#b7c9b0] hover:bg-[#f7faf4] hover:text-rice-dark"
        >
          {t(language, "clearConditions")}
        </button>
      </div>
      <ScenarioGrid simulation={simulation} />
      <details className="mt-2 rounded-lg border border-[#e5e1d4] bg-white/70 px-2.5 py-2">
        <summary className="cursor-pointer list-none text-[10.5px] font-bold text-[#3c473a]">
          <span>{t(language, "advancedPresets")}</span>
          <span className="float-right text-[9px] text-rice-faint">▾</span>
        </summary>
        <div className="mt-2 border-t border-[#ebe7dd] pt-2">
          <div className="mb-2 grid grid-cols-2 rounded-lg bg-[#ece8dc] p-1">
            {DETAIL_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-md px-1.5 py-1.5 text-[9.5px] font-bold transition ${
                  activeTab === tab.key ? "bg-white text-rice-dark shadow-sm" : "text-[#7c8378] hover:text-rice-dark"
                }`}
              >
                {t(language, tab.labelKey)}
              </button>
            ))}
          </div>
          {activeTab === "farm" ? <FarmGrid simulation={simulation} /> : null}
          {activeTab === "survival" ? <SurvivalGrid simulation={simulation} /> : null}
        </div>
      </details>
    </section>
  );
}
```

- [ ] **Step 4: Add DETAIL_TABS constant**

Add after `TABS`:

```jsx
const DETAIL_TABS = [
  { key: "farm", labelKey: "farmSystemTab" },
  { key: "survival", labelKey: "survivalTab" },
];
```

- [ ] **Step 5: Run build check**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

### Task 4: Left Panel Simple Mode

**Files:**
- Modify: `src/components/ControlPanel.jsx`
- Modify: `src/i18n.js`

- [ ] **Step 1: Add i18n labels**

Add:

```js
importantConditions: { en: "Important conditions", th: "เงื่อนไขสำคัญ" },
advancedControls: { en: "Advanced controls", th: "ปรับละเอียด" },
```

- [ ] **Step 2: Accept view mode prop**

Change signature:

```jsx
export default function ControlPanel({ mobileActive = true, simulation, viewMode = "advanced" }) {
```

- [ ] **Step 3: Use compact preset library in Simple mode**

Change:

```jsx
<PresetLibrary simulation={simulation} />
```

to:

```jsx
<PresetLibrary compact={viewMode === "simple"} simulation={simulation} />
```

- [ ] **Step 4: Show detailed controls only in Advanced mode**

Wrap these existing blocks:

```jsx
<FarmerProfilePanel simulation={simulation} />
<div className="mb-2 mt-4 control-heading">{t(language, "manualControls")}</div>
<AutoRecommendationPanel ... />
<FertilizerProgram ... />
```

with:

```jsx
{viewMode === "advanced" ? (
  <>
    <FarmerProfilePanel simulation={simulation} />
    <div className="mb-2 mt-4 control-heading">{t(language, "manualControls")}</div>
    <AutoRecommendationPanel
      active={simulation.activeAutoRecommendation}
      language={language}
      recommendation={simulation.autoRecommendation}
      onApply={simulation.applyAutoRecommendation}
    />
    <FertilizerProgram
      language={language}
      applications={inputs.applications}
      stages={simulation.fertilizerStages}
      formulaOptions={formulaOptions}
      nutrientTotals={nutrientTotals}
      nutrientTargets={{
        N: simulation.varietyInfo.idealN,
        P: simulation.varietyInfo.idealP,
        K: simulation.varietyInfo.idealK,
      }}
      onChange={setApplication}
    />
  </>
) : null}
```

- [ ] **Step 5: Rename Simple heading**

Change the heading before condition controls to:

```jsx
<div className="mb-2 mt-4 control-heading">
  {viewMode === "simple" ? t(language, "importantConditions") : t(language, "manualControls")}
</div>
```

- [ ] **Step 6: Run build check**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

### Task 5: Right Panel Simple Summary

**Files:**
- Modify: `src/components/ScorePanel.jsx`
- Modify: `src/i18n.js`

- [ ] **Step 1: Add i18n labels**

Add:

```js
simpleResult: { en: "Result", th: "สรุปผล" },
mainCauses: { en: "Main causes", th: "สาเหตุหลัก" },
bestPath: { en: "Best path", th: "ทางเลือกที่ดีที่สุด" },
details: { en: "Details", th: "รายละเอียด" },
```

- [ ] **Step 2: Import risk contribution engine**

At top of `ScorePanel.jsx`, add:

```jsx
import { buildRiskContributions } from "../simulation/RiskContributionEngine.js";
```

- [ ] **Step 3: Accept view mode prop**

Change signature:

```jsx
export default function ScorePanel({ mobileActive = true, mobileMode = null, simulation, viewMode = "advanced" }) {
```

- [ ] **Step 4: Derive simple data**

Inside `ScorePanel`, after `totals`, add:

```jsx
const riskContributions = buildRiskContributions(model, language);
const topPlan = simulation.survivalPlans[0];
```

- [ ] **Step 5: Add Simple branch before current return**

Insert:

```jsx
if (viewMode === "simple") {
  return (
    <aside
      className={`${mobileActive ? "flex" : "hidden"} fixed bottom-[66px] right-3 top-[70px] z-40 w-[min(300px,calc(100vw-24px))] flex-none flex-col overflow-y-auto border border-rice-border bg-rice-panel shadow-float lg:static lg:z-auto lg:flex lg:w-[296px] lg:border-y-0 lg:border-r-0 lg:shadow-none`}
    >
      <div className="px-[17px] py-4">
        <SimpleResultCard farmSize={simulation.farmSize} language={language} model={model} totals={totals} />
        <section className="mt-3 rounded-lg border border-rice-card bg-white px-3 py-3">
          <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "mainCauses")}</div>
          <div className="mt-2 space-y-1.5">
            {riskContributions.slice(0, 3).map((item) => (
              <SimpleCause key={item.key} item={item} language={language} />
            ))}
          </div>
        </section>
        <section className="mt-3 rounded-lg border border-rice-card bg-white px-3 py-3">
          <div className="text-[11px] font-bold text-[#3c473a]">{t(language, "recommendedActions")}</div>
          <div className="mt-2 space-y-1.5">
            {model.recommendedActions.slice(0, 3).map((action) => (
              <div key={action.en} className="rounded-md bg-[#f4faf2] px-2.5 py-2 text-[9.5px] leading-snug text-[#3c473a]">
                {pickLang(language, action.en, action.th)}
              </div>
            ))}
          </div>
        </section>
        {topPlan ? (
          <section className="mt-3 rounded-lg border border-[#d7e8cf] bg-[#f4faf2] px-3 py-3">
            <div className="text-[11px] font-bold text-[#2f6b48]">{t(language, "bestPath")}</div>
            <div className="mt-1 text-[10px] font-bold text-[#3c473a]">
              {topPlan.icon} {pickLang(language, topPlan.label, topPlan.labelTh)}
            </div>
            <div className="mt-1 text-[9px] leading-snug text-rice-faint">
              {t(language, "profitPerRai")}: {signedBaht(topPlan.model.profitPerRai)}
            </div>
          </section>
        ) : null}
        <GroupDetails title={t(language, "details")}>
          <FinancialRiskCard language={language} model={model} />
          <RiskContributionPanel language={language} model={model} />
          <FarmTotalsCard language={language} farmSize={simulation.farmSize} totals={totals} />
        </GroupDetails>
      </div>
    </aside>
  );
}
```

- [ ] **Step 6: Add helper components**

Add before `GroupDetails`:

```jsx
function SimpleResultCard({ farmSize, language, model, totals }) {
  const profitPositive = model.profitPerRai >= 0;
  const statusKey = model.profitPerRai >= 800 ? "reportGo" : profitPositive ? "reportWatch" : "reportStop";

  return (
    <section className={`rounded-lg border px-3 py-3 ${profitPositive ? "border-[#d7e8cf] bg-[#f4faf2]" : "border-[#ead5cd] bg-[#fff5f0]"}`}>
      <div className="text-[10px] font-bold uppercase tracking-[.04em] text-rice-faint">{t(language, "simpleResult")}</div>
      <div className={`mt-1 font-display text-[23px] font-bold leading-none ${profitPositive ? "text-[#2f6b48]" : "text-[#a24b2b]"}`}>
        {t(language, statusKey)}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <SimpleMetric label={profitPositive ? t(language, "profit") : t(language, "loss")} value={`${signedBaht(model.profitPerRai)}/${t(language, "rai")}`} danger={!profitPositive} />
        <SimpleMetric label={t(language, "totalProfit")} value={signedBaht(totals.profit)} danger={totals.profit < 0} />
        <SimpleMetric label={t(language, "estimatedYield")} value={`${formatNumber(model.estimatedYieldKgPerRai)} kg`} />
        <SimpleMetric label={t(language, "productionCost")} value={`฿${formatNumber(model.costPerRai)}`} />
      </div>
      <div className="mt-2 text-[9px] leading-snug text-rice-faint">
        {farmSize} {t(language, "rai")} · {t(language, "revenue")} ฿{formatNumber(model.revenuePerRai)}/{t(language, "rai")}
      </div>
    </section>
  );
}

function SimpleMetric({ danger = false, label, value }) {
  return (
    <div className="rounded-md bg-white/80 px-2 py-1.5">
      <div className="truncate text-[8.5px] text-rice-faint">{label}</div>
      <div className={`font-display text-[12px] font-bold ${danger ? "text-[#a24b2b]" : "text-[#2f3b34]"}`}>{value}</div>
    </div>
  );
}

function SimpleCause({ item, language }) {
  const tone = item.tone === "danger" ? "text-[#a24b2b]" : item.tone === "good" ? "text-[#2f6b48]" : "text-[#8a641c]";

  return (
    <div className="rounded-md bg-[#fbfaf6] px-2.5 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 truncate text-[9.5px] font-bold text-[#3c473a]">
          {item.icon} {pickLang(language, item.label, item.labelTh)}
        </div>
        <div className={`font-display text-[10.5px] font-bold ${tone}`}>{item.percent}%</div>
      </div>
      <div className="mt-1 text-[8.5px] leading-snug text-rice-faint">
        {pickLang(language, item.action, item.actionTh)}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Run build check**

Run:

```bash
npm run build
```

Expected: build succeeds.

---

### Task 6: Browser Smoke Tests

**Files:**
- No source modifications unless defects are found.

- [ ] **Step 1: Start dev server**

Run:

```bash
npm run dev -- --host 127.0.0.1
```

Expected: Vite reports a local URL on port `5173`.

- [ ] **Step 2: Desktop smoke test**

Use Playwright with local Chrome. Verify:

- Page loads.
- Header toggle starts in Simple mode after clearing localStorage.
- Simple mode hides `Farmer profile` and shows `Result` / `Main causes`.
- Clicking `Advanced` shows `Farmer profile`, `Fertilizer program`, and detailed score groups.
- Console has no errors.

- [ ] **Step 3: Mobile smoke test**

Use viewport `390x844`. Verify:

- Bottom tab `Inputs` shows simplified inputs in Simple mode.
- Bottom tab `Results` shows simplified summary in Simple mode.
- Toggle to Advanced and verify detailed panels are available.
- Console has no errors.

- [ ] **Step 4: Stop dev server**

Send Ctrl-C to the Vite process.

---

### Task 7: Final Verification, Commit, Push, Deploy

**Files:**
- All modified files from previous tasks.

- [ ] **Step 1: Run final tests**

Run:

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 2: Run final build**

Run:

```bash
npm run build
```

Expected: Vite build succeeds.

- [ ] **Step 3: Check whitespace**

Run:

```bash
git diff --check
```

Expected: no output.

- [ ] **Step 4: Commit implementation**

Run:

```bash
git add src/App.jsx src/components/AppLayout.jsx src/components/PresetLibrary.jsx src/components/ControlPanel.jsx src/components/ScorePanel.jsx src/i18n.js
git commit -m "Add simple advanced view mode"
```

Expected: commit succeeds.

- [ ] **Step 5: Push**

Run:

```bash
git push origin main
```

Expected: push succeeds.

- [ ] **Step 6: Deploy**

Run:

```bash
npx netlify deploy --prod
```

Expected: deploy is live at `https://thai-rice-farming-simulator.netlify.app`.

- [ ] **Step 7: Verify production URL**

Run:

```bash
curl -I --max-time 10 https://thai-rice-farming-simulator.netlify.app/
```

Expected: HTTP 200.
