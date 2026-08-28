'use client';

import Button from '@mui/material/Button';
import { useCommandPalette } from '../store';
import styles from './command-palette-trigger.module.css';

export const CommandPaletteTrigger = () => {
  const openPalette = useCommandPalette((s) => s.openPalette);
  return (
    <Button
      variant="outlined"
      color="inherit"
      size="small"
      onClick={openPalette}
      aria-label="Open command palette"
      className={styles.trigger}
    >
      <span className={styles.label}>Search…</span>
      <kbd className={styles.kbd}>⌘K</kbd>
    </Button>
  );
};
