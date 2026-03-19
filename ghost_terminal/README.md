# Tetryon Map Visualizer

A production-ready Vite + React + Leaflet visualization for exploring a synthetic tetryon mesh, resonance overlays, and a three-body orbit navigator.

## Features

- Responsive map and control panel layout for desktop and mobile.
- Deterministic mesh generation for stable demos and easier QA.
- Layer toggles for force lines, resonance intensity, and celestial overlays.
- Three-body navigation mode that lets users drop three map pins and visualize harmonic orbit paths.
- Production build support with source maps.
- Deployment assets for Netlify and Docker/Nginx.

## Local development

```bash
npm install
npm run dev
```

The Vite dev server binds to `0.0.0.0:4173`.

## Production build

```bash
npm run build
npm run preview
```

## Deploy options

### Netlify

This repo includes `netlify.toml`, so a standard Netlify static-site deployment works with:

- Build command: `npm run build`
- Publish directory: `dist`

### Docker

```bash
docker build -t tetryon-map-visualizer .
docker run --rm -p 8080:80 tetryon-map-visualizer
```

## Architecture

- `src/App.jsx`: main application shell and operator controls.
- `src/components/TetryonMap.jsx`: Leaflet map rendering, overlays, and navigator interactions.
- `src/lib/TCIEngine.js`: mesh generation and orbit-path calculations.
- `src/lib/TetryonGeometry.js`: tetryon geometry primitives.
