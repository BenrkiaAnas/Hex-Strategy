import type { UnitDefinition } from './types';

export const HEX_SIZE = 1.1;
export const HEX_HEIGHT = 0.18;
export const GRID_RADIUS = 4;
export const PURCHASE_BUDGET = 100;

export const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:4000';
export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const CATEGORY_COLORS: Record<string, string> = {
  offense: '#ef4444',
  defense: '#3b82f6',
  support: '#10b981',
  special: '#a855f7',
};

export const CATEGORY_HEX_COLORS: Record<string, number> = {
  offense: 0xef4444,
  defense: 0x3b82f6,
  support: 0x10b981,
  special: 0xa855f7,
};

export const UNIT_CATALOG: UnitDefinition[] = [
  // Offense
  {
    id: 'swordsman',
    name: 'Swordsman',
    category: 'offense',
    cost: 15,
    hp: 80,
    attack: 30,
    defense: 10,
    movement: 3,
    range: 1,
    description: 'Fast melee fighter with high attack.',
  },
  {
    id: 'archer',
    name: 'Archer',
    category: 'offense',
    cost: 20,
    hp: 60,
    attack: 25,
    defense: 5,
    movement: 2,
    range: 3,
    description: 'Ranged unit, weak in close combat.',
  },
  {
    id: 'berserker',
    name: 'Berserker',
    category: 'offense',
    cost: 30,
    hp: 100,
    attack: 45,
    defense: 5,
    movement: 2,
    range: 1,
    description: 'Devastating damage but fragile.',
  },
  // Defense
  {
    id: 'guardian',
    name: 'Guardian',
    category: 'defense',
    cost: 20,
    hp: 150,
    attack: 10,
    defense: 40,
    movement: 1,
    range: 1,
    description: 'Tanky frontliner that protects allies.',
  },
  {
    id: 'fortress',
    name: 'Fortress',
    category: 'defense',
    cost: 35,
    hp: 200,
    attack: 5,
    defense: 60,
    movement: 1,
    range: 1,
    description: 'Immovable wall; locks down a zone.',
  },
  // Support
  {
    id: 'healer',
    name: 'Healer',
    category: 'support',
    cost: 20,
    hp: 50,
    attack: 5,
    defense: 5,
    movement: 2,
    range: 2,
    description: 'Recovers HP on adjacent allies each turn.',
  },
  {
    id: 'scout',
    name: 'Scout',
    category: 'support',
    cost: 15,
    hp: 40,
    attack: 8,
    defense: 5,
    movement: 4,
    range: 1,
    description: 'Reveals hidden tiles; high mobility.',
  },
  // Special
  {
    id: 'mage',
    name: 'Archmage',
    category: 'special',
    cost: 40,
    hp: 55,
    attack: 50,
    defense: 5,
    movement: 2,
    range: 4,
    description: 'Long-range area damage; glass cannon.',
  },
  {
    id: 'assassin',
    name: 'Assassin',
    category: 'special',
    cost: 35,
    hp: 60,
    attack: 55,
    defense: 8,
    movement: 4,
    range: 1,
    description: 'Ignores enemy defense on first strike.',
  },
];
