# Thai Wet-Season Rice Simulator Methodology

This document explains the current planning model. It is designed for decision support, not for certified agronomic forecasting.

## 1. Inputs

The simulator starts from user-adjustable field and finance inputs:

- Rice variety: white rice or Hom Mali.
- Fertilizer program: formula and rate by growth stage.
- Water: rainfed, AWD, or continuous flooding.
- Groundwater availability.
- Soil quality.
- Pest, disease, and weed pressure.
- Weather scenario and management timing.
- Paddy price, straw price, farm size, and per-rai cost items.

## 2. Yield Estimate

Yield is calculated inside the Rice Simulation model, not imported from rice-map.

```text
estimated yield kg/rai = variety potential x (growth score / 100)^1.25
```

The growth score is built from linked sub-scores:

- Fertilizer efficiency.
- Water adequacy.
- Soil health.
- Pest, disease, and weed pressure.
- Weather score.
- Management timing score.

This means field conditions change yield first, then yield affects rice revenue and straw availability.

## 3. Price Handling

Paddy price is treated as an external market input. The simulator does not forecast demand, supply, India export policy, or global competition.

The model only applies a quality/moisture revenue factor when wet or flood harvest conditions reduce saleable value.

Defaults:

- White rice: 8,000 baht/ton.
- Hom Mali: 18,000 baht/ton.

## 4. Cost Model

Costs are calculated per rai and then multiplied by farm size.

Cost items:

- Seed.
- Fertilizer.
- Chemicals/IPM.
- Labor and machinery.
- Land rent.
- Fuel.
- Transport/other.

Field conditions can change cost automatically. Examples:

- Pest, disease, and weed pressure increase chemical/IPM cost.
- Water stress or pumping conditions can affect fuel/labor assumptions.
- Flood or difficult harvest conditions can increase transport/other costs.
- Preset scenarios and farmer profiles set linked default costs.

The user can still override every cost item manually.

Default total costs:

- White rice: 6,100 baht/rai.
- Hom Mali: 5,100 baht/rai.

## 5. Straw Revenue

The straw layer adapts the rice-map idea:

```text
total straw = paddy yield x RPR 1.169
surplus straw = total straw x SAF 0.583
collectable straw = surplus straw x harvest-condition factor
```

Collectable straw is capped so it cannot exceed surplus straw or 100 percent collectability.

Default net straw price received by farmer:

```text
0.75 baht/kg
```

Suggested farmer-level ranges:

- 0.25-0.45 baht/kg: farm-lot sale or buyer collects.
- 0.60-0.90 baht/kg: farmer pays baling cost and sells normally.
- 0.90-1.20 baht/kg: group sale, direct sale, or good local market.
- 1.50+ baht/kg: downstream/end-market price, not recommended as farmer default.

## 6. Finance

Per-rai formulas:

```text
rice revenue = estimated yield kg/rai / 1000 x paddy price
straw revenue = collectable straw kg/rai x net straw price
total revenue = rice revenue + straw revenue
profit/loss = total revenue - cost per rai
```

Whole-farm totals:

```text
whole-farm value = per-rai value x farm size in rai
```

Debt/cashflow is a rough planning layer. It currently assumes a six-month working-capital loan at 6 percent annual interest.

## 7. Carbon

Carbon is shown as a separate optional estimate, especially for AWD compared with continuous flooding. It is not counted as farmer income unless a real project contract exists.

## 8. Calibration

The app includes low-confidence calibration anchors to compare model output with practical reference cases. These anchors are placeholders for future replacement by:

- Farm accounting records.
- Official survey tables.
- Local field trial data.
- Farmer profile data.

## 9. Data Quality Badges

- High: clear formula, user-entered value, or source-backed layer.
- Medium: simulator estimate from linked assumptions and mock defaults.
- Low: rough scenario placeholder; should be replaced by local data.

## 10. Main References Used In The Current Model

- Rice-map straw structure and RPR/SAF concept: https://ton-munoi99.github.io/rice-map/
- OAE / Regional Office 4 straw value context.
- OPS MOAC Roi Et straw buying and bale-price context.
- OCSC policy-study straw scenario context.
- TGO Premium T-VER AWD project context.

Future phases should replace mock anchors with official datasets, farm profiles, API data, and database-backed scenario records.
