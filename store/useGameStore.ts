import { create } from 'zustand';
import type { HexCoord, SelectedUnitState, ActionType } from '@/lib/types';

type GameMode = 'idle' | 'move' | 'attack' | 'scout';

interface GameStore {
  // Camera
  cameraTarget: [number, number, number];
  setCameraTarget: (target: [number, number, number]) => void;

  // Tile interaction
  hoveredTile: HexCoord | null;
  setHoveredTile: (tile: HexCoord | null) => void;

  // Unit selection
  selectedUnit: SelectedUnitState | null;
  selectUnit: (state: SelectedUnitState | null) => void;

  // Active action mode (what click on a tile does)
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  activeAction: ActionType | null;
  setActiveAction: (action: ActionType | null) => void;

  // Pending action target (awaiting confirmation)
  pendingTarget: HexCoord | null;
  setPendingTarget: (tile: HexCoord | null) => void;

  // Overlay flags
  showFog: boolean;
  toggleFog: () => void;

  // Purchase UI
  purchaseDraft: Record<string, number>; // definitionId → quantity
  addToPurchase: (defId: string, cost: number, budget: number) => void;
  removeFromPurchase: (defId: string, cost: number) => void;
  purchaseSpent: number;
  clearPurchaseDraft: () => void;

  // Match search status
  matchmakingStatus: 'idle' | 'searching' | 'found';
  setMatchmakingStatus: (s: 'idle' | 'searching' | 'found') => void;

  // Combat animation
  combatAnimation: { attackerId: string; defenderId: string } | null;
  setCombatAnimation: (anim: { attackerId: string; defenderId: string } | null) => void;
}

export const useGameStore = create<GameStore>((set) => ({
  cameraTarget: [0, 0, 0],
  setCameraTarget: (cameraTarget) => set({ cameraTarget }),

  hoveredTile: null,
  setHoveredTile: (hoveredTile) => set({ hoveredTile }),

  selectedUnit: null,
  selectUnit: (selectedUnit) =>
    set({ selectedUnit, gameMode: 'idle', activeAction: null, pendingTarget: null }),

  gameMode: 'idle',
  setGameMode: (gameMode) => set({ gameMode }),

  activeAction: null,
  setActiveAction: (activeAction) => set({ activeAction }),

  pendingTarget: null,
  setPendingTarget: (pendingTarget) => set({ pendingTarget }),

  showFog: true,
  toggleFog: () => set((s) => ({ showFog: !s.showFog })),

  purchaseDraft: {},
  purchaseSpent: 0,
  addToPurchase: (defId, cost, budget) =>
    set((s) => {
      if (s.purchaseSpent + cost > budget) return {};
      const draft = { ...s.purchaseDraft };
      draft[defId] = (draft[defId] ?? 0) + 1;
      return { purchaseDraft: draft, purchaseSpent: s.purchaseSpent + cost };
    }),
  removeFromPurchase: (defId, cost) =>
    set((s) => {
      if (!s.purchaseDraft[defId]) return {};
      const draft = { ...s.purchaseDraft };
      draft[defId] -= 1;
      if (draft[defId] <= 0) delete draft[defId];
      return { purchaseDraft: draft, purchaseSpent: Math.max(0, s.purchaseSpent - cost) };
    }),
  clearPurchaseDraft: () => set({ purchaseDraft: {}, purchaseSpent: 0 }),

  matchmakingStatus: 'idle',
  setMatchmakingStatus: (matchmakingStatus) => set({ matchmakingStatus }),

  combatAnimation: null,
  setCombatAnimation: (combatAnimation) => set({ combatAnimation }),
}));
