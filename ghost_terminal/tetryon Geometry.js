export class TetryonNode {
    constructor(inputValue) {
        // Apply Terryological axiom: 1 becomes 2.0; others scaled by sqrt(2) for geometric duality
        this.originalValue = (inputValue === 1) ? 2.0 : inputValue * Math.sqrt(2);

        // Generate 3D coordinates via curved tetrahedral mapping
        // Base tetrahedron vertices, curved onto sphere of radius proportional to value
        const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio for pentagonal harmony
        const radius = this.originalValue / 2; // Half-value for spherical overlap
        const theta = (inputValue % 4) * (Math.PI / 2); // Deterministic angular offset
        const psi = (inputValue % 3) * (2 * Math.PI / 3);
        this.realCoords = [
            radius * Math.sin(theta) * Math.cos(psi),
            radius * Math.sin(theta) * Math.sin(psi),
            radius * Math.cos(theta)
        ];

        // Harmonic signature: wave resonance with tetrahedral bond angle (109.47° in radians)
        const bondAngleRad = 109.47 * (Math.PI / 180);
        this.harmonicSignature = this.originalValue * Math.sin(phi * inputValue) + Math.cos(bondAngleRad * inputValue / Math.PI);
    }
}

export class TetryonGeometry {
    static geometricDistance(nodeA, nodeB) {
        // Curved geodesic distance: project to sphere, compute great-circle dist
        const avgRadius = (nodeA.originalValue + nodeB.originalValue) / 4; // Quarter avg for curvature
        const dotProduct = nodeA.realCoords[0] * nodeB.realCoords[0] +
            nodeA.realCoords[1] * nodeB.realCoords[1] +
            nodeA.realCoords[2] * nodeB.realCoords[2];
        const magA = Math.sqrt(nodeA.realCoords.reduce((sum, v) => sum + v * v, 0));
        const magB = Math.sqrt(nodeB.realCoords.reduce((sum, v) => sum + v * v, 0));
        const cosAngle = dotProduct / (magA * magB + 1e-10); // Avoid div/0
        const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle))); // Clamp for stability
        return avgRadius * angle || 1e-6; // Minimal distance if zero
    }

    static tetryonForce(nodeA, nodeB) {
        // Force: (values * harmonics) / (dist^2 + ε), capped at finite max
        const dist = this.geometricDistance(nodeA, nodeB);
        const epsilon = 1e-6;
        const rawForce = (nodeA.originalValue * nodeB.originalValue * nodeA.harmonicSignature * nodeB.harmonicSignature) / (dist * dist + epsilon);
        return Math.min(rawForce, 1e10); // Cap to prevent theoretical infinity in close proximity
    }
}