export type ColorTokens = {
  surface: string;
  surface2: string;
  border: string;
  fg: string;
  fgMuted: string;
  accent: string;
  accentContrast: string;
  positive: string;
  warning: string;
  danger: string;
};

// Space-separated "R G B" triplets so `rgb(var(--rgb-*) / <alpha>)` works
// consistently with Tailwind's alpha syntax.
export type RgbTokens = {
  surface: string;
  surface2: string;
  border: string;
  fg: string;
  fgMuted: string;
  accent: string;
};

const rgbFromHex = (hex: string): string => {
  const normalized = hex.replace('#', '');
  const num = parseInt(normalized, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `${r} ${g} ${b}`;
};

const light = {
  surface: '#f7f8fb',
  surface2: '#ffffff',
  border: '#e3e6ed',
  fg: '#0f1420',
  fgMuted: '#556072',
  accent: '#5b6cff',
  accentContrast: '#ffffff',
  positive: '#0e8f5e',
  warning: '#a15c00',
  danger: '#c92a2a',
} satisfies ColorTokens;

const dark = {
  surface: '#0b0d12',
  surface2: '#12151d',
  border: '#232936',
  fg: '#e6e9f1',
  fgMuted: '#94a0b8',
  accent: '#8794ff',
  accentContrast: '#0b0d12',
  positive: '#5be4a3',
  warning: '#ffb454',
  danger: '#ff6b6b',
} satisfies ColorTokens;

export const colorTokens = { light, dark } as const;

export const rgbTokens = {
  light: {
    surface: rgbFromHex(light.surface),
    surface2: rgbFromHex(light.surface2),
    border: rgbFromHex(light.border),
    fg: rgbFromHex(light.fg),
    fgMuted: rgbFromHex(light.fgMuted),
    accent: rgbFromHex(light.accent),
  },
  dark: {
    surface: rgbFromHex(dark.surface),
    surface2: rgbFromHex(dark.surface2),
    border: rgbFromHex(dark.border),
    fg: rgbFromHex(dark.fg),
    fgMuted: rgbFromHex(dark.fgMuted),
    accent: rgbFromHex(dark.accent),
  },
} satisfies { light: RgbTokens; dark: RgbTokens };

export const radii = {
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14,
} as const;

export const spacingBase = 8;
