'use client';

import clsx from 'clsx';
import { useGameStore } from '@/store/useGameStore';
import { useGameActions } from '@/hooks/useGameActions';
import { useMatchStore } from '@/store/useMatchStore';
import { CATEGORY_COLORS } from '@/lib/constants';
import type { ActionType } from '@/lib/types';

const ACTION_META: Record<ActionType, { label: string; icon: string; desc: string }> = {
  move:    { label: 'Move',    icon: '⟶',  desc: 'Move to a highlighted tile' },
  attack:  { label: 'Attack',  icon: '⚔',  desc: 'Strike an enemy unit' },
  recover: { label: 'Recover', icon: '♥',  desc: 'Restore 20% max HP' },
  scout:   { label: 'Scout',   icon: '◎',  desc: 'Reveal fog tiles in range' },
};

export function ActionPanel() {
  const { selectedUnit, activeAction, setActiveAction, setGameMode } = useGameStore();
  const { match } = useMatchStore();
  const { endTurn, myTurn } = useGameActions();

  if (!selectedUnit || !match) return null;

  const unit = match.units[selectedUnit.unitId];
  if (!unit) return null;

  const handleAction = (action: ActionType) => {
    if (activeAction === action) {
      setActiveAction(null);
      setGameMode('idle');
    } else {
      setActiveAction(action);
      setGameMode(action === 'move' ? 'move' : action === 'attack' ? 'attack' : 'idle');
    }
  };

  const categoryColor = CATEGORY_COLORS[unit.category] ?? '#6b7280';

  return (
    <div className="bg-hex-panel border border-hex-border rounded-xl p-4 w-64 animate-slide-up">
      {/* Unit header */}
      <div className="mb-3 pb-3 border-b border-hex-border">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: categoryColor, boxShadow: `0 0 6px ${categoryColor}` }}
          />
          <span className="font-mono font-semibold text-hex-text">{unit.name}</span>
          <span className="ml-auto text-xs text-hex-muted capitalize">{unit.category}</span>
        </div>
        {/* HP bar */}
        <div className="mt-2">
          <div className="flex justify-between text-xs text-hex-muted mb-1">
            <span>HP</span>
            <span>{unit.hp} / {unit.maxHp}</span>
          </div>
          <div className="h-1.5 bg-hex-border rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(unit.hp / unit.maxHp) * 100}%`,
                backgroundColor: unit.hp / unit.maxHp > 0.6 ? '#10b981' : unit.hp / unit.maxHp > 0.3 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
        </div>
        {/* Stats */}
        <div className="mt-2 grid grid-cols-3 gap-1 text-xs">
          <StatBadge label="ATK" value={unit.attack} />
          <StatBadge label="DEF" value={unit.defense} />
          <StatBadge label="MOV" value={unit.movement} />
        </div>
      </div>

      {/* Action buttons */}
      {myTurn && (
        <div className="grid grid-cols-2 gap-2">
          {selectedUnit.availableActions.map((action) => (
            <button
              key={action}
              onClick={() => handleAction(action)}
              className={clsx(
                'flex flex-col items-center gap-1 py-2 px-1 rounded-lg border text-xs font-mono transition-all',
                activeAction === action
                  ? 'border-hex-accent bg-hex-accent/20 text-hex-accent'
                  : 'border-hex-border bg-hex-bg text-hex-subtle hover:border-hex-accent/50 hover:text-hex-text'
              )}
              title={ACTION_META[action].desc}
            >
              <span className="text-base">{ACTION_META[action].icon}</span>
              <span>{ACTION_META[action].label}</span>
            </button>
          ))}
        </div>
      )}

      {/* End turn */}
      {myTurn && (
        <button
          onClick={endTurn}
          className="mt-3 w-full py-2 rounded-lg border border-hex-border bg-hex-bg text-hex-muted font-mono text-sm hover:border-hex-warn hover:text-hex-warn transition-colors"
        >
          End Turn
        </button>
      )}
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-hex-bg rounded px-1 py-0.5 text-center">
      <span className="text-hex-muted">{label} </span>
      <span className="text-hex-text font-semibold">{value}</span>
    </div>
  );
}
