import { TetryonNode, TetryonGeometry } from './TetryonGeometry.js';

export class TCIEngine {
  constructor() {
    this.nodes = new Map();
    this.meshConnections = [];
    this.orbitPaths = [];
    this.maxNodes = 100;
  }

  ingest(coordinateStream) {
    this.nodes.clear();

    coordinateStream.slice(0, this.maxNodes).forEach((coordinate, index) => {
      const seed = Math.abs(coordinate.lat * coordinate.lng * 1000) + index + 1;
      const node = new TetryonNode(seed);
      node.displayCoords = { lat: coordinate.lat, lng: coordinate.lng };
      node.id = coordinate.id;
      this.nodes.set(coordinate.id, node);
    });

    this.updateMesh();
  }

  updateMesh() {
    this.meshConnections = [];
    const nodeList = Array.from(this.nodes.values());

    for (let sourceIndex = 0; sourceIndex < nodeList.length; sourceIndex += 1) {
      for (let targetIndex = sourceIndex + 1; targetIndex < nodeList.length; targetIndex += 1) {
        const source = nodeList[sourceIndex];
        const target = nodeList[targetIndex];
        const force = TetryonGeometry.tetryonForce(source, target);
        const distance = TetryonGeometry.geometricDistance(source, target);

        if (force > 0.001) {
          this.meshConnections.push({
            id: `${source.id}-${target.id}`,
            source,
            target,
            force,
            distance,
            isStressed: force > 0.1,
          });
        }
      }
    }
  }

  solveThreeBody(points) {
    if (points.length !== 3) {
      return [];
    }

    this.orbitPaths = [];
    const centroid = {
      lat: (points[0].lat + points[1].lat + points[2].lat) / 3,
      lng: (points[0].lng + points[1].lng + points[2].lng) / 3,
    };

    for (let orbitIndex = 0; orbitIndex < 3; orbitIndex += 1) {
      const phaseOffset = ((Math.PI * 2) / 3) * orbitIndex;
      const radius = 1.2;
      const path = [];

      for (let time = 0; time <= Math.PI * 2; time += 0.1) {
        path.push([
          centroid.lat + radius * Math.sin(time * 2 + phaseOffset) * 0.6,
          centroid.lng + radius * Math.cos(time * 3) * 0.8,
        ]);
      }

      path.push(path[0]);
      this.orbitPaths.push(path);
    }

    return this.orbitPaths;
  }

  clearOrbitPaths() {
    this.orbitPaths = [];
  }

  getMeshState() {
    return {
      nodes: Array.from(this.nodes.values()),
      connections: this.meshConnections,
      orbitPaths: this.orbitPaths,
    };
  }

  generateMockNodes(centerLat, centerLng, count = 10) {
    const nodes = Array.from({ length: count }, (_, index) => {
      const angle = ((Math.PI * 2) / count) * index;
      const radius = 0.65 + (index % 4) * 0.18;

      return {
        id: `phantom-${index}`,
        lat: centerLat + Math.cos(angle) * radius,
        lng: centerLng + Math.sin(angle) * radius,
      };
    });

    this.ingest(nodes);
  }
}
