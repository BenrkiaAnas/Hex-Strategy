import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Player } from '@/lib/types';

interface PlayerStore {
  player: Player | null;
  token: string | null;
  setPlayer: (player: Player) => void;
  setToken: (token: string) => void;
  updatePlayer: (patch: Partial<Player>) => void;
  logout: () => void;
}

export const usePlayerStore = create<PlayerStore>()(
  persist(
    (set) => ({
      player: null,
      token: null,
      setPlayer: (player) => set({ player }),
      setToken: (token) => set({ token }),
      updatePlayer: (patch) =>
        set((s) => ({ player: s.player ? { ...s.player, ...patch } : null })),
      logout: () => set({ player: null, token: null }),
    }),
    { name: 'hex-player' }
  )
);
