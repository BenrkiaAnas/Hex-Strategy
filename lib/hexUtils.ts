import { HEX_SIZE, GRID_RADIUS } from './constants';
import type { HexCoord } from './types';

// Axial coordinate → 3-D world position (pointy-top hexes, XZ plane)
export function hexToWorld(q: number, r: number): [number, number, number] {
  const x = HEX_SIZE * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const z = HEX_SIZE * (1.5 * r);
  return [x, 0, z];
}

// 3-D world position → nearest axial hex coord
export function worldToHex(x: number, z: number): HexCoord {
  const q = ((Math.sqrt(3) / 3) * x - (1 / 3) * z) / HEX_SIZE;
  const r = ((2 / 3) * z) / HEX_SIZE;
  return cubeToAxial(cubeRound(axialToCube({ q, r })));
}

// Cube ↔ axial conversions
interface CubeCoord { x: number; y: number; z: number }

function axialToCube({ q, r }: HexCoord): CubeCoord {
  return { x: q, z: r, y: -q - r };
}

function cubeToAxial({ x, z }: CubeCoord): HexCoord {
  return { q: x, r: z };
}

function cubeRound(cube: CubeCoord): CubeCoord {
  let rx = Math.round(cube.x);
  let ry = Math.round(cube.y);
  let rz = Math.round(cube.z);

  const dx = Math.abs(rx - cube.x);
  const dy = Math.abs(ry - cube.y);
  const dz = Math.abs(rz - cube.z);

  if (dx > dy && dx > dz) rx = -ry - rz;
  else if (dy > dz) ry = -rx - rz;
  else rz = -rx - ry;

  return { x: rx, y: ry, z: rz };
}

// Manhattan distance between two hex coords
export function hexDistance(a: HexCoord, b: HexCoord): number {
  const ac = axialToCube(a);
  const bc = axialToCube(b);
  return Math.max(
    Math.abs(ac.x - bc.x),
    Math.abs(ac.y - bc.y),
    Math.abs(ac.z - bc.z)
  );
}

// Generate all hex coords within `radius` of origin
export function hexRange(radius: number): HexCoord[] {
  const results: HexCoord[] = [];
  for (let q = -radius; q <= radius; q++) {
    const r1 = Math.max(-radius, -q - radius);
    const r2 = Math.min(radius, -q + radius);
    for (let r = r1; r <= r2; r++) {
      results.push({ q, r });
    }
  }
  return results;
}

// All hexes on the full battlefield
export function getBattlefieldHexes(): HexCoord[] {
  return hexRange(GRID_RADIUS);
}

// Hexes reachable from `origin` within `movement` steps (no obstacle logic)
export function getReachableTiles(origin: HexCoord, movement: number): HexCoord[] {
  return getBattlefieldHexes().filter(
    (h) => h !== origin && hexDistance(origin, h) <= movement
  );
}

// Hexes within attack range
export function getAttackTiles(origin: HexCoord, range: number): HexCoord[] {
  return getBattlefieldHexes().filter(
    (h) => hexDistance(origin, h) > 0 && hexDistance(origin, h) <= range
  );
}

export function hexEqual(a: HexCoord, b: HexCoord): boolean {
  return a.q === b.q && a.r === b.r;
}

export function hexKey(h: HexCoord): string {
  return `${h.q},${h.r}`;
}
