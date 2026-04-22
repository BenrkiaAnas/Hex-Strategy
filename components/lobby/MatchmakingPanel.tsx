'use client';

import clsx from 'clsx';
import { useGameStore } from '@/store/useGameStore';
import { sendReady } from '@/services/websocket';
import { usePlayerStore } from '@/store/usePlayerStore';

export function MatchmakingPanel() {
  const { matchmakingStatus, setMatchmakingStatus } = useGameStore();
  const { player } = usePlayerStore();

  const handleFindMatch = () => {
    setMatchmakingStatus('searching');
    sendReady();
  };

  const handleCancel = () => {
    setMatchmakingStatus('idle');
  };

  return (
    <div className="bg-hex-panel border border-hex-border rounded-2xl p-8 w-full max-w-md mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="font-mono text-2xl font-bold text-hex-text tracking-widest uppercase">
          Hex Arena
        </h2>
        <p className="text-hex-muted text-sm mt-1 font-mono">
          {player?.username && (
            <span>
              Commander <span className="text-hex-accent">{player.username}</span>
            </span>
          )}
          {' · '}Rating <span className="text-hex-warn">{player?.rating ?? 1200}</span>
        </p>
      </div>

      {/* Status indicator */}
      <div className="mb-6">
        <StatusDisplay status={matchmakingStatus} />
      </div>

      {/* Actions */}
      {matchmakingStatus === 'idle' && (
        <button
          onClick={handleFindMatch}
          className="w-full py-4 rounded-xl bg-hex-accent hover:bg-hex-accentHover text-white font-mono font-bold text-lg tracking-widest uppercase transition-all active:scale-95"
        >
          Find Match
        </button>
      )}

      {matchmakingStatus === 'searching' && (
        <button
          onClick={handleCancel}
          className="w-full py-4 rounded-xl border border-hex-danger/60 text-hex-danger font-mono font-semibold tracking-widest uppercase hover:bg-hex-danger/10 transition-all"
        >
          Cancel
        </button>
      )}

      {matchmakingStatus === 'found' && (
        <div className="text-center text-hex-success font-mono font-bold text-lg animate-pulse-slow">
          Match found! Loading…
        </div>
      )}
    </div>
  );
}

function StatusDisplay({ status }: { status: 'idle' | 'searching' | 'found' }) {
  return (
    <div className={clsx(
      'flex items-center gap-3 px-4 py-3 rounded-lg border font-mono text-sm',
      status === 'idle'      && 'border-hex-border bg-hex-bg text-hex-muted',
      status === 'searching' && 'border-hex-warn/50 bg-hex-warn/5 text-hex-warn',
      status === 'found'     && 'border-hex-success/50 bg-hex-success/5 text-hex-success',
    )}>
      <span className={clsx(
        'w-2 h-2 rounded-full',
        status === 'idle'      && 'bg-hex-muted',
        status === 'searching' && 'bg-hex-warn animate-pulse',
        status === 'found'     && 'bg-hex-success shadow-[0_0_8px_#10b981]',
      )} />
      {status === 'idle'      && 'Ready to fight'}
      {status === 'searching' && 'Searching for opponent…'}
      {status === 'found'     && 'Opponent found!'}
    </div>
  );
}
