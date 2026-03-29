/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        'nf-bg': '#0a0a0f',
        'nf-surface': '#111118',
        'nf-surface2': '#16161f',
        'nf-surface3': '#1c1c28',
        'nf-border': '#2a2a38',
        'nf-border2': '#3a3a4a',
        'nf-purple': '#7c6fff',
        'nf-pink': '#ff6b9d',
        'nf-teal': '#00d4a8',
        'nf-amber': '#f59e0b',
      },
    },
  },
  plugins: [],
}
