import { create } from 'zustand';
import type { MatchState, Unit, CombatResult, HexCoord, MatchPhase } from '@/lib/types';

interface MatchStore {
  match: MatchState | null;
  // Setters
  setMatch: (match: MatchState) => void;
  setPhase: (phase: MatchPhase) => void;
  setCurrentTurn: (playerId: string) => void;
  upsertUnit: (unit: Unit) => void;
  removeUnit: (unitId: string) => void;
  setVisibleTiles: (tiles: HexCoord[]) => void;
  applyStateUpdate: (patch: Partial<MatchState>) => void;
  applyStateUpdateUnits: (units: Record<string, Unit>) => void;
  setLastCombat: (result: CombatResult | null) => void;
  setWinner: (winnerId: string) => void;
  clearMatch: () => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
  match: null,

  setMatch: (match) => set({ match }),

  setPhase: (phase) =>
    set((s) => ({ match: s.match ? { ...s.match, phase } : null })),

  setCurrentTurn: (playerId) =>
    set((s) =>
      s.match ? { match: { ...s.match, currentTurn: playerId } } : {}
    ),

  upsertUnit: (unit) =>
    set((s) => {
      if (!s.match) return {};
      return {
        match: {
          ...s.match,
          units: { ...s.match.units, [unit.id]: unit },
        },
      };
    }),

  removeUnit: (unitId) =>
    set((s) => {
      if (!s.match) return {};
      const units = { ...s.match.units };
      delete units[unitId];
      return { match: { ...s.match, units } };
    }),

  setVisibleTiles: (tiles) =>
    set((s) =>
      s.match ? { match: { ...s.match, visibleTiles: tiles } } : {}
    ),

  applyStateUpdate: (patch) =>
    set((s) =>
      s.match ? { match: { ...s.match, ...patch } } : {}
    ),

  applyStateUpdateUnits: (units) =>
    set((s) =>
      s.match ? { match: { ...s.match, units } } : {}
    ),

  setLastCombat: (lastCombat) =>
    set((s) =>
      s.match ? { match: { ...s.match, lastCombat } } : {}
    ),

  setWinner: (winnerId) =>
    set((s) =>
      s.match ? { match: { ...s.match, winnerId } } : {}
    ),

  clearMatch: () => set({ match: null }),
}));
