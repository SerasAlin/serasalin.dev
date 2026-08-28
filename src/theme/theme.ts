import { createTheme, type ThemeOptions } from '@mui/material/styles';
import { colorTokens, radii, rgbTokens, spacingBase } from './tokens';

const sharedTypography: ThemeOptions['typography'] = {
  fontFamily: 'var(--font-sans)',
  fontSize: 14,
  htmlFontSize: 16,
  h1: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 },
  h2: { fontWeight: 700, letterSpacing: '-0.015em', lineHeight: 1.15 },
  h3: { fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2 },
  h4: { fontWeight: 600, lineHeight: 1.25 },
  h5: { fontWeight: 600, lineHeight: 1.3 },
  h6: { fontWeight: 600, lineHeight: 1.35 },
  body1: { lineHeight: 1.6 },
  body2: { lineHeight: 1.55 },
  button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  overline: { letterSpacing: '0.08em', fontWeight: 600 },
};

export const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-mui-color-scheme',
    cssVarPrefix: 'app',
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: colorTokens.light.accent, contrastText: colorTokens.light.accentContrast },
        secondary: { main: '#8b5cf6' },
        error: { main: colorTokens.light.danger },
        warning: { main: colorTokens.light.warning },
        success: { main: colorTokens.light.positive },
        background: {
          default: colorTokens.light.surface,
          paper: colorTokens.light.surface2,
        },
        text: {
          primary: colorTokens.light.fg,
          secondary: colorTokens.light.fgMuted,
        },
        divider: colorTokens.light.border,
      },
    },
    dark: {
      palette: {
        primary: { main: colorTokens.dark.accent, contrastText: colorTokens.dark.accentContrast },
        secondary: { main: '#c084fc' },
        error: { main: colorTokens.dark.danger },
        warning: { main: colorTokens.dark.warning },
        success: { main: colorTokens.dark.positive },
        background: {
          default: colorTokens.dark.surface,
          paper: colorTokens.dark.surface2,
        },
        text: {
          primary: colorTokens.dark.fg,
          secondary: colorTokens.dark.fgMuted,
        },
        divider: colorTokens.dark.border,
      },
    },
  },
  typography: sharedTypography,
  spacing: spacingBase,
  shape: { borderRadius: radii.md },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root, [data-mui-color-scheme="light"]': {
          '--rgb-surface': rgbTokens.light.surface,
          '--rgb-surface-2': rgbTokens.light.surface2,
          '--rgb-border': rgbTokens.light.border,
          '--rgb-fg': rgbTokens.light.fg,
          '--rgb-fg-muted': rgbTokens.light.fgMuted,
          '--rgb-accent': rgbTokens.light.accent,
        },
        '[data-mui-color-scheme="dark"]': {
          '--rgb-surface': rgbTokens.dark.surface,
          '--rgb-surface-2': rgbTokens.dark.surface2,
          '--rgb-border': rgbTokens.dark.border,
          '--rgb-fg': rgbTokens.dark.fg,
          '--rgb-fg-muted': rgbTokens.dark.fgMuted,
          '--rgb-accent': rgbTokens.dark.accent,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: radii.md } },
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: 'none' } },
    },
    MuiTooltip: {
      defaultProps: { arrow: true },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
    },
  },
});
