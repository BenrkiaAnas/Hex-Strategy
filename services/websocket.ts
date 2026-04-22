import type { WSEventName, WSMessage } from '@/lib/types';

type Listener = (data: unknown) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private listeners: Map<WSEventName, Listener[]> = new Map();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private url = '';
  private token = '';
  private shouldReconnect = false;

  connect(url: string, token: string): void {
    this.url = url;
    this.token = token;
    this.shouldReconnect = true;
    this._open();
  }

  private _open(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(`${this.url}?token=${this.token}`);

    this.ws.onopen = () => {
      this._emit('connected', null);
    };

    this.ws.onmessage = (ev) => {
      try {
        const msg: WSMessage = JSON.parse(ev.data as string);
        this._emit(msg.event, msg.data);
      } catch {
        // ignore malformed frames
      }
    };

    this.ws.onclose = () => {
      this._emit('disconnected', null);
      if (this.shouldReconnect) {
        this.reconnectTimer = setTimeout(() => this._open(), 3000);
      }
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  disconnect(): void {
    this.shouldReconnect = false;
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
  }

  send(event: string, data: unknown): void {
    if (this.ws?.readyState !== WebSocket.OPEN) {
      console.warn('[WS] Not connected; dropping:', event);
      return;
    }
    this.ws.send(JSON.stringify({ event, data }));
  }

  on(event: WSEventName, callback: Listener): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)!.push(callback);
    return () => this.off(event, callback);
  }

  off(event: WSEventName, callback: Listener): void {
    const arr = this.listeners.get(event);
    if (!arr) return;
    const idx = arr.indexOf(callback);
    if (idx !== -1) arr.splice(idx, 1);
  }

  private _emit(event: WSEventName, data: unknown): void {
    this.listeners.get(event)?.forEach((fn) => fn(data));
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton – import this object everywhere
export const wsService = new WebSocketService();

// ─── Typed send helpers ───────────────────────────────────────────────────────

export const sendReady = () => wsService.send('ready', {});

export const sendPurchaseSubmit = (items: { definitionId: string; quantity: number }[]) =>
  wsService.send('purchase_submit', { items });

export const sendDeployUnit = (unitId: string, q: number, r: number) =>
  wsService.send('deploy_unit', { unitId, q, r });

export const sendMoveUnit = (unitId: string, q: number, r: number) =>
  wsService.send('move_unit', { unitId, q, r });

export const sendAttackUnit = (attackerId: string, targetId: string) =>
  wsService.send('attack_unit', { attackerId, targetId });

export const sendEndTurn = () => wsService.send('end_turn', {});
