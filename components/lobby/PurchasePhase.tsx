'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { sendPurchaseSubmit } from '@/services/websocket';
import { UNIT_CATALOG, PURCHASE_BUDGET, CATEGORY_COLORS } from '@/lib/constants';
import type { UnitCategory, UnitDefinition } from '@/lib/types';

const CATEGORIES: UnitCategory[] = ['offense', 'defense', 'support', 'special'];

const CATEGORY_LABELS: Record<UnitCategory, string> = {
  offense: 'Offense',
  defense: 'Defense',
  support: 'Support',
  special: 'Special',
};

export function PurchasePhase() {
  const [activeCategory, setActiveCategory] = useState<UnitCategory>('offense');
  const [submitted, setSubmitted] = useState(false);
  const {
    purchaseDraft,
    purchaseSpent,
    addToPurchase,
    removeFromPurchase,
    clearPurchaseDraft,
  } = useGameStore();

  const remaining = PURCHASE_BUDGET - purchaseSpent;
  const filtered = UNIT_CATALOG.filter((u) => u.category === activeCategory);

  const handleSubmit = () => {
    const items = Object.entries(purchaseDraft).map(([definitionId, quantity]) => ({
      definitionId,
      quantity,
    }));
    sendPurchaseSubmit(items);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-hex-success font-mono text-xl font-bold animate-pulse-slow">
          ✓ Order submitted
        </div>
        <p className="text-hex-muted font-mono text-sm">Waiting for opponent…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto px-4 py-6 font-mono animate-slide-up">
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="text-xl font-bold text-hex-text tracking-wide uppercase">Deploy Budget</h2>
        <div className="text-right">
          <span className="text-hex-warn text-2xl font-bold">{remaining}</span>
          <span className="text-hex-muted text-sm"> / {PURCHASE_BUDGET} pts</span>
        </div>
      </div>

      {/* Budget bar */}
      <div className="h-2 bg-hex-border rounded-full mb-6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${(purchaseSpent / PURCHASE_BUDGET) * 100}%`,
            backgroundColor: remaining < 20 ? '#ef4444' : '#f59e0b',
          }}
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-4 bg-hex-bg rounded-lg p-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={clsx(
              'flex-1 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase transition-all',
              activeCategory === cat
                ? 'bg-hex-panel text-hex-text'
                : 'text-hex-muted hover:text-hex-subtle'
            )}
            style={activeCategory === cat ? { color: CATEGORY_COLORS[cat] } : {}}
          >
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      {/* Unit cards */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {filtered.map((def) => (
          <UnitCard
            key={def.id}
            def={def}
            quantity={purchaseDraft[def.id] ?? 0}
            remaining={remaining}
            onAdd={() => addToPurchase(def.id, def.cost, PURCHASE_BUDGET)}
            onRemove={() => removeFromPurchase(def.id, def.cost)}
          />
        ))}
      </div>

      {/* Cart summary */}
      <div className="mt-4 pt-4 border-t border-hex-border">
        <div className="flex items-center justify-between mb-3 text-sm text-hex-muted">
          <span>
            {Object.values(purchaseDraft).reduce((a, b) => a + b, 0)} units selected
          </span>
          {purchaseSpent > 0 && (
            <button onClick={clearPurchaseDraft} className="text-hex-danger hover:underline text-xs">
              Clear all
            </button>
          )}
        </div>
        <button
          onClick={handleSubmit}
          disabled={purchaseSpent === 0}
          className={clsx(
            'w-full py-3 rounded-xl font-bold text-sm tracking-widest uppercase transition-all',
            purchaseSpent > 0
              ? 'bg-hex-accent hover:bg-hex-accentHover text-white active:scale-95'
              : 'bg-hex-border text-hex-muted cursor-not-allowed'
          )}
        >
          Confirm Purchase ({purchaseSpent} pts)
        </button>
      </div>
    </div>
  );
}

interface UnitCardProps {
  def: UnitDefinition;
  quantity: number;
  remaining: number;
  onAdd: () => void;
  onRemove: () => void;
}

function UnitCard({ def, quantity, remaining, onAdd, onRemove }: UnitCardProps) {
  const color = CATEGORY_COLORS[def.category];
  const canAfford = remaining >= def.cost;

  return (
    <div className={clsx(
      'flex items-center gap-3 p-3 rounded-xl border transition-all',
      quantity > 0 ? 'border-hex-accent/40 bg-hex-accent/5' : 'border-hex-border bg-hex-panel'
    )}>
      {/* Color dot */}
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0"
        style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-hex-text text-sm">{def.name}</span>
          <span className="text-hex-warn text-xs">{def.cost} pts</span>
        </div>
        <p className="text-hex-muted text-xs truncate">{def.description}</p>
        <div className="flex gap-2 mt-1 text-xs text-hex-subtle">
          <span>HP {def.hp}</span>
          <span>ATK {def.attack}</span>
          <span>DEF {def.defense}</span>
          <span>MOV {def.movement}</span>
          <span>RNG {def.range}</span>
        </div>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onRemove}
          disabled={quantity === 0}
          className="w-7 h-7 rounded-md border border-hex-border text-hex-muted hover:border-hex-danger hover:text-hex-danger disabled:opacity-30 transition-colors flex items-center justify-center text-lg leading-none"
        >
          −
        </button>
        <span className="w-4 text-center text-hex-text font-bold">{quantity}</span>
        <button
          onClick={onAdd}
          disabled={!canAfford}
          className="w-7 h-7 rounded-md border border-hex-border text-hex-muted hover:border-hex-success hover:text-hex-success disabled:opacity-30 transition-colors flex items-center justify-center text-lg leading-none"
        >
          +
        </button>
      </div>
    </div>
  );
}
