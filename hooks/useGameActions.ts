'use client';

import { useCallback } from 'react';
import {
  sendMoveUnit,
  sendAttackUnit,
  sendEndTurn,
  sendDeployUnit,
} from '@/services/websocket';
import { useGameStore } from '@/store/useGameStore';
import { useMatchStore } from '@/store/useMatchStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { getReachableTiles, getAttackTiles } from '@/lib/hexUtils';
import type { HexCoord, Unit } from '@/lib/types';

export function useGameActions() {
  const { player } = usePlayerStore();
  const { match } = useMatchStore();
  const {
    selectedUnit,
    selectUnit,
    setActiveAction,
    activeAction,
    gameMode,
    setGameMode,
  } = useGameStore();

  const myTurn = match?.currentTurn === player?.id;

  const selectGameUnit = useCallback(
    (unit: Unit) => {
      if (!match) return;
      const isOwn = unit.playerId === player?.id;
      const reachable = isOwn && !unit.hasMoved
        ? getReachableTiles(unit.position!, unit.movement)
        : [];
      const attackable = isOwn && !unit.hasActed
        ? getAttackTiles(unit.position!, unit.range)
        : [];

      selectUnit({
        unitId: unit.id,
        availableActions: [
          ...(!unit.hasMoved ? ['move' as const] : []),
          ...(!unit.hasActed ? ['attack' as const] : []),
          'recover',
          'scout',
        ],
        reachableTiles: reachable,
        attackableTiles: attackable,
      });
    },
    [match, player, selectUnit]
  );

  const onTileClick = useCallback(
    (tile: HexCoord) => {
      if (!myTurn || !selectedUnit) return;

      if (activeAction === 'move') {
        sendMoveUnit(selectedUnit.unitId, tile.q, tile.r);
        selectUnit(null);
        setActiveAction(null);
        setGameMode('idle');
      } else if (activeAction === 'attack') {
        // Find unit on that tile
        if (!match) return;
        const target = Object.values(match.units).find(
          (u) => u.position?.q === tile.q && u.position?.r === tile.r
        );
        if (target) {
          sendAttackUnit(selectedUnit.unitId, target.id);
          selectUnit(null);
          setActiveAction(null);
          setGameMode('idle');
        }
      }
    },
    [myTurn, selectedUnit, activeAction, match, selectUnit, setActiveAction, setGameMode]
  );

  const onDeployUnit = useCallback(
    (unitId: string, tile: HexCoord) => {
      sendDeployUnit(unitId, tile.q, tile.r);
    },
    []
  );

  const endTurn = useCallback(() => {
    if (!myTurn) return;
    sendEndTurn();
    selectUnit(null);
  }, [myTurn, selectUnit]);

  return { selectGameUnit, onTileClick, onDeployUnit, endTurn, myTurn };
}
