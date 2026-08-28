'use client';

import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import styles from './jwt-inspector.module.css';

type Decoded = {
  header: unknown;
  payload: unknown;
  signature: string;
};

const base64UrlDecode = (segment: string): string => {
  const pad = segment.length % 4 === 0 ? '' : '='.repeat(4 - (segment.length % 4));
  const b64 = segment.replace(/-/g, '+').replace(/_/g, '/') + pad;
  if (typeof window === 'undefined') {
    return Buffer.from(b64, 'base64').toString('utf-8');
  }
  try {
    return decodeURIComponent(
      atob(b64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(''),
    );
  } catch {
    return atob(b64);
  }
};

const decode = (token: string): { ok: true; value: Decoded } | { ok: false; error: string } => {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { ok: false, error: 'A JWT must have three dot-separated segments.' };
  }
  try {
    const header = JSON.parse(base64UrlDecode(parts[0]!));
    const payload = JSON.parse(base64UrlDecode(parts[1]!));
    return { ok: true, value: { header, payload, signature: parts[2]! } };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Failed to parse token.' };
  }
};

const EXAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const JwtInspector = () => {
  const [token, setToken] = useState(EXAMPLE);
  const result = useMemo(() => (token.trim() ? decode(token) : null), [token]);

  return (
    <div className={styles.wrapper}>
      <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
        Decoding a token does not verify its authenticity. This tool never sends your input to the
        server.
      </Alert>
      <TextField
        label="JWT"
        multiline
        minRows={3}
        fullWidth
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="paste a token here"
        spellCheck={false}
        slotProps={{ input: { className: styles.input } }}
      />
      {result === null ? (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Waiting for input…
        </Typography>
      ) : result.ok ? (
        <div className={styles.grid}>
          <Panel title="Header" body={JSON.stringify(result.value.header, null, 2)} tone="accent" />
          <Panel title="Payload" body={JSON.stringify(result.value.payload, null, 2)} tone="ok" />
          <Panel title="Signature" body={result.value.signature} tone="muted" />
        </div>
      ) : (
        <Alert severity="error" sx={{ mt: 2 }}>
          {result.error}
        </Alert>
      )}
    </div>
  );
};

const Panel = ({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: 'accent' | 'ok' | 'muted';
}) => (
  <div className={`${styles.panel} ${styles[tone]}`}>
    <Typography variant="overline" color="text.secondary">
      {title}
    </Typography>
    <pre className={styles.pre}>
      <code>{body}</code>
    </pre>
  </div>
);
