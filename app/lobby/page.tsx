'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useMatchStore } from '@/store/useMatchStore';
import { useGameStore } from '@/store/useGameStore';
import { useWebSocket } from '@/hooks/useWebSocket';
import { MatchmakingPanel } from '@/components/lobby/MatchmakingPanel';
import { PurchasePhase } from '@/components/lobby/PurchasePhase';

export default function LobbyPage() {
  const router = useRouter();
  const { player, token } = usePlayerStore();
  const { match } = useMatchStore();
  const { matchmakingStatus } = useGameStore();

  useWebSocket();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!token || !player) router.replace('/login');
  }, [token, player, router]);

  // If match already active go to match
  useEffect(() => {
    if (match?.phase === 'battle' || match?.phase === 'deploy') {
      router.push('/match');
    }
  }, [match, router]);

  const isPurchasePhase = match?.phase === 'purchase';

  return (
    <main className="min-h-screen bg-hex-bg flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-hex-border">
        <span className="font-mono font-bold text-hex-text tracking-widest text-lg">⬡ HEX ARENA</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/leaderboard')}
            className="text-hex-muted hover:text-hex-text font-mono text-sm transition-colors"
          >
            Leaderboard
          </button>
          <button
            onClick={() => {
              usePlayerStore.getState().logout();
              router.push('/login');
            }}
            className="text-hex-danger hover:text-hex-danger/80 font-mono text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        {isPurchasePhase ? (
          <div className="w-full max-w-2xl h-[calc(100vh-8rem)] bg-hex-panel border border-hex-border rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-0">
              <h2 className="font-mono text-hex-warn font-bold text-sm uppercase tracking-widest">
                ◎ Purchase Phase — choose your forces
              </h2>
            </div>
            <PurchasePhase />
          </div>
        ) : (
          <MatchmakingPanel />
        )}
      </div>
    </main>
  );
}
