import React, { useMemo, useState } from 'react';
import { Activity, Globe, Radio, Zap } from 'lucide-react';
import TetryonMap from './components/TetryonMap';
import './index.css';

const LAYER_DEFINITIONS = [
  {
    key: 'forces',
    label: 'Prime Force Field',
    description: 'Visualizes vector interactions between nearby tetryon nodes.',
    icon: Zap,
  },
  {
    key: 'resonance',
    label: 'Resonance Topography',
    description: 'Highlights node resonance intensity across the local mesh.',
    icon: Activity,
  },
  {
    key: 'celestial',
    label: 'Celestial Overlay',
    description: 'Projects a harmonic hex-grid aligned to the current viewport.',
    icon: Radio,
  },
];

function App() {
  const [activeLayers, setActiveLayers] = useState({
    resonance: true,
    forces: true,
    celestial: false,
  });
  const [mode, setMode] = useState('observer');
  const [meshStats, setMeshStats] = useState({ nodeCount: 0, connectionCount: 0, orbitCount: 0 });

  const statusText = useMemo(() => {
    if (mode === 'navigator') {
      return 'Navigator mode is active. Drop three pins on the map to calculate orbit paths.';
    }

    return 'Observer mode is active. Pan the map to regenerate the tetryon mesh around the viewport.';
  }, [mode]);

  const toggleLayer = (key) => {
    setActiveLayers((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  };

  return (
    <div className="app-shell">
      <div className="map-region" aria-label="Tetryon map region">
        <TetryonMap activeLayers={activeLayers} mode={mode} onStatsChange={setMeshStats} />
      </div>

      <aside className="control-panel" aria-label="Tetryon controls">
        <div className="panel-header">
          <div className="panel-header__icon">
            <Globe size={18} />
          </div>
          <div>
            <p className="eyebrow">Tetryon Mesh Console</p>
            <h1>Tetryon Map Visualizer</h1>
          </div>
        </div>

        <section className="panel-section">
          <h2>Display Layers</h2>
          <div className="layer-list">
            {LAYER_DEFINITIONS.map(({ key, label, description, icon: Icon }) => (
              <button
                key={key}
                type="button"
                className={`layer-toggle ${activeLayers[key] ? 'is-active' : ''}`}
                onClick={() => toggleLayer(key)}
                aria-pressed={activeLayers[key]}
              >
                <span className="layer-toggle__icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className="layer-toggle__body">
                  <span className="layer-toggle__label">{label}</span>
                  <span className="layer-toggle__description">{description}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel-section">
          <h2>Navigation Mode</h2>
          <button
            type="button"
            className={`mode-toggle ${mode === 'navigator' ? 'is-active' : ''}`}
            onClick={() => setMode((current) => (current === 'observer' ? 'navigator' : 'observer'))}
          >
            <span className="mode-toggle__title">
              {mode === 'navigator' ? 'Three-Body Navigator Enabled' : 'Observer Mode Enabled'}
            </span>
            <span className="mode-toggle__description">{statusText}</span>
          </button>
        </section>

        <section className="panel-section">
          <h2>System Status</h2>
          <dl className="status-grid">
            <div>
              <dt>Nodes</dt>
              <dd>{meshStats.nodeCount}</dd>
            </div>
            <div>
              <dt>Connections</dt>
              <dd>{meshStats.connectionCount}</dd>
            </div>
            <div>
              <dt>Orbits</dt>
              <dd>{meshStats.orbitCount}</dd>
            </div>
            <div>
              <dt>Build</dt>
              <dd>v1.0.0</dd>
            </div>
          </dl>
        </section>
      </aside>
    </div>
  );
}

export default App;
