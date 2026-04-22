'use client';

import clsx from 'clsx';
import { useGameStore } from '@/store/useGameStore';

export function FogToggle() {
  const { showFog, toggleFog } = useGameStore();

  return (
    <button
      onClick={toggleFog}
      className={clsx(
        'px-3 py-1.5 rounded-lg border font-mono text-xs transition-all',
        showFog
          ? 'border-hex-accent/40 bg-hex-accent/10 text-hex-accent'
          : 'border-hex-border bg-hex-panel text-hex-muted'
      )}
    >
      {showFog ? '◎ Fog ON' : '◎ Fog OFF'}
    </button>
  );
}
