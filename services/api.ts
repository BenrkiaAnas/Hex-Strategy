import { API_BASE } from '@/lib/constants';
import type { LoginResponse, LeaderboardEntry, Player } from '@/lib/types';

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((err as { message: string }).message ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const apiLogin = (username: string, password: string): Promise<LoginResponse> =>
  request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const apiRegister = (username: string, password: string): Promise<LoginResponse> =>
  request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

// ─── Profile ─────────────────────────────────────────────────────────────────

export const apiGetProfile = (token: string): Promise<Player> =>
  request('/profile', {}, token);

export const apiUpdateProfile = (token: string, patch: Partial<Player>): Promise<Player> =>
  request('/profile', { method: 'PATCH', body: JSON.stringify(patch) }, token);

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export const apiGetLeaderboard = (token: string): Promise<LeaderboardEntry[]> =>
  request('/leaderboard', {}, token);

// ─── Shop (optional) ─────────────────────────────────────────────────────────

export const apiGetShopItems = (token: string) =>
  request('/shop/items', {}, token);

export const apiPurchaseShopItem = (token: string, itemId: string) =>
  request('/shop/purchase', { method: 'POST', body: JSON.stringify({ itemId }) }, token);
