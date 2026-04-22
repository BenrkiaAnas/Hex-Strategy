'use client';

import { useCallback } from 'react';
import { getBattlefieldHexes, hexKey, hexEqual } from '@/lib/hexUtils';
import { HexTile } from './HexTile';
import { useGameStore } from '@/store/useGameStore';
import { useGameActions } from '@/hooks/useGameActions';
import type { HexCoord } from '@/lib/types';

const BATTLEFIELD = getBattlefieldHexes();

export function HexGrid() {
  const { hoveredTile, setHoveredTile, selectedUnit, activeAction } = useGameStore();
  const { onTileClick } = useGameActions();

  const getTileState = useCallback(
    (coord: HexCoord): 'default' | 'hovered' | 'reachable' | 'attackable' | 'selected' => {
      if (selectedUnit?.reachableTiles.some((t) => hexEqual(t, coord)) && activeAction === 'move')
        return 'reachable';
      if (selectedUnit?.attackableTiles.some((t) => hexEqual(t, coord)) && activeAction === 'attack')
        return 'attackable';
      if (hoveredTile && hexEqual(hoveredTile, coord)) return 'hovered';
      return 'default';
    },
    [hoveredTile, selectedUnit, activeAction]
  );

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.12, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#060a14" />
      </mesh>

      {BATTLEFIELD.map((coord) => (
        <HexTile
          key={hexKey(coord)}
          coord={coord}
          state={getTileState(coord)}
          onHover={() => setHoveredTile(coord)}
          onUnhover={() => setHoveredTile(null)}
          onClick={() => onTileClick(coord)}
        />
      ))}
    </group>
  );
}
