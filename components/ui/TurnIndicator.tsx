'use client';

import clsx from 'clsx';
import { useMatchStore } from '@/store/useMatchStore';
import { usePlayerStore } from '@/store/usePlayerStore';

export function TurnIndicator() {
  const { match } = useMatchStore();
  const { player } = usePlayerStore();

  if (!match) return null;

  const myTurn = match.currentTurn === player?.id;
  const currentPlayer = match.players[match.currentTurn];

  return (
    <div
      className={clsx(
        'flex items-center gap-3 px-4 py-2 rounded-lg border font-mono text-sm transition-all',
        myTurn
          ? 'border-hex-success bg-hex-success/10 text-hex-success animate-pulse-slow'
          : 'border-hex-border bg-hex-panel text-hex-subtle'
      )}
    >
      <span
        className={clsx(
          'w-2.5 h-2.5 rounded-full',
          myTurn ? 'bg-hex-success shadow-[0_0_8px_#10b981]' : 'bg-hex-muted'
        )}
      />
      <span>
        {myTurn ? 'YOUR TURN' : `${currentPlayer?.username ?? 'Opponent'}'s turn`}
      </span>
      <span className="ml-auto text-hex-muted">Round {match.roundNumber}</span>
    </div>
  );
}
