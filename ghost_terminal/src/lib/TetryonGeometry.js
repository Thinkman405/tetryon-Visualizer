/**
 * TetryonGeometry.js
 * JavaScript Port of the Lynchpin Tetryon Geometry Library.
 * 
 * "The map is not the territory. The map is the wave-function of the territory."
 */

export class TetryonNode {
    /**
     * Represents a single point or 'node' within the Lynchpin Tetryon Geometry.
     * @param {number} value The numerical value (seed).
     */
    constructor(value) {
        if (typeof value !== 'number' || value <= 0) {
            throw new Error("Input value must be a positive number.");
        }

        // --- Foundational Principle: The 1 x 1 = 2 Axiom ---
        let processedValue = value;
        if (value === 1) {
            processedValue = 2.0;
        }

        // Map to 3D curvilinear lattice
        const r = Math.log(processedValue);
        const theta = Math.sqrt(processedValue) * (Math.PI / 3);

        // real_coords = [x, y, z]
        this.realCoords = [
            r * Math.cos(theta),
            r * Math.sin(theta),
            Math.log(processedValue)
        ];

        // Bifurcations
        // Imaginary is pure imaginary magnitude: i * sqrt(val)
        this.imaginaryBifurcation = Math.sqrt(processedValue);

        // Negative bifurcation vector
        this.negativeBifurcation = [
            -r * Math.cos(theta),
            -r * Math.sin(theta)
        ];

        // Harmonic signature (simple hash equivalent for JS)
        this.harmonicSignature = this._simpleHash(processedValue);

        this.originalValue = processedValue;
    }

    _simpleHash(val) {
        return Math.floor(val * 123456) % 1000000;
    }
}

export class TetryonGeometry {
    static HOWARD_COMMA_CONSTANT = 6.626e-34;

    /**
     * Calculates the conceptual "geometric distance" using a hyperbolic metric.
     */
    static geometricDistance(node1, node2) {
        // Euclidean distance in real coords
        const dx = node1.realCoords[0] - node2.realCoords[0];
        const dy = node1.realCoords[1] - node2.realCoords[1];
        const dz = node1.realCoords[2] - node2.realCoords[2];
        const euclideanDist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Imaginary distance (difference in magnitudes)
        const imagDist = Math.abs(node1.imaginaryBifurcation - node2.imaginaryBifurcation);

        // Fractal correction: D(r) = 3 + sin^2(pi * r / l_P)
        // Note: JS sine is radians
        const fractalCorrection = Math.pow(Math.sin(Math.PI * euclideanDist / this.HOWARD_COMMA_CONSTANT), 2);

        return Math.sqrt(Math.pow(euclideanDist, 2) + Math.pow(imagDist, 2) + fractalCorrection);
    }

    /**
     * Models the 'prime force' between two nodes based on resonance.
     */
    static tetryonForce(node1, node2, k = 1.0) {
        const distance = this.geometricDistance(node1, node2);
        if (distance === 0) return Infinity;
        return k / Math.pow(distance, 2);
    }

    /**
     * Checks if a number is 'prime' by resonance (integer stability).
     */
    static isPrimeByResonance(value) {
        if (value === 2) return false;
        if (value > 1) {
            return Number.isInteger(value);
        }
        return false;
    }

    /**
     * Calculates energy based on frequency and Howard Comma.
     */
    static calculateTetryonEnergy(frequency) {
        return this.HOWARD_COMMA_CONSTANT * frequency;
    }
}
