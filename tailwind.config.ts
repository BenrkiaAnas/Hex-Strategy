import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ── Game UI (dark theme) ──────────────────────────────────────────────
      colors: {
        hex: {
          bg:          '#0a0e1a',
          panel:       '#111827',
          border:      '#1f2937',
          accent:      '#3b82f6',
          accentHover: '#2563eb',
          success:     '#10b981',
          danger:      '#ef4444',
          warn:        '#f59e0b',
          muted:       '#6b7280',
          text:        '#f9fafb',
          subtle:      '#9ca3af',
        },
      },

      // ── Typography ────────────────────────────────────────────────────────
      fontFamily: {
        mono:    ['JetBrains Mono', 'Courier New', 'monospace'],
        display: ['Orbitron', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },

      // ── Animations ────────────────────────────────────────────────────────
      animation: {
        'pulse-slow':     'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':        'fadeIn 0.3s ease-in-out',
        'slide-up':       'slideUp 0.3s ease-out',
        'spin-slow':      'spin 18s linear infinite',
        'bounce-x':       'bounceX 1.2s ease-in-out infinite',
        'glow-border':    'glowBorder 2.5s ease-in-out infinite',
        'float-a':        'floatA 6s ease-in-out infinite',
        'float-b':        'floatB 8s ease-in-out infinite',
        'float-c':        'floatC 7s ease-in-out infinite',
        'slide-up-fade':  'slideUpFade 0.7s ease-out forwards',
        'scale-in':       'scaleIn 0.5s ease-out forwards',
        'pulse-ring':     'pulseRing 2s ease-out infinite',
      },

      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { transform: 'translateY(10px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        bounceX:     { '0%,100%': { transform: 'translateX(0)' }, '50%': { transform: 'translateX(6px)' } },
        glowBorder:  {
          '0%,100%': { boxShadow: '0 0 12px rgba(124,58,237,0.3), 0 0 24px rgba(59,130,246,0.15)' },
          '50%':      { boxShadow: '0 0 24px rgba(124,58,237,0.6), 0 0 48px rgba(59,130,246,0.3)' },
        },
        floatA: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '33%':     { transform: 'translateY(-22px) rotate(8deg) scale(1.05)' },
          '66%':     { transform: 'translateY(-10px) rotate(-5deg) scale(0.97)' },
        },
        floatB: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%':     { transform: 'translateY(-30px) rotate(-12deg)' },
        },
        floatC: {
          '0%,100%': { transform: 'translateY(0) rotate(0deg) scale(1)' },
          '40%':     { transform: 'translateY(-16px) rotate(6deg) scale(1.08)' },
          '80%':     { transform: 'translateY(-28px) rotate(-8deg) scale(0.95)' },
        },
        slideUpFade: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.85)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(124,58,237,0.4)' },
          '70%':  { transform: 'scale(1)',    boxShadow: '0 0 0 18px rgba(124,58,237,0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(124,58,237,0)' },
        },
      },

      // ── Shadows ───────────────────────────────────────────────────────────
      boxShadow: {
        'glow-violet': '0 0 24px rgba(124, 58, 237, 0.4)',
        'glow-blue':   '0 0 24px rgba(59, 130, 246, 0.4)',
        'glow-amber':  '0 0 24px rgba(245, 158, 11, 0.4)',
      },

      // ── Background patterns ───────────────────────────────────────────────
      backgroundImage: {
        'gradient-landing':  'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 50%, #ecfeff 100%)',
        'gradient-brand':    'linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%)',
        'gradient-warm':     'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
