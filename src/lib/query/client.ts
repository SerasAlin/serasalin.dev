import { QueryClient } from '@tanstack/react-query';

export const makeQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        // Server Components already fetch on the server; client refetches are
        // opt-in per hook. Keep responses fresh for 30s to avoid double-fetches
        // right after hydration.
        staleTime: 30_000,
        gcTime: 5 * 60_000,
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
