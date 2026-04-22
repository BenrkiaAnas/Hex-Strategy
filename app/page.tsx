'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { UNIT_CATALOG, CATEGORY_COLORS } from '@/lib/constants';
import type { UnitCategory } from '@/lib/types';

/* ─── Floating hex background decoration ───────────────────────────────────── */

const HEX_SHAPES = [
  { size: 120, color: '#7c3aed', opacity: 0.12, top: '8%',  left: '5%',  anim: 'animate-float-a', delay: 'delay-0' },
  { size: 80,  color: '#3b82f6', opacity: 0.15, top: '15%', left: '88%', anim: 'animate-float-b', delay: 'delay-1000' },
  { size: 200, color: '#06b6d4', opacity: 0.07, top: '60%', left: '-4%', anim: 'animate-float-c', delay: 'delay-500' },
  { size: 60,  color: '#f59e0b', opacity: 0.2,  top: '75%', left: '92%', anim: 'animate-float-a', delay: 'delay-2000' },
  { size: 140, color: '#ec4899', opacity: 0.09, top: '40%', left: '94%', anim: 'animate-float-b', delay: 'delay-3000' },
  { size: 90,  color: '#7c3aed', opacity: 0.14, top: '85%', left: '20%', anim: 'animate-float-c', delay: 'delay-1500' },
  { size: 50,  color: '#10b981', opacity: 0.22, top: '30%', left: '2%',  anim: 'animate-float-a', delay: 'delay-4000' },
  { size: 170, color: '#3b82f6', opacity: 0.06, top: '55%', left: '50%', anim: 'animate-float-b', delay: 'delay-700' },
];

