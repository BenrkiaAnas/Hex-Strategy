// ─── Coordinates ────────────────────────────────────────────────────────────

export interface HexCoord {
  q: number;
  r: number;
}

// ─── Unit Domain ─────────────────────────────────────────────────────────────

export type UnitCategory = 'offense' | 'defense' | 'support' | 'special';
export type ActionType = 'move' | 'attack' | 'recover' | 'scout';

export interface UnitDefinition {
  id: string;
  name: string;
  category: UnitCategory;
  cost: number;
  hp: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
  description: string;
}

export interface Unit {
  id: string;
  definitionId: string;
  name: string;
  category: UnitCategory;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  movement: number;
  range: number;
  position: HexCoord | null;
  playerId: string;
  hasActed: boolean;
  hasMoved: boolean;
}

// ─── Player ───────────────────────────────────────────────────────────────────

export interface Player {
  id: string;
  username: string;
  rating: number;
  isReady: boolean;
  purchasePoints: number;
}

// ─── Match ────────────────────────────────────────────────────────────────────

export type MatchPhase = 'lobby' | 'purchase' | 'deploy' | 'battle' | 'end';

export interface CombatResult {
  attackerId: string;
  defenderId: string;
  damage: number;
  counterDamage: number;
  attackerDied: boolean;
  defenderDied: boolean;
}

export interface MatchState {
  id: string;
  phase: MatchPhase;
  currentTurn: string;
  roundNumber: number;
  players: Record<string, Player>;
  units: Record<string, Unit>;
  visibleTiles: HexCoord[];
  lastCombat: CombatResult | null;
  winnerId: string | null;
}

// ─── UI Selection ─────────────────────────────────────────────────────────────

export interface SelectedUnitState {
  unitId: string;
  availableActions: ActionType[];
  reachableTiles: HexCoord[];
  attackableTiles: HexCoord[];
}

// ─── WebSocket ───────────────────────────────────────────────────────────────

export type WSEventName =
  | 'match_found'
  | 'match_start'
  | 'purchase_reveal'
  | 'state_update'
  | 'turn_change'
  | 'combat_result'
  | 'match_end'
  | 'error'
  | 'connected'
  | 'disconnected';

export interface WSMessage {
  event: WSEventName;
  data: unknown;
}

// ─── API ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string;
  player: Player;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  username: string;
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
}

// ─── Purchase ────────────────────────────────────────────────────────────────

export interface PurchaseItem {
  definitionId: string;
  quantity: number;
}
