'use client';

import { useEffect } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with an observability sink (Sentry.captureException, etc.).
    console.error('Route error:', error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-4 px-6 py-16">
      <Typography variant="overline" color="error">
        Something went wrong
      </Typography>
      <Typography variant="h3" component="h1">
        This part of the app failed to render.
      </Typography>
      <Typography color="text.secondary">
        The rest of the site is unaffected. You can retry, or navigate elsewhere.
      </Typography>
      {process.env.NODE_ENV === 'development' && error.message ? (
        <pre className="max-w-full overflow-auto rounded-md border border-border bg-surface-2 p-3 text-xs">
          {error.message}
          {error.digest ? `\ndigest: ${error.digest}` : ''}
        </pre>
      ) : null}
      <Button onClick={() => reset()} variant="contained">
        Try again
      </Button>
    </main>
  );
}