function HexShape({ size, color, opacity, top, left, anim, delay }: typeof HEX_SHAPES[0]) {
  const h = size;
  const w = size * 0.866;
  return (
    <div
      className={`absolute pointer-events-none ${anim} ${delay}`}
      style={{ top, left, width: w, height: h }}
    >
      <svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg" width={w} height={h}>
        <polygon
          points="50,5 95,28 95,87 50,110 5,87 5,28"
          fill={color}
          fillOpacity={opacity}
          stroke={color}
          strokeOpacity={opacity * 2.5}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

/* ─── Navbar ────────────────────────────────────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-purple-100/50 border-b border-purple-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-300/40 group-hover:scale-110 transition-transform">
            <span className="text-white text-lg leading-none">⬡</span>
          </div>
          <span className="font-black text-xl text-slate-900" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            HEX<span className="text-violet-600">ARENA</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it Works', 'Units', 'Leaderboard'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="text-slate-600 hover:text-violet-600 text-sm font-medium transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden md:block text-slate-600 hover:text-violet-600 text-sm font-semibold transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="bg-gradient-to-r from-violet-600 to-blue-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-105 transition-all active:scale-95"
          >
            Play Free
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────────────── */

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(124,58,237,0.12)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(6,182,212,0.1)_0%,transparent_60%)]" />

      {/* Grid dot pattern */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle, #7c3aed 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Floating hex shapes */}
      {HEX_SHAPES.map((s, i) => <HexShape key={i} {...s} />)}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: text */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur border border-violet-200 rounded-full px-4 py-1.5 mb-8 animate-slide-up-fade shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-semibold text-violet-700">Season 1 — Live Now</span>
            </div>

            <h1
              className="text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] mb-6 animate-slide-up-fade delay-100"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <span className="block text-slate-900">COMMAND</span>
              <span className="block gradient-text">THE HEX</span>
              <span className="block text-slate-900">BATTLEFIELD</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-lg mb-10 leading-relaxed animate-slide-up-fade delay-200">
              Real-time 2.5D multiplayer strategy. Build your army in secret,
              deploy on a hex grid, and outmaneuver your opponent in tactical
              turn-based combat.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-slide-up-fade delay-300">
              <Link
                href="/login"
                className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-violet-300/50 hover:shadow-violet-400/60 hover:scale-105 transition-all active:scale-95"
              >
                <span>Enter Arena</span>
                <span className="animate-bounce-x">→</span>
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:border-violet-300 hover:text-violet-700 hover:bg-white transition-all shadow-sm"
              >
                Watch Gameplay
                <span className="text-xl">▶</span>
              </a>
            </div>

            {/* Social proof mini */}
            <div className="mt-10 flex items-center gap-6 animate-slide-up-fade delay-400">
              <div className="flex -space-x-2">
                {['🧑‍💻','👩‍🎮','🧑‍🚀','👾','🧑‍✈️'].map((e, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-sm shadow"
                  >
                    {e}
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-500">
                <span className="font-bold text-slate-800">12,400+</span> commanders active
              </div>
            </div>
          </div>

          {/* Right: 3D-ish game preview card */}
          <div className="hidden lg:block animate-scale-in delay-300">
            <GamePreviewCard />
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 30C1200 70 900 10 600 40C300 70 100 20 0 30L0 80Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}

/* ─── Game preview card ─────────────────────────────────────────────────────── */

function GamePreviewCard() {
  return (
    <div className="relative">
      {/* Glow blob behind */}
      <div className="absolute -inset-8 bg-gradient-to-br from-violet-300/30 via-blue-300/20 to-cyan-300/30 rounded-3xl blur-3xl" />

      {/* Main card */}
      <div className="relative glass-card rounded-3xl p-6 shadow-2xl shadow-violet-200/50 animate-glow-border">
        {/* Header bar */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <div className="flex-1 bg-slate-100 rounded-md h-5 mx-2 flex items-center justify-center">
            <span className="text-xs text-slate-400 font-mono">hex-arena.gg / match</span>
          </div>
        </div>

        {/* Hex grid preview (SVG) */}
        <HexGridPreview />

        {/* Bottom HUD row */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: 'Round', value: '3 / 10', color: 'text-violet-600' },
            { label: 'Turn', value: 'YOURS', color: 'text-green-600' },
            { label: 'Units', value: '4 left', color: 'text-amber-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-50/80 rounded-xl px-3 py-2 text-center border border-slate-100">
              <div className="text-xs text-slate-400 font-medium">{label}</div>
              <div className={`text-sm font-black ${color}`} style={{ fontFamily: 'Orbitron, sans-serif' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SVG hex grid mini-preview ─────────────────────────────────────────────── */

function HexGridPreview() {
  const hexes = [
    // row 0
    { q:0,r:-2,fill:'#ede9fe',stroke:'#7c3aed' },
    { q:1,r:-2,fill:'#dbeafe',stroke:'#3b82f6' },
    { q:-1,r:-2,fill:'#ede9fe',stroke:'#7c3aed' },
    // row 1
    { q:-1,r:-1,fill:'#7c3aed',stroke:'#5b21b6', unit:'⚔', unitColor:'#fff' },
    { q:0,r:-1,fill:'#fef3c7',stroke:'#f59e0b' },
    { q:1,r:-1,fill:'#dbeafe',stroke:'#3b82f6' },
    { q:2,r:-1,fill:'#ede9fe',stroke:'#7c3aed' },
    // row 2 (middle)
    { q:-2,r:0,fill:'#fef3c7',stroke:'#f59e0b' },
    { q:-1,r:0,fill:'#ede9fe',stroke:'#7c3aed' },
    { q:0,r:0, fill:'#d1fae5',stroke:'#10b981', unit:'🛡', unitColor:'#065f46' },
    { q:1,r:0, fill:'#dbeafe',stroke:'#3b82f6' },
    { q:2,r:0, fill:'#ef4444',stroke:'#b91c1c', unit:'⚔', unitColor:'#fff' },
    // row 3
    { q:-2,r:1,fill:'#ede9fe',stroke:'#7c3aed' },
    { q:-1,r:1,fill:'#fef3c7',stroke:'#f59e0b' },
    { q:0,r:1, fill:'#dbeafe',stroke:'#3b82f6' },
    { q:1,r:1, fill:'#3b82f6',stroke:'#1d4ed8', unit:'◎', unitColor:'#fff' },
    { q:2,r:1, fill:'#ede9fe',stroke:'#7c3aed' },
    // row 4
    { q:-1,r:2,fill:'#dbeafe',stroke:'#3b82f6' },
    { q:0,r:2, fill:'#ede9fe',stroke:'#7c3aed' },
    { q:1,r:2, fill:'#fef3c7',stroke:'#f59e0b' },
  ];

  const size = 24;
  const W = 460;
  const H = 240;
  const cx = W / 2;
  const cy = H / 2 - 10;

  function hexPoly(q: number, r: number) {
    const x = cx + size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
    const y = cy + size * 1.5 * r;
    const pts = Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 30);
      return `${x + size * 0.92 * Math.cos(angle)},${y + size * 0.92 * Math.sin(angle)}`;
    }).join(' ');
    return { pts, cx: x, cy: y };
  }

  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg">
        {hexes.map((h, i) => {
          const { pts, cx: hx, cy: hy } = hexPoly(h.q, h.r);
          return (
            <g key={i}>
              <polygon points={pts} fill={h.fill} stroke={h.stroke} strokeWidth="1.5" />
              {h.unit && (
                <text
                  x={hx} y={hy + 6}
                  textAnchor="middle"
                  fontSize="14"
                  fill={h.unitColor}
                  fontFamily="system-ui"
                >
                  {h.unit}
                </text>
              )}
            </g>
          );
        })}
        {/* Turn indicator overlay */}
        <rect x="8" y="8" width="110" height="22" rx="6" fill="rgba(124,58,237,0.15)" />
        <text x="14" y="23" fontSize="10" fill="#7c3aed" fontFamily="Orbitron, monospace" fontWeight="700">
          YOUR TURN — RND 3
        </text>
        {/* HP bar example */}
        <rect x="8" y="H-28" width="80" height="8" rx="4" fill="#e2e8f0" />
        <rect x="8" y="210" width="80" height="8" rx="4" fill="#e2e8f0" />
        <rect x="8" y="210" width="52" height="8" rx="4" fill="#10b981" />
        <text x="14" y="207" fontSize="8" fill="#64748b" fontFamily="system-ui">HP</text>
      </svg>
    </div>
  );
}

/* ─── Features ───────────────────────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: '⬡',
    title: '2.5D Hex Battlefield',
    desc: 'Real Three.js isometric rendering with glowing tiles, smooth unit animations, and dynamic fog of war.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-200',
    tag: 'WebGL Powered',
  },
  {
    icon: '⚡',
    title: 'Real-Time Multiplayer',
    desc: 'WebSocket-driven live matches. Every move syncs instantly — no lag, no waiting, pure strategy.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'shadow-blue-200',
    tag: 'WebSocket',
  },
  {
    icon: '🎯',
    title: 'Hidden Purchase Phase',
    desc: 'Spend 100 points building your army in secret. Your opponent won\'t know what\'s coming until combat.',
    gradient: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-200',
    tag: 'Strategic Depth',
  },
  {
    icon: '◎',
    title: 'Fog of War',
    desc: 'Enemy units stay invisible until scouted. Use Scout units to pierce the fog and gain the upper hand.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-200',
    tag: 'Tactical Vision',
  },
  {
    icon: '🏆',
    title: 'Ranked Leaderboard',
    desc: 'Climb the global rating ladder. Every win advances your Commander rank. Every loss is a lesson.',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-200',
    tag: 'Competitive',
  },
  {
    icon: '⚔',
    title: '9 Unique Unit Types',
    desc: 'From glass-cannon Archmages to immovable Fortresses — build combos that crush any strategy.',
    gradient: 'from-indigo-500 to-violet-600',
    glow: 'shadow-indigo-200',
    tag: 'Deep Roster',
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-full px-4 py-1.5 mb-5">
            <span className="text-violet-600 text-sm font-semibold">Why Hex Arena</span>
          </div>
          <h2
            className="text-5xl font-black text-slate-900 mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            BUILT FOR <span className="gradient-text">COMMANDERS</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Every system is designed to reward deep thinking, bold bluffs, and decisive action.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-violet-200 shadow-sm hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-2xl mb-5 shadow-lg ${f.glow} group-hover:scale-110 transition-transform`}
              >
                {f.icon}
              </div>

              {/* Tag */}
              <span className="inline-block text-xs font-bold text-violet-500 bg-violet-50 rounded-full px-2 py-0.5 mb-2">
                {f.tag}
              </span>

              <h3 className="text-xl font-black text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>

              {/* Hover arrow */}
              <div className="mt-4 flex items-center gap-1 text-violet-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <span className="animate-bounce-x">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How it Works ───────────────────────────────────────────────────────────── */

const STEPS = [
  {
    number: '01',
    title: 'Create Your Account',
    desc: 'Sign up free in seconds. No credit card. Your Commander profile starts with a 1200 rating.',
    icon: '🎮',
    color: 'from-violet-500 to-purple-600',
  },
  {
    number: '02',
    title: 'Enter the Queue',
    desc: 'Hit Find Match. Our live matchmaker pairs you with an opponent of equal rating in seconds.',
    icon: '⚡',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: '03',
    title: 'Build Your Army',
    desc: 'Secretly spend 100 points on units — Offense, Defense, Support, or Special. Your opponent does the same.',
    icon: '⚔',
    color: 'from-amber-400 to-orange-500',
  },
  {
    number: '04',
    title: 'Fight for the Hex',
    desc: 'Deploy, maneuver, and outwit. Move, attack, scout, and recover. Last army standing wins.',
    icon: '🏆',
    color: 'from-emerald-500 to-teal-600',
  },
];

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-gradient-to-br from-slate-50 to-violet-50/40 py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-1.5 mb-5 shadow-sm">
            <span className="text-blue-600 text-sm font-semibold">Quick Start</span>
          </div>
          <h2
            className="text-5xl font-black text-slate-900 mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            HOW IT <span className="gradient-text">WORKS</span>
          </h2>
          <p className="text-slate-500 text-lg">From zero to battlefield in under 2 minutes.</p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-violet-200 via-blue-200 to-emerald-200" />

          <div className="grid lg:grid-cols-4 gap-8">
            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center group">
                {/* Number circle */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto mb-5 shadow-xl group-hover:scale-110 transition-transform relative z-10`}
                >
                  <span className="text-2xl">{step.icon}</span>
                </div>

                {/* Step number badge */}
                <div className="absolute top-0 right-[calc(50%-40px)] -translate-x-full -translate-y-1 bg-white border border-slate-100 rounded-full w-6 h-6 flex items-center justify-center z-20">
                  <span className="text-xs font-black text-slate-400">{step.number.slice(1)}</span>
                </div>

                <h3 className="text-lg font-black text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Unit showcase ──────────────────────────────────────────────────────────── */

const CATEGORY_META: Record<UnitCategory, { label: string; icon: string; bg: string; border: string; text: string; desc: string; sample: string[] }> = {
  offense: {
    label: 'Offense',
    icon: '⚔',
    bg: 'from-red-50 to-orange-50',
    border: 'border-red-200',
    text: 'text-red-600',
    desc: 'Fast, hard-hitting units built to delete threats before they act.',
    sample: ['Swordsman', 'Archer', 'Berserker'],
  },
  defense: {
    label: 'Defense',
    icon: '🛡',
    bg: 'from-blue-50 to-indigo-50',
    border: 'border-blue-200',
    text: 'text-blue-600',
    desc: 'Immovable walls that absorb punishment and protect your formation.',
    sample: ['Guardian', 'Fortress'],
  },
  support: {
    label: 'Support',
    icon: '✦',
    bg: 'from-emerald-50 to-teal-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    desc: 'Mobile enablers — heal allies, reveal fog, extend your tactical reach.',
    sample: ['Healer', 'Scout'],
  },
  special: {
    label: 'Special',
    icon: '◈',
    bg: 'from-violet-50 to-purple-50',
    border: 'border-violet-200',
    text: 'text-violet-600',
    desc: 'Rare glass-cannon units that can swing an entire match solo.',
    sample: ['Archmage', 'Assassin'],
  },
};

function UnitsSection() {
  const [active, setActive] = useState<UnitCategory>('offense');
  const meta = CATEGORY_META[active];
  const units = UNIT_CATALOG.filter((u) => u.category === active);

  return (
    <section id="units" className="bg-white py-28 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-full px-4 py-1.5 mb-5">
            <span className="text-amber-600 text-sm font-semibold">Unit Roster</span>
          </div>
          <h2
            className="text-5xl font-black text-slate-900 mb-4"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            CHOOSE YOUR <span className="gradient-text-warm">FORCES</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">
            9 unit types across 4 categories. Every combination creates a different strategy.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {(Object.keys(CATEGORY_META) as UnitCategory[]).map((cat) => {
            const m = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  active === cat
                    ? `bg-gradient-to-br ${m.bg} ${m.border} border-2 ${m.text} shadow-md`
                    : 'bg-slate-50 border-2 border-transparent text-slate-500 hover:bg-slate-100'
                }`}
              >
                <span className="text-base">{m.icon}</span>
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Unit cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {units.map((unit) => (
            <div
              key={unit.id}
              className={`relative bg-gradient-to-br ${meta.bg} border ${meta.border} rounded-2xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5`}
            >
              {/* Cost badge */}
              <div className={`absolute top-4 right-4 ${meta.text} font-black text-sm bg-white rounded-full px-2.5 py-1 border ${meta.border}`}>
                {unit.cost} pts
              </div>

              {/* Icon */}
              <div className="text-3xl mb-3">{meta.icon}</div>

              <h3 className="text-xl font-black text-slate-900 mb-1">{unit.name}</h3>
              <p className="text-slate-500 text-sm mb-4">{unit.description}</p>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'HP',  value: unit.hp },
                  { label: 'ATK', value: unit.attack },
                  { label: 'DEF', value: unit.defense },
                  { label: 'MOV', value: unit.movement },
                  { label: 'RNG', value: unit.range },
                  { label: 'COST', value: unit.cost },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/70 rounded-xl p-2 text-center border border-white">
                    <div className="text-xs text-slate-400 font-semibold">{label}</div>
                    <div className={`text-base font-black ${meta.text}`}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Category description */}
        <div className={`mt-8 bg-gradient-to-br ${meta.bg} border ${meta.border} rounded-2xl p-5 flex items-center gap-4`}>
          <div className="text-4xl">{meta.icon}</div>
          <div>
            <div className={`font-black text-base ${meta.text} mb-1`}>{meta.label} Strategy</div>
            <p className="text-slate-600 text-sm">{meta.desc}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────────────── */

const STATS = [
  { value: '12,400+', label: 'Active Commanders', icon: '🎮' },
  { value: '340K',    label: 'Matches Played',    icon: '⚔' },
  { value: '9',       label: 'Unique Units',       icon: '◎' },
  { value: '<2s',     label: 'Matchmaking Speed',  icon: '⚡' },
];

function StatsSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 relative overflow-hidden">
      {/* Background hexagons */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${(i / 8) * 100}%`,
              transform: `rotate(${i * 15}deg)`,
            }}
          >
            <svg width="80" height="92" viewBox="0 0 100 115">
              <polygon points="50,5 95,28 95,87 50,110 5,87 5,28" fill="none" stroke="white" strokeWidth="3" />
            </svg>
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div
                className="text-4xl font-black text-white mb-1"
                style={{ fontFamily: 'Orbitron, sans-serif', textShadow: '0 0 20px rgba(255,255,255,0.4)' }}
              >
                {s.value}
              </div>
              <div className="text-purple-200 text-sm font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Testimonials / quotes ──────────────────────────────────────────────────── */

const QUOTES = [
  {
    text: "The purchase phase is pure psychological warfare. I love it.",
    author: "Commander_Zero",
    rating: 2340,
    emoji: "🧑‍💻",
  },
  {
    text: "Nothing beats scouting a Berserker rush before it wipes your backline.",
    author: "HexQueen",
    rating: 2180,
    emoji: "👩‍🎮",
  },
  {
    text: "Fortress + Archmage combo broke my opponent's will in round 5.",
    author: "TacticalApe",
    rating: 1950,
    emoji: "🧑‍🚀",
  },
];

function QuotesSection() {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-violet-50/30 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-4xl font-black text-slate-900"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            FROM THE <span className="gradient-text">FRONTLINES</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {QUOTES.map((q) => (
            <div
              key={q.author}
              className="glass-card rounded-2xl p-6 shadow-sm hover:shadow-lg hover:shadow-violet-100 transition-all hover:-translate-y-1"
            >
              <div className="text-3xl mb-4">"</div>
              <p className="text-slate-700 text-base leading-relaxed mb-6 font-medium">
                {q.text}
              </p>
              <div className="flex items-center gap-3 border-t border-slate-100 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-blue-400 flex items-center justify-center text-xl">
                  {q.emoji}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{q.author}</div>
                  <div className="text-violet-500 text-xs font-semibold">⬡ {q.rating} rating</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Final CTA ──────────────────────────────────────────────────────────────── */

function CTASection() {
  return (
    <section className="bg-white py-28 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Big hex icon */}
        <div className="relative inline-flex items-center justify-center mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-300/40 to-blue-300/40 rounded-full blur-3xl scale-150" />
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center shadow-2xl shadow-violet-300/50 animate-pulse-ring">
            <span className="text-white text-5xl">⬡</span>
          </div>
        </div>

        <h2
          className="text-6xl font-black text-slate-900 mb-4 leading-tight"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          READY TO <span className="gradient-text">COMMAND?</span>
        </h2>
        <p className="text-slate-500 text-xl mb-10 max-w-lg mx-auto leading-relaxed">
          Join 12,400+ commanders. Free forever. No downloads. Just open your browser and fight.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/login"
            className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-violet-300/60 hover:shadow-violet-400/70 hover:scale-105 transition-all active:scale-95"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            ENTER ARENA
            <span className="text-2xl animate-bounce-x">→</span>
          </Link>
        </div>

        <p className="mt-6 text-slate-400 text-sm">No credit card · No install · Instant matchmaking</p>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 flex items-center justify-center">
              <span className="text-white">⬡</span>
            </div>
            <span className="font-black text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              HEX<span className="text-violet-400">ARENA</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            {['Privacy', 'Terms', 'Support', 'Discord', 'GitHub'].map((link) => (
              <a key={link} href="#" className="hover:text-white transition-colors">
                {link}
              </a>
            ))}
          </div>

          <p className="text-sm text-slate-500">© 2025 Hex Arena. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ────────────────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="landing-body min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UnitsSection />
      <StatsSection />
      <QuotesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
