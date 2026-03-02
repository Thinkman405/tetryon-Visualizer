import { TetryonNode, TetryonGeometry } from './src/lib/TetryonGeometry.js';

console.log("💠 TESTING TETRYON GEOMETRY 💠");

// TEST 1: The 1x1=2 Axiom
console.log("\n[TEST 1] Axiom 1x1=2");
const node1 = new TetryonNode(1);
if (node1.originalValue === 2.0) {
    console.log("✅ PASS: Input 1 converted to 2.0");
} else {
    console.error(`❌ FAIL: Input 1 converted to ${node1.originalValue}`);
}

// TEST 2: Node Creation
console.log("\n[TEST 2] Node Creation (Val: 10)");
const node10 = new TetryonNode(10);
console.log("Real Coords:", node10.realCoords);
console.log("Harmonic Sig:", node10.harmonicSignature);
if (node10.realCoords.length === 3) console.log("✅ PASS: 3D Coordinates generated");

// TEST 3: Distance
console.log("\n[TEST 3] Geometric Distance");
const dist = TetryonGeometry.geometricDistance(node1, node10);
console.log(`Distance(1, 10) = ${dist}`);
if (dist > 0 && !isNaN(dist)) console.log("✅ PASS: Distance calculated");

// TEST 4: Tetryon Force
console.log("\n[TEST 4] Tetryon Force");
const force = TetryonGeometry.tetryonForce(node1, node10);
console.log(`Force(1, 10) = ${force}`);
if (force > 0 && force !== Infinity) console.log("✅ PASS: Force calculated");

console.log("\n💠 SYSTEMS NOMINAL 💠");
