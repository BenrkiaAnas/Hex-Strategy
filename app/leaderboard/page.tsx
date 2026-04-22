'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlayerStore } from '@/store/usePlayerStore';
import { apiGetLeaderboard } from '@/services/api';
import clsx from 'clsx';
import type { LeaderboardEntry } from '@/lib/types';

export default function LeaderboardPage() {
  const router = useRouter();
  const { token, player } = usePlayerStore();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) { router.replace('/login'); return; }
    apiGetLeaderboard(token)
      .then(setEntries)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, router]);

  return (
    <main className="min-h-screen bg-hex-bg">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-hex-border">
        <span className="font-mono font-bold text-hex-text tracking-widest text-lg">⬡ HEX ARENA</span>
        <button
          onClick={() => router.push('/lobby')}
          className="text-hex-muted hover:text-hex-text font-mono text-sm transition-colors"
        >
          ← Lobby
        </button>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="font-mono text-2xl font-bold text-hex-text mb-1 tracking-widest uppercase">
          Leaderboard
        </h1>
        <p className="text-hex-muted text-sm mb-8">Top commanders by rating</p>

        {loading && (
          <div className="text-center py-20 text-hex-muted font-mono animate-pulse">
            Loading…
          </div>
        )}

        {error && (
          <div className="bg-hex-danger/10 border border-hex-danger/30 text-hex-danger font-mono text-sm rounded-xl p-4">
            {error}
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-20 text-hex-muted font-mono">
            No entries yet. Be the first to battle!
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-2 px-4 py-2 text-hex-muted font-mono text-xs uppercase tracking-widest">
              <span className="col-span-1">#</span>
              <span className="col-span-4">Commander</span>
              <span className="col-span-2 text-right">Rating</span>
              <span className="col-span-2 text-right">W</span>
              <span className="col-span-2 text-right">L</span>
              <span className="col-span-1 text-right">%</span>
            </div>

            {entries.map((entry) => {
              const isMe = entry.playerId === player?.id;
              const medalColor = entry.rank === 1 ? '#fbbf24' : entry.rank === 2 ? '#94a3b8' : entry.rank === 3 ? '#cd7c4a' : undefined;

              return (
                <div
                  key={entry.playerId}
                  className={clsx(
                    'grid grid-cols-12 gap-2 px-4 py-3 rounded-xl font-mono text-sm transition-all',
                    isMe
                      ? 'bg-hex-accent/10 border border-hex-accent/30'
                      : 'bg-hex-panel border border-hex-border hover:border-hex-border/80'
                  )}
                >
                  <span
                    className="col-span-1 font-bold"
                    style={{ color: medalColor ?? '#6b7280' }}
                  >
                    {entry.rank <= 3 ? ['🥇','🥈','🥉'][entry.rank - 1] : `#${entry.rank}`}
                  </span>
                  <span className={clsx('col-span-4 font-semibold', isMe ? 'text-hex-accent' : 'text-hex-text')}>
                    {entry.username}
                    {isMe && <span className="ml-1 text-xs text-hex-muted">(you)</span>}
                  </span>
                  <span className="col-span-2 text-right text-hex-warn font-bold">{entry.rating}</span>
                  <span className="col-span-2 text-right text-hex-success">{entry.wins}</span>
                  <span className="col-span-2 text-right text-hex-danger">{entry.losses}</span>
                  <span className="col-span-1 text-right text-hex-muted">
                    {(entry.winRate * 100).toFixed(0)}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
