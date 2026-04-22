'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { hexToWorld } from '@/lib/hexUtils';
import { HEX_SIZE, HEX_HEIGHT } from '@/lib/constants';
import type { HexCoord } from '@/lib/types';

type TileState = 'default' | 'hovered' | 'reachable' | 'attackable' | 'selected';

interface HexTileProps {
  coord: HexCoord;
  state: TileState;
  onHover: () => void;
  onUnhover: () => void;
  onClick: () => void;
}

const STATE_CONFIG: Record<TileState, { color: number; emissive: number; emissiveIntensity: number; yOffset: number }> = {
  default:    { color: 0x1a2744, emissive: 0x000000, emissiveIntensity: 0,    yOffset: 0 },
  hovered:    { color: 0x2d4a8a, emissive: 0x3b82f6, emissiveIntensity: 0.3,  yOffset: 0.06 },
  reachable:  { color: 0x1a4a2a, emissive: 0x10b981, emissiveIntensity: 0.4,  yOffset: 0.04 },
  attackable: { color: 0x4a1a1a, emissive: 0xef4444, emissiveIntensity: 0.5,  yOffset: 0.04 },
  selected:   { color: 0x1a3a6a, emissive: 0x60a5fa, emissiveIntensity: 0.6,  yOffset: 0.08 },
};

export function HexTile({ coord, state, onHover, onUnhover, onClick }: HexTileProps) {
  const meshRef = useRef<Mesh>(null);
  const [wx, , wz] = hexToWorld(coord.q, coord.r);
  const cfg = STATE_CONFIG[state];

  // Smooth y-position lerp
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = cfg.yOffset;
    meshRef.current.position.y += (target - meshRef.current.position.y) * Math.min(delta * 10, 1);
  });

  const edgeGlow = state !== 'default';

  return (
    <group position={[wx, 0, wz]}>
      {/* Main hex body */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerEnter={(e) => { e.stopPropagation(); onHover(); }}
        onPointerLeave={(e) => { e.stopPropagation(); onUnhover(); }}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <cylinderGeometry args={[HEX_SIZE * 0.96, HEX_SIZE * 0.96, HEX_HEIGHT, 6, 1]} />
        <meshStandardMaterial
          color={cfg.color}
          emissive={cfg.emissive}
          emissiveIntensity={cfg.emissiveIntensity}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Edge border ring */}
      {edgeGlow && (
        <mesh position={[0, cfg.yOffset + 0.001, 0]}>
          <cylinderGeometry args={[HEX_SIZE * 0.98, HEX_SIZE * 0.98, 0.01, 6, 1]} />
          <meshStandardMaterial
            color={cfg.emissive}
            emissive={cfg.emissive}
            emissiveIntensity={1.5}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
