/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tantrik: {
          bg: '#0a0005',
          gold: '#c8960c',
          red: '#8b0000',
          fire: '#ff6b35',
          parchment: '#f5e6c8',
          stone: '#7a6a5a',
          obsidian: 'rgba(20, 8, 25, 0.85)',
        }
      },
      fontFamily: {
        display: ['"Yatra One"', 'serif'],
        body: ['"Crimson Pro"', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(200, 150, 12, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(200, 150, 12, 0.6)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
