'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiLogin, apiRegister } from '@/services/api';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function LoginPage() {
  const router = useRouter();
  const { setPlayer, setToken } = usePlayerStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fn = mode === 'login' ? apiLogin : apiRegister;
      const { token, player } = await fn(username, password);
      setToken(token);
      setPlayer(player);
      router.push('/lobby');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-hex-bg px-4">
      {/* Background grid decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle, #3b82f6 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-hex-accent/10 border border-hex-accent/30 mb-4">
            <span className="text-3xl">⬡</span>
          </div>
          <h1 className="font-mono text-3xl font-bold text-hex-text tracking-widest uppercase">
            Hex Arena
          </h1>
          <p className="text-hex-muted text-sm mt-1">Multiplayer Strategy</p>
        </div>

        {/* Card */}
        <div className="bg-hex-panel border border-hex-border rounded-2xl p-8">
          {/* Tab toggle */}
          <div className="flex bg-hex-bg rounded-lg p-1 mb-6">
            {(['login', 'register'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-1.5 rounded-md text-sm font-mono font-semibold capitalize transition-all ${
                  mode === m
                    ? 'bg-hex-panel text-hex-text shadow'
                    : 'text-hex-muted hover:text-hex-subtle'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-hex-muted mb-1 font-mono uppercase tracking-widest">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                className="w-full bg-hex-bg border border-hex-border rounded-lg px-3 py-2.5 text-hex-text font-mono text-sm focus:border-hex-accent focus:outline-none transition-colors"
                placeholder="commander_one"
              />
            </div>

            <div>
              <label className="block text-xs text-hex-muted mb-1 font-mono uppercase tracking-widest">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-hex-bg border border-hex-border rounded-lg px-3 py-2.5 text-hex-text font-mono text-sm focus:border-hex-accent focus:outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-hex-danger text-xs font-mono bg-hex-danger/10 border border-hex-danger/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-hex-accent hover:bg-hex-accentHover disabled:opacity-60 text-white font-mono font-bold text-sm tracking-widest uppercase transition-all active:scale-95 mt-2"
            >
              {loading ? 'Loading…' : mode === 'login' ? 'Enter Arena' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
