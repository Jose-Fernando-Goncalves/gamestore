/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#07070a',
          800: '#0b0b11',
          700: '#101019',
          600: '#16161f',
          500: '#1d1d2a',
        },
        acid: {
          DEFAULT: '#d6ff3f',
          dim: '#a9cc2f',
          glow: '#e8ff80',
        },
        signal: '#ff5a36',
        chrome: '#9aa0b4',
      },
      fontFamily: {
        display: ['Unbounded', 'system-ui', 'sans-serif'],
        body: ['Sora', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        pixel: ['"Press Start 2P"', 'ui-monospace', 'monospace'],
        crt: ['VT323', 'ui-monospace', 'monospace'],
        heraldic: ['"Cinzel Decorative"', 'Georgia', 'serif'],
        medieval: ['Cinzel', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1.08) translate(0,0)' },
          '100%': { transform: 'scale(1.18) translate(-1.5%, -1.5%)' },
        },
        'marquee': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'rise': {
          '0%': { opacity: '0', transform: 'translateY(28px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '94%': { opacity: '0.55' },
          '96%': { opacity: '1' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(214,255,63,0.5)' },
          '100%': { boxShadow: '0 0 0 14px rgba(214,255,63,0)' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 12s ease-out forwards',
        'marquee': 'marquee 28s linear infinite',
        'rise': 'rise 0.7s cubic-bezier(0.22,1,0.36,1) forwards',
        'flicker': 'flicker 6s linear infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
}
