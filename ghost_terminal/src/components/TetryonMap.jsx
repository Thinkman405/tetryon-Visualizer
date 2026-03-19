import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CircleMarker,
  MapContainer,
  Polygon,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TCIEngine } from '../lib/TCIEngine';

const INITIAL_CENTER = [37.7749, -122.4194];
const engine = new TCIEngine();

const MapController = ({ mode, onMeshState, onPinDrop }) => {
  const map = useMapEvents({
    moveend: () => {
      if (mode === 'navigator') {
        return;
      }

      const center = map.getCenter();
      engine.generateMockNodes(center.lat, center.lng, 18);
      onMeshState(engine.getMeshState());
    },
    click: (event) => {
      if (mode === 'navigator') {
        onPinDrop(event.latlng);
      }
    },
  });

  useEffect(() => {
    const center = map.getCenter();
    engine.generateMockNodes(center.lat, center.lng, 18);
    onMeshState(engine.getMeshState());
  }, [map, onMeshState]);

  return null;
};

const CenterTracker = ({ onCenterChange }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onCenterChange([center.lat, center.lng]);
    },
  });

  useEffect(() => {
    const center = map.getCenter();
    onCenterChange([center.lat, center.lng]);
  }, [map, onCenterChange]);

  return null;
};

const ResizeInvalidator = () => {
  const map = useMap();

  useEffect(() => {
    const invalidate = () => map.invalidateSize();
    invalidate();
    window.addEventListener('resize', invalidate);
    return () => window.removeEventListener('resize', invalidate);
  }, [map]);

  return null;
};

const TetryonMap = ({ activeLayers, mode, onStatsChange }) => {
  const [meshState, setMeshState] = useState({ nodes: [], connections: [], orbitPaths: [] });
  const [mapCenter, setMapCenter] = useState(INITIAL_CENTER);
  const [pins, setPins] = useState([]);

  useEffect(() => {
    onStatsChange({
      nodeCount: meshState.nodes.length,
      connectionCount: meshState.connections.length,
      orbitCount: meshState.orbitPaths.length,
    });
  }, [meshState, onStatsChange]);

  useEffect(() => {
    if (mode === 'observer' && pins.length > 0) {
      setPins([]);
      engine.clearOrbitPaths();
      setMeshState(engine.getMeshState());
    }
  }, [mode, pins.length]);

  const handleMeshState = useCallback((nextState) => {
    setMeshState(nextState);
  }, []);

  const handlePinDrop = useCallback(
    (latlng) => {
      setPins((currentPins) => {
        const nextPins = currentPins.length >= 3 ? [latlng] : [...currentPins, latlng];

        if (nextPins.length === 3) {
          engine.solveThreeBody(nextPins);
        } else {
          engine.clearOrbitPaths();
        }

        setMeshState(engine.getMeshState());
        return nextPins;
      });
    },
    [setMeshState],
  );

  const tileUrl = useMemo(
    () =>
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    [],
  );

  return (
    <MapContainer center={INITIAL_CENTER} zoom={5} className="map-canvas" zoomControl>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors &copy; CARTO'
        url={tileUrl}
      />

      <ResizeInvalidator />
      <MapController mode={mode} onMeshState={handleMeshState} onPinDrop={handlePinDrop} />
      <CenterTracker onCenterChange={setMapCenter} />

      {activeLayers.forces &&
        meshState.connections.map((connection) => (
          <ForceLine
            key={connection.id}
            connection={connection}
          />
        ))}

      {activeLayers.celestial && mapCenter && <CelestialOverlay center={mapCenter} />}

      {pins.map((pin, index) => (
        <CircleMarker
          key={`pin-${pin.lat}-${pin.lng}-${index}`}
          center={[pin.lat, pin.lng]}
          radius={6}
          pathOptions={{ color: '#ffd54f', fillColor: '#ffd54f', fillOpacity: 0.85, weight: 2 }}
        >
          <Tooltip direction="top" offset={[0, -6]} opacity={1}>
            Navigator Pin {index + 1}
          </Tooltip>
        </CircleMarker>
      ))}

      {meshState.orbitPaths.map((path, index) => (
        <Polyline
          key={`orbit-${index}`}
          positions={path}
          pathOptions={{ color: '#ffd54f', weight: 2, dashArray: '10 8' }}
        />
      ))}

      {meshState.nodes.map((node) => (
        <CircleMarker
          key={node.id}
          center={[node.displayCoords.lat, node.displayCoords.lng]}
          radius={5}
          pathOptions={{
            color: activeLayers.resonance ? '#ff5c8a' : '#4ef4d2',
            fillColor: activeLayers.resonance ? '#ff5c8a' : '#4ef4d2',
            fillOpacity: activeLayers.resonance ? 0.8 : 0.65,
            weight: 1,
          }}
        >
          <Popup className="tetryon-popup">
            <div className="popup-content">
              <div><strong>ID:</strong> {node.id}</div>
              <div><strong>SIG:</strong> {node.harmonicSignature}</div>
              <div><strong>VAL:</strong> {node.originalValue.toFixed(2)}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
};

const CelestialOverlay = ({ center }) => {
  const radius = 1.1;
  const positions = Array.from({ length: 6 }, (_, index) => {
    const angleRadians = (Math.PI / 3) * index;
    return [
      center[0] + radius * Math.cos(angleRadians),
      center[1] + radius * Math.sin(angleRadians) * 1.25,
    ];
  });

  return (
    <>
      <Polygon
        positions={positions}
        pathOptions={{ color: '#8897ff', weight: 1, dashArray: '4 8', fillOpacity: 0.05, interactive: false }}
      />
      <Polygon
        positions={[positions[0], positions[2], positions[4]]}
        pathOptions={{ color: '#8897ff', weight: 1, fill: false, interactive: false }}
      />
      <Polygon
        positions={[positions[1], positions[3], positions[5]]}
        pathOptions={{ color: '#8897ff', weight: 1, fill: false, interactive: false }}
      />
    </>
  );
};

const ForceLine = ({ connection }) => {
  const positions = [
    [connection.source.displayCoords.lat, connection.source.displayCoords.lng],
    [connection.target.displayCoords.lat, connection.target.displayCoords.lng],
  ];

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: connection.isStressed ? '#ff6b6b' : '#4b8dff',
        weight: connection.isStressed ? 2 : 1,
        opacity: Math.min(connection.force * 8, 0.85),
        dashArray: connection.isStressed ? '6 6' : undefined,
      }}
    />
  );
};

export default TetryonMap;
