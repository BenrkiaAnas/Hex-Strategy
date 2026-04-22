'use client';

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useMatchStore } from '@/store/useMatchStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { TurnIndicator } from '@/components/ui/TurnIndicator';
import { ActionPanel } from '@/components/ui/ActionPanel';
import { CombatLog } from '@/components/ui/CombatLog';
import { FogToggle } from '@/components/ui/FogToggle';
import { useGameStore } from '@/store/useGameStore';
import { useGameActions } from '@/hooks/useGameActions';
import { PurchasePhase } from '@/components/lobby/PurchasePhase';

// R3F canvas must be client-only — no SSR
const GameScene = dynamic(
  () => import('@/components/game/GameScene').then((m) => m.GameScene),
  { ssr: false, loading: () => <SceneLoader /> }
);

function SceneLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="font-mono text-hex-muted text-sm animate-pulse">
        Loading battlefield…
      </div>
    </div>
  );
}

export default function MatchPage() {
  const router = useRouter();
  const { token, player } = usePlayerStore();
  const { match } = useMatchStore();
  const { selectedUnit } = useGameStore();
  const { endTurn, myTurn } = useGameActions();

  useWebSocket();

  useEffect(() => {
    if (!token || !player) router.replace('/login');
  }, [token, player, router]);

  useEffect(() => {
    if (!match) router.replace('/lobby');
  }, [match, router]);

  if (!match) return null;

  const isPurchase = match.phase === 'purchase';
  const isDeploy = match.phase === 'deploy';
  const isBattle = match.phase === 'battle';

  return (
    <main className="h-screen w-screen bg-hex-bg flex flex-col overflow-hidden">
      {/* Top HUD */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center gap-3 px-4 py-3 pointer-events-none">
        <div className="pointer-events-auto">
          <TurnIndicator />
        </div>
        <div className="ml-auto flex items-center gap-2 pointer-events-auto">
          <FogToggle />
          {myTurn && isBattle && !selectedUnit && (
            <button
              onClick={endTurn}
              className="px-4 py-1.5 rounded-lg bg-hex-accent hover:bg-hex-accentHover text-white font-mono text-sm font-bold tracking-widest transition-all active:scale-95"
            >
              End Turn
            </button>
          )}
        </div>
      </div>

      {/* Game canvas — full screen */}
      <div className="flex-1">
        {(isBattle || isDeploy) && <GameScene />}

        {isPurchase && (
          <div className="flex items-center justify-center h-full">
            <div className="w-full max-w-2xl h-[80vh] bg-hex-panel border border-hex-border rounded-2xl overflow-hidden">
              <div className="px-6 pt-6">
                <h2 className="font-mono text-hex-warn font-bold text-sm uppercase tracking-widest">
                  ◎ Purchase Phase
                </h2>
              </div>
              <PurchasePhase />
            </div>
          </div>
        )}
      </div>

      {/* Combat log — bottom center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <CombatLog />
      </div>

      {/* Right panel: selected unit actions */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20">
        {selectedUnit && isBattle && <ActionPanel />}
      </div>

      {/* Player scores — left panel */}
      <div className="absolute left-4 top-16 z-20">
        <PlayerScorePanel match={match} currentPlayerId={player?.id ?? ''} />
      </div>
    </main>
  );
}

function PlayerScorePanel({
  match,
  currentPlayerId,
}: {
  match: import('@/lib/types').MatchState;
  currentPlayerId: string;
}) {
  const players = Object.values(match.players);
  const units = Object.values(match.units);

  return (
    <div className="bg-hex-panel/80 border border-hex-border rounded-xl p-3 w-44 font-mono text-xs space-y-3 backdrop-blur-sm">
      {players.map((p) => {
        const alive = units.filter((u) => u.playerId === p.id && u.hp > 0).length;
        const isMe = p.id === currentPlayerId;
        return (
          <div key={p.id}>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  match.currentTurn === p.id ? 'bg-hex-success animate-pulse' : 'bg-hex-muted'
                }`}
              />
              <span className={isMe ? 'text-hex-accent font-semibold' : 'text-hex-subtle'}>
                {p.username}
              </span>
              {isMe && <span className="text-hex-muted">(you)</span>}
            </div>
            <div className="text-hex-muted mt-0.5 pl-3">
              {alive} unit{alive !== 1 ? 's' : ''} alive
            </div>
          </div>
        );
      })}
    </div>
  );
}
