# North Wales Police — Forward Deployment Optimisation

Interactive 15-slide presentation in the Quantum Dice visual style. It implements the corrected narrative and metrics from the NWP FDO slide creation guide.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Forward deployment interface prototype

Open [http://localhost:3000/operations](http://localhost:3000/operations) for the
interactive operations workspace. It follows the demonstrator's Quantum Dice
branding, typography and vehicle-state colours and reuses its 28 ward boundaries,
five station locations and selected SC01 work/rest schedule.

For a video walkthrough:

1. Start on the 10:00 snapshot and review the three proposed moves.
2. Toggle demand/coverage on the map, select a unit, or inspect a ward. Open the
   Fleet tab (or the selected-unit button under the map) to manage individual units.
3. Exclude an individual move or hold an available unit's current position and
   regenerate the plan.
4. Approve the moves and open the decision log.
5. Select another hour or a demand/availability scenario and generate a fresh plan.
6. Use Reset demo in the header to repeat the scene.

The shift timeline can play automatically, and fullscreen is available in the
header. The decision log exports a JSON scenario snapshot. State stays in browser
memory and resets on reload. On narrow screens, the workspace scrolls vertically.

This is an interface prototype: vehicle positions, busy states, demand changes and
recommendations are illustrative. Travel is estimated from ward-centre distances;
the metrics are calculated from these estimates and are not benchmark results.
Recommendations use a deterministic local heuristic, cap relocation estimates at
30 minutes, and exclude busy, resting and held units. No solver, dispatch system or
live police data is connected. Approval applies the proposed final positions
immediately within the scenario, without simulating travel downtime.

## Standalone HTML prototype

Open `exports/nwp-forward-deployment.html` directly in a browser. This single file
embeds the fonts, logos, ward data, styling and JavaScript, so it works offline
without installing Node.js or running a server. It uses larger, bolder text and a
two-panel overview focused on the map and deployment plan. Fleet management has a
dedicated tab; detailed checks and model notes expand when needed. The interactive
map, scenarios, schedule, unit holds, plan approval, decision log, JSON export,
playback and fullscreen controls remain available.

To regenerate the HTML after editing the prototype:

```bash
npm run build
npm run export:html
```

The exporter reuses the interface components and production runtime. It does not
rebuild a separate copy of the interface. State remains local to the open file and
resets when the page reloads. The prototype data and travel estimates remain
illustrative.

## Export PDF decks

Chrome or Chromium must be installed. Export both the 22-slide full deck and
the 9-slide showcase deck with:

```bash
npm run export:pdf
```

The PDFs are written to `exports/nwp-full-deck.pdf` and
`exports/nwp-showcase-deck.pdf`. To export only one deck:

```bash
npm run export:pdf:full
npm run export:pdf:showcase
```

Slides are captured at 150% browser zoom; content outside the visible 16:9
viewport is cropped. Animated maps are captured as static frames at export time.

## Controls

- Arrow keys or space: move through slides
- Home / End: jump to first / last slide
- `N`: toggle speaker notes
- Navigation bars: click any slide directly

## Verification

```bash
npm run lint
npm run build
```

All visuals are native HTML/CSS/SVG and scale to the browser viewport. The map is deliberately stylised; it communicates ward/station/vehicle state relationships without presenting itself as an operational GIS output.
