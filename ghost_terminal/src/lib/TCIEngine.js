import { TetryonNode, TetryonGeometry } from './TetryonGeometry.js';

/**
 * Tetryon Cartographic Interface (TCI) Engine.
 * Manages the "Resonance Mesh" - the hidden layer of reality.
 */
export class TCIEngine {
    constructor() {
        this.nodes = new Map(); // Map<string, TetryonNode>
        this.meshConnections = []; // Array<{source, target, force, resonance}>
        this.orbitPaths = []; // Array<Array<[lat, lng]>>
        this.maxNodes = 100;
    }

    /**
     * Ingests a new stream of coordinates.
     */
    ingest(coordinateStream) {
        this.nodes.clear();
        coordinateStream.forEach(coord => {
            const seed = Math.abs(coord.lat * coord.lng * 1000) + 1;
            const node = new TetryonNode(seed);
            node.displayCoords = { lat: coord.lat, lng: coord.lng };
            node.id = coord.id;
            this.nodes.set(coord.id, node);
        });
        this.updateMesh();
    }

    /**
     * Recalculates forces and connections between nodes.
     */
    updateMesh() {
        this.meshConnections = [];
        const nodeList = Array.from(this.nodes.values());

        for (let i = 0; i < nodeList.length; i++) {
            for (let j = i + 1; j < nodeList.length; j++) {
                const n1 = nodeList[i];
                const n2 = nodeList[j];

                const force = TetryonGeometry.tetryonForce(n1, n2);
                const distance = TetryonGeometry.geometricDistance(n1, n2);

                if (force > 0.001) {
                    this.meshConnections.push({
                        source: n1,
                        target: n2,
                        force: force,
                        distance: distance,
                        isStressed: force > 0.1
                    });
                }
            }
        }
    }

    /**
     * Solves the Three-Body Problem for 3 geographic points.
     * Returns stable orbital paths (mocked as Lissajous figures for visualization).
     * @param {Array<{lat, lng}>} points 
     */
    solveThreeBody(points) {
        if (points.length !== 3) return [];

        this.orbitPaths = [];

        // Calculate centroid
        const centroid = {
            lat: (points[0].lat + points[1].lat + points[2].lat) / 3,
            lng: (points[0].lng + points[1].lng + points[2].lng) / 3
        };

        // Generate 3 distinct resonant orbits around the centroid/points
        // We use parametric equations to simulate Tetryon Harmonics
        for (let i = 0; i < 3; i++) {
            const path = [];
            const phaseOffset = (Math.PI * 2 / 3) * i;
            const radius = 0.015; // Approx scale

            for (let t = 0; t <= Math.PI * 2; t += 0.1) {
                // A figure-8 or trefoil knot projection
                const lat = centroid.lat + radius * Math.sin(t * 2 + phaseOffset) * 0.6; // Flatten latitude slightly
                const lng = centroid.lng + radius * Math.cos(t * 3);
                path.push([lat, lng]);
            }
            // Close the loop
            path.push(path[0]);
            this.orbitPaths.push(path);
        }

        return this.orbitPaths;
    }

    getMeshState() {
        return {
            nodes: Array.from(this.nodes.values()),
            connections: this.meshConnections,
            orbitPaths: this.orbitPaths
        };
    }

    generateMockNodes(centerLat, centerLng, count = 10) {
        const mocks = [];
        for (let i = 0; i < count; i++) {
            mocks.push({
                id: `phantom-${i}`,
                lat: centerLat + (Math.random() - 0.5) * 0.05,
                lng: centerLng + (Math.random() - 0.5) * 0.05
            });
        }
        this.ingest(mocks);
    }
}
