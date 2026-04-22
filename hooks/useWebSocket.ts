'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { wsService } from '@/services/websocket';
import { useMatchStore } from '@/store/useMatchStore';
import { useGameStore } from '@/store/useGameStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import { WS_URL } from '@/lib/constants';
import type { MatchState, Unit, CombatResult } from '@/lib/types';

export function useWebSocket() {
  const router = useRouter();
  const { token } = usePlayerStore();
  const {
    setMatch, setPhase, setCurrentTurn,
    applyStateUpdateUnits, setLastCombat, setWinner,
  } = useMatchStore();
  const { setMatchmakingStatus, setCombatAnimation } = useGameStore();
  const registered = useRef(false);

  useEffect(() => {
    if (!token || registered.current) return;
    registered.current = true;

    wsService.connect(WS_URL, token);

    const off: (() => void)[] = [];

    off.push(
      wsService.on('match_found', () => {
        setMatchmakingStatus('found');
      })
    );

    off.push(
      wsService.on('match_start', (data) => {
        const match = data as MatchState;
        setMatch(match);
        setMatchmakingStatus('idle');
        router.push('/match');
      })
    );

    off.push(
      wsService.on('purchase_reveal', (data) => {
        const { units } = data as { units: Record<string, Unit> };
        applyStateUpdateUnits(units);
        setPhase('deploy');
      })
    );

    off.push(
      wsService.on('state_update', (data) => {
        const { units } = data as { units: Record<string, Unit> };
        applyStateUpdateUnits(units);
      })
    );

    off.push(
      wsService.on('turn_change', (data) => {
        const { currentTurn } = data as { currentTurn: string };
        setCurrentTurn(currentTurn);
      })
    );

    off.push(
      wsService.on('combat_result', (data) => {
        const result = data as CombatResult;
        setLastCombat(result);
        setCombatAnimation({
          attackerId: result.attackerId,
          defenderId: result.defenderId,
        });
        setTimeout(() => setCombatAnimation(null), 1200);
      })
    );

    off.push(
      wsService.on('match_end', (data) => {
        const { winnerId } = data as { winnerId: string };
        setWinner(winnerId);
        setPhase('end');
        setTimeout(() => router.push('/result'), 2000);
      })
    );

    return () => {
      off.forEach((fn) => fn());
      registered.current = false;
    };
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps
}
