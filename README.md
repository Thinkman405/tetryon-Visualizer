# Tetryon Map Visualizer

A production-ready Vite + React + Leaflet visualization for exploring a synthetic tetryon mesh, resonance overlays, and a three-body navigator.

## Repository layout

- App source: `ghost_terminal/src`
- App docs: `ghost_terminal/README.md`
- Netlify config: `ghost_terminal/netlify.toml`

## Features

- Responsive control panel and map layout for desktop and mobile.
- Deterministic mock mesh generation for demos and QA.
- Layer toggles for force lines, resonance view, and celestial overlays.
- Three-body navigator mode with orbit-path visualization.
- Deployment support for Netlify and Docker/Nginx.

## Local development

```bash
cd ghost_terminal
npm install
npm run dev
```

The Vite dev server binds to `0.0.0.0:4173`.

## Production build

```bash
cd ghost_terminal
npm run build
npm run preview
```

## Architecture

- `src/App.jsx`: main application shell and operator controls.
- `src/components/TetryonMap.jsx`: Leaflet rendering, overlays, and navigator interactions.
- `src/lib/TCIEngine.js`: mesh generation and orbit-path calculations.
- `src/lib/TetryonGeometry.js`: tetryon geometry primitives.
