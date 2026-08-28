'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState, type ReactNode } from 'react';
import { theme } from '@/theme/theme';
import { makeQueryClient } from '@/lib/query/client';
import { useThemeMode } from '@/features/theme/store';

const ModeSync = () => {
  const mode = useThemeMode((s) => s.mode);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const apply = () =>
        root.setAttribute('data-mui-color-scheme', media.matches ? 'dark' : 'light');
      apply();
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
    root.setAttribute('data-mui-color-scheme', mode);
    return undefined;
  }, [mode]);
  return null;
};

export const Providers = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => makeQueryClient());
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme} defaultMode="system">
        <CssBaseline />
        <ModeSync />
        <QueryClientProvider client={queryClient}>
          {children}
          {process.env.NODE_ENV === 'development' ? (
            <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
          ) : null}
        </QueryClientProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};
