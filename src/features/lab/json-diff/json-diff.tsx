'use client';

import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { diffJson, type DiffEntry } from './diff';
import styles from './json-diff.module.css';

const A_DEFAULT = JSON.stringify(
  { user: { name: 'Ada', role: 'engineer' }, tags: ['react', 'ssr'] },
  null,
  2,
);
const B_DEFAULT = JSON.stringify(
  { user: { name: 'Ada', role: 'staff engineer' }, tags: ['react', 'ssr', 'next'] },
  null,
  2,
);

const tryParse = (raw: string): { ok: true; value: unknown } | { ok: false; error: string } => {
  try {
    return { ok: true, value: JSON.parse(raw) };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Invalid JSON' };
  }
};

export const JsonDiff = () => {
  const [a, setA] = useState(A_DEFAULT);
  const [b, setB] = useState(B_DEFAULT);

  const parsedA = useMemo(() => tryParse(a), [a]);
  const parsedB = useMemo(() => tryParse(b), [b]);
  const diff = useMemo(() => {
    if (!parsedA.ok || !parsedB.ok) return null;
    return diffJson(parsedA.value, parsedB.value);
  }, [parsedA, parsedB]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        <Editor
          label="Base JSON"
          value={a}
          onChange={setA}
          error={parsedA.ok ? null : parsedA.error}
        />
        <Editor
          label="Next JSON"
          value={b}
          onChange={setB}
          error={parsedB.ok ? null : parsedB.error}
        />
      </div>
      <Typography variant="h6" component="h3" sx={{ mt: 3 }}>
        Structural diff
      </Typography>
      {!diff ? (
        <Alert severity="warning" sx={{ mt: 1 }}>
          Fix the JSON errors above to see a diff.
        </Alert>
      ) : diff.length === 0 ? (
        <Alert severity="success" sx={{ mt: 1 }} variant="outlined">
          Identical.
        </Alert>
      ) : (
        <ul className={styles.diff}>{diff.map((entry, i) => renderEntry(entry, i))}</ul>
      )}
    </div>
  );
};

const Editor = ({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error: string | null;
}) => (
  <div>
    <TextField
      label={label}
      multiline
      minRows={10}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
      slotProps={{ input: { className: styles.textarea } }}
      error={!!error}
      helperText={error ?? ' '}
      spellCheck={false}
    />
  </div>
);

const renderEntry = (entry: DiffEntry, i: number) => {
  if (entry.kind === 'unchanged') return null;
  const path = entry.path || '(root)';
  if (entry.kind === 'changed') {
    return (
      <li key={i} className={`${styles.entry} ${styles.changed}`}>
        <span className={styles.op}>~</span>
        <span className={styles.path}>{path}</span>
        <span className={styles.before}>{stringify(entry.from)}</span>
        <span className={styles.arrow}>→</span>
        <span className={styles.after}>{stringify(entry.to)}</span>
      </li>
    );
  }
  const value = entry.kind === 'added' ? entry.value : entry.value;
  return (
    <li key={i} className={`${styles.entry} ${styles[entry.kind]}`}>
      <span className={styles.op}>{entry.kind === 'added' ? '+' : '-'}</span>
      <span className={styles.path}>{path}</span>
      <span className={styles.value}>{stringify(value)}</span>
    </li>
  );
};

const stringify = (value: unknown): string => {
  if (value === undefined) return 'undefined';
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
};
