import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, useMapEvents, CircleMarker, Polygon, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { TCIEngine } from '../lib/TCIEngine';

const engine = new TCIEngine();

// Component to handle map events and update engine
const MapController = ({ onUpdate, mode, onPinDrop }) => {
    const map = useMapEvents({
        moveend: () => {
            if (mode === 'navigator') return; // Don't regen mocks in navigator mode
            const center = map.getCenter();
            // Generate mock nodes around center for Phase 0
            engine.generateMockNodes(center.lat, center.lng, 20);
            onUpdate(engine.getMeshState());
        },
        click: (e) => {
            if (mode === 'navigator') {
                onPinDrop(e.latlng);
            }
        },
        load: () => {
            // Initial load
            const center = map.getCenter();
            engine.generateMockNodes(center.lat, center.lng, 20);
            onUpdate(engine.getMeshState());
        }
    });

    // Trigger initial update manually on mount
    useEffect(() => {
        const center = map.getCenter();
        engine.generateMockNodes(center.lat, center.lng, 20);
        onUpdate(engine.getMeshState());
    }, [map, onUpdate]);

    return null;
};

// Component to track map center
// Note: We use a separate component to isolate the hook usage
const CenterTracker = ({ onUpdate }) => {
    const map = useMapEvents({
        moveend: () => {
            const center = map.getCenter();
            onUpdate([center.lat, center.lng]);
        },
        load: () => {
            const center = map.getCenter();
            onUpdate([center.lat, center.lng]);
        }
    });

    useEffect(() => {
        if (map) {
            const center = map.getCenter();
            onUpdate([center.lat, center.lng]);
        }
    }, [map, onUpdate]);

    return null;
};

const TetryonMap = ({ activeLayers, mode }) => {
    const [meshState, setMeshState] = useState({ nodes: [], connections: [], orbitPaths: [] });
    const [mapCenter, setMapCenter] = useState(null);
    const [pins, setPins] = useState([]);

    const handlePinDrop = (latlng) => {
        if (pins.length >= 3) {
            setPins([latlng]); // Reset if already 3
            // Clear orbits
            engine.orbitPaths = [];
            setMeshState(engine.getMeshState());
        } else {
            const newPins = [...pins, latlng];
            setPins(newPins);
            if (newPins.length === 3) {
                // Solve
                engine.solveThreeBody(newPins);
                setMeshState(engine.getMeshState());
            }
        }
    };

    return (
        <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            className="w-full h-full bg-black"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            <MapController
                onUpdate={setMeshState}
                mode={mode}
                onPinDrop={handlePinDrop}
            />
            <CenterTracker onUpdate={setMapCenter} />

            {/* Render Prime Force Lines */}
            {activeLayers.forces && meshState.connections.map((conn, idx) => (
                <ForceLine key={`line-${idx}`} connection={conn} />
            ))}

            {/* Celestial Overlay - Hexagon Pattern */}
            {activeLayers.celestial && mapCenter && (
                <CelestialOverlay center={mapCenter} />
            )}

            {/* Navigator Pins */}
            {pins.map((pin, i) => (
                <Marker position={pin} key={`pin-${i}`} />
            ))}

            {/* Three-Body Orbits */}
            {meshState.orbitPaths && meshState.orbitPaths.map((path, i) => (
                <Polyline
                    key={`orbit-${i}`}
                    positions={path}
                    pathOptions={{ color: '#ffcc00', weight: 2, dashArray: '10, 5' }}
                />
            ))}

            {/* Render Nodes */}
            {meshState.nodes.map((node) => (
                <CircleMarker
                    key={node.id}
                    center={[node.displayCoords.lat, node.displayCoords.lng]}
                    radius={4}
                    pathOptions={{
                        color: activeLayers.resonance ? '#ff0055' : '#00ffcc',
                        fillColor: activeLayers.resonance ? '#ff0055' : '#00ffcc',
                        fillOpacity: 0.6,
                        weight: 1
                    }}
                >
                    <Popup className="tetryon-popup">
                        <div className="text-xs font-mono">
                            <div>ID: {node.id}</div>
                            <div>SIG: {node.harmonicSignature}</div>
                            <div>VAL: {node.originalValue}</div>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
};

/* Celestial Overlay Component */
const CelestialOverlay = ({ center }) => {
    if (!center) return null;
    // Create a hexagon around the center (approx 0.02 deg radius)
    const radius = 0.02;
    const positions = [];
    for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i;
        const angle_rad = Math.PI / 180 * angle_deg;
        positions.push([
            center[0] + radius * Math.cos(angle_rad),
            center[1] + radius * Math.sin(angle_rad) * 1.5 // Adjust for aspect ratio roughly
        ]);
    }

    return (
        <>
            <Polygon
                positions={positions}
                pathOptions={{ color: '#a0a0ff', weight: 1, dashArray: '4, 8', fillOpacity: 0.05, interactive: false }}
            />
            {/* Inner Triangle */}
            <Polygon
                positions={[positions[0], positions[2], positions[4]]}
                pathOptions={{ color: '#a0a0ff', weight: 0.5, fill: false, interactive: false }}
            />
            {/* Inverse Triangle */}
            <Polygon
                positions={[positions[1], positions[3], positions[5]]}
                pathOptions={{ color: '#a0a0ff', weight: 0.5, fill: false, interactive: false }}
            />
        </>
    );
};

const ForceLine = ({ connection }) => {
    const pos = [
        [connection.source.displayCoords.lat, connection.source.displayCoords.lng],
        [connection.target.displayCoords.lat, connection.target.displayCoords.lng]
    ];

    const opacity = Math.min(connection.force * 10, 1);
    const color = connection.isStressed ? '#ff3333' : '#0077ff';

    return (
        <Polyline
            positions={pos}
            pathOptions={{ color, weight: 1, opacity, dashArray: connection.isStressed ? '5,5' : null }}
        />
    );
};

export default TetryonMap;
