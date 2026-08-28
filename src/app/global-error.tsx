'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: '4rem 1.5rem',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          background: '#0b0d12',
          color: '#e6e9f1',
        }}
      >
        <div style={{ maxWidth: '40rem', marginInline: 'auto' }}>
          <p style={{ opacity: 0.7, letterSpacing: '0.08em' }}>fatal error</p>
          <h1 style={{ fontSize: '1.75rem', marginTop: '0.5rem' }}>
            The application crashed before it could render.
          </h1>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: '1.5rem',
              padding: '0.6rem 1rem',
              borderRadius: 6,
              border: '1px solid #232936',
              background: '#12151d',
              color: '#e6e9f1',
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
