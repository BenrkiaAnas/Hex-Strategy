'use client';

import { useMatchStore } from '@/store/useMatchStore';

export function CombatLog() {
  const { match } = useMatchStore();
  const result = match?.lastCombat;

  if (!result) return null;

  return (
    <div className="bg-hex-panel/90 border border-hex-border rounded-lg px-4 py-2 font-mono text-sm animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="text-hex-danger font-bold">⚔ Combat</span>
        <span className="text-hex-muted">
          Dealt <span className="text-hex-warn font-semibold">{result.damage}</span> dmg
          {result.counterDamage > 0 && (
            <> · Counter <span className="text-hex-danger font-semibold">{result.counterDamage}</span></>
          )}
        </span>
        {result.defenderDied && <span className="text-hex-danger ml-1">Unit defeated!</span>}
      </div>
    </div>
  );
}
