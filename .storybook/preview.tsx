import type { Preview } from '@storybook/react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { theme } from '../src/theme/theme';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
    layout: 'centered',
    a11y: { config: {}, options: {} },
  },
  decorators: [
    withThemeFromJSXProvider({
      themes: { light: theme, dark: theme },
      defaultTheme: 'dark',
      Provider: ThemeProvider,
      GlobalStyles: CssBaseline,
    }),
  ],
};

export default preview;
