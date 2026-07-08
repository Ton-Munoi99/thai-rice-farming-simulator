# Thai Wet-Season Rice Simulator

Interactive front-end simulator for Thai wet-season rice farming. The app lets users adjust rice variety, soil, water, pest and disease pressure, weed pressure, weather, fertilizer program, chemical/IPM assumptions, and production costs to compare likely yield, revenue, profit, and risk per rai.

This phase is a client-side prototype: React UI, mock agronomic assumptions, no backend, no database, and no login.

Live demo: https://thai-rice-farming-simulator.netlify.app

Source code: https://github.com/Ton-Munoi99/thai-rice-farming-simulator

## Features

- Scenario presets for normal, drought, flood, pest outbreak, excess fertilizer, and farm system defaults.
- Auto recommendation mode for fertilizer split, chemical/IPM rounds, and default costs.
- Linked simulation logic: pest, disease, weed, water, soil, weather, timing, fertilizer, and costs affect each other.
- Editable cost model for seed, fertilizer, chemicals, labor and machinery, rent, fuel, transport, and total override.
- Rice field animation that changes between excellent, good, moderate, and poor crop conditions.
- Scenario comparison slots for A/B/C decisions across yield, cost, revenue, profit, and risk.
- Bilingual Thai/English labels for farmer-friendly exploration.

## Tech Stack

- React
- Vite
- Tailwind CSS
- CSS animation

## Local Development

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Production Build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Netlify

Netlify uses the settings in `netlify.toml`:

- Build command: `npm run build`
- Publish directory: `dist`

## Data And Model Notes

The simulator currently uses mock formulas and calibrated assumptions intended for planning UX and early validation. It is not an official agronomic recommendation engine.

Reference sources used during prototype assumptions include:

- Thai Rice Knowledge Bank, Rice Department: https://rkb.ricethailand.go.th/
- Department of Agricultural Extension rice pest and disease materials: https://esc.doae.go.th/
- Ministry of Agriculture and Cooperatives public rice and weed management communications: https://www.moac.go.th/

For real farm decisions, follow official local recommendations, product labels, soil-test results, and advice from qualified agricultural officers.

## Future Phases

- Replace mock assumptions with province-specific agronomic formulas.
- Import current fertilizer, chemical, fuel, paddy price, and weather data from APIs.
- Add farmer profiles, saved fields, and seasonal planning history.
- Add backend persistence and database integration.
- Add verified Thai-language guidance per variety, ecosystem, and region.

## License

MIT
