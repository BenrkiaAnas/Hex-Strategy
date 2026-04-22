'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMatchStore } from '@/store/useMatchStore';
import { usePlayerStore } from '@/store/usePlayerStore';
import clsx from 'clsx';

export default function ResultPage() {
  const router = useRouter();
  const { match, clearMatch } = useMatchStore();
  const { player } = usePlayerStore();

  useEffect(() => {
    if (!match) router.replace('/lobby');
  }, [match, router]);

  if (!match) return null;

  const isWinner = match.winnerId === player?.id;
  const winnerName = match.winnerId ? match.players[match.winnerId]?.username : null;

  const handleContinue = () => {
    clearMatch();
    router.push('/lobby');
  };

  return (
    <main className="min-h-screen bg-hex-bg flex items-center justify-center">
      <div className="text-center font-mono animate-fade-in">
        {/* Result badge */}
        <div
          className={clsx(
            'inline-flex items-center justify-center w-28 h-28 rounded-full mb-8 text-5xl',
            isWinner
              ? 'bg-hex-success/10 border-2 border-hex-success/50 shadow-[0_0_40px_#10b98130]'
              : 'bg-hex-danger/10 border-2 border-hex-danger/50 shadow-[0_0_40px_#ef444430]'
          )}
        >
          {isWinner ? '🏆' : '💀'}
        </div>

        <h1
          className={clsx(
            'text-5xl font-black tracking-widest uppercase mb-3',
            isWinner ? 'text-hex-success' : 'text-hex-danger'
          )}
        >
          {isWinner ? 'Victory' : 'Defeat'}
        </h1>

        <p className="text-hex-muted text-sm mb-2">
          {isWinner
            ? 'Your forces have prevailed.'
            : `${winnerName ?? 'Opponent'} has claimed the battlefield.`}
        </p>

        <p className="text-hex-subtle text-xs mb-10">
          Round {match.roundNumber} · Match #{match.id.slice(-6)}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-10 max-w-xs mx-auto">
          {Object.values(match.players).map((p) => {
            const alive = Object.values(match.units).filter(
              (u) => u.playerId === p.id && u.hp > 0
            ).length;
            const isMe = p.id === player?.id;
            return (
              <div
                key={p.id}
                className={clsx(
                  'bg-hex-panel border rounded-xl p-4',
                  isMe ? 'border-hex-accent/40' : 'border-hex-border'
                )}
              >
                <div
                  className={clsx(
                    'font-semibold text-sm mb-1',
                    isMe ? 'text-hex-accent' : 'text-hex-subtle'
                  )}
                >
                  {p.username}
                </div>
                <div className="text-hex-muted text-xs">{alive} units survived</div>
                {match.winnerId === p.id && (
                  <div className="text-hex-success text-xs mt-1 font-semibold">Winner</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => router.push('/leaderboard')}
            className="px-6 py-3 rounded-xl border border-hex-border text-hex-muted hover:text-hex-text hover:border-hex-accent/50 font-semibold text-sm tracking-widest uppercase transition-all"
          >
            Leaderboard
          </button>
          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-xl bg-hex-accent hover:bg-hex-accentHover text-white font-bold text-sm tracking-widest uppercase transition-all active:scale-95"
          >
            Play Again
          </button>
        </div>
      </div>
    </main>
  );
}
