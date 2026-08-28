import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/features/**/*.{ts,tsx}',
  ],
  corePlugins: {
    // MUI owns component-level styling; disable Tailwind's preflight reset so
    // it doesn't fight MUI's CssBaseline.
    preflight: false,
  },
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Semantic tokens that read CSS variables written by the MUI theme.
        surface: 'rgb(var(--rgb-surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--rgb-surface-2) / <alpha-value>)',
        border: 'rgb(var(--rgb-border) / <alpha-value>)',
        fg: 'rgb(var(--rgb-fg) / <alpha-value>)',
        'fg-muted': 'rgb(var(--rgb-fg-muted) / <alpha-value>)',
        accent: 'rgb(var(--rgb-accent) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};

export default config;
