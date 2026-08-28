'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTerminalStore } from '../store';
import { useThemeMode } from '@/features/theme/store';
import { commandRegistry, findCommand } from '../commands';
import { blank, line, text } from '../lib/line';
import { parseInput } from '../lib/parse';
import { complete } from '../lib/autocomplete';
import type { TerminalLine } from '../types';
import { TerminalLineRenderer } from './terminal-line';
import styles from './terminal.module.css';

const bootLines = (): TerminalLine[] => [
  line([text('serasalin.dev — interactive shell', 'accent')], 'system'),
  line(
    [text('Type `help` to see commands. `Cmd/Ctrl+K` opens the command palette.', 'muted')],
    'system',
  ),
  blank(),
];

export const Terminal = () => {
  const router = useRouter();
  const setTheme = useThemeMode((s) => s.setMode);
  const cycleTheme = useThemeMode((s) => s.cycle);

  const lines = useTerminalStore((s) => s.lines);
  const history = useTerminalStore((s) => s.history);
  const historyIndex = useTerminalStore((s) => s.historyIndex);
  const focused = useTerminalStore((s) => s.focused);

  const append = useTerminalStore((s) => s.append);
  const appendMany = useTerminalStore((s) => s.appendMany);
  const clear = useTerminalStore((s) => s.clear);
  const pushHistory = useTerminalStore((s) => s.pushHistory);
  const setHistoryIndex = useTerminalStore((s) => s.setHistoryIndex);
  const releaseFocus = useTerminalStore((s) => s.releaseFocus);

  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLLabelElement>(null);
  const bootedRef = useRef(false);

  useEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;
    appendMany(bootLines());
  }, [appendMany]);

  useEffect(() => {
    if (focused) {
      inputRef.current?.focus();
      releaseFocus();
    }
  }, [focused, releaseFocus]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: 'smooth' });
  }, [lines.length]);

  const runCommand = async (raw: string) => {
    const parsed = parseInput(raw);
    append(line([text('$ ', 'accent'), text(raw)], 'input'));
    if (!parsed) return;
    pushHistory(parsed.raw);
    const cmd = findCommand(parsed.name);
    if (!cmd) {
      append(line([text(`command not found: ${parsed.name}`, 'danger')], 'error'));
      append(line([text('Type `help` to see available commands.', 'muted')]));
      return;
    }
    try {
      const output = await cmd.run({
        args: parsed.args,
        raw: parsed.raw,
        now: new Date(),
        navigate: (href) => router.push(href),
        toggleTheme: cycleTheme,
        setTheme,
        clear,
        print: (batch) => appendMany(batch),
        commands: commandRegistry,
      });
      if (output.length > 0) appendMany(output);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      append(line([text(`error: ${message}`, 'danger')], 'error'));
    }
  };

  const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const raw = draft;
      setDraft('');
      await runCommand(raw);
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      const { next } = complete(draft, commandRegistry);
      setDraft(next);
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length === 0) return;
      const idx = historyIndex === null ? history.length - 1 : Math.max(historyIndex - 1, 0);
      setHistoryIndex(idx);
      setDraft(history[idx] ?? '');
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (historyIndex === null) return;
      const idx = historyIndex + 1;
      if (idx >= history.length) {
        setHistoryIndex(null);
        setDraft('');
      } else {
        setHistoryIndex(idx);
        setDraft(history[idx] ?? '');
      }
      return;
    }
    if (event.key === 'l' && event.ctrlKey) {
      event.preventDefault();
      clear();
    }
  };

  return (
    <section className={styles.terminal} aria-label="Interactive terminal">
      <div className={styles.chrome}>
        <span className={`${styles.dot} ${styles.red}`} aria-hidden />
        <span className={`${styles.dot} ${styles.amber}`} aria-hidden />
        <span className={`${styles.dot} ${styles.green}`} aria-hidden />
        <span className={styles.title}>~/serasalin.dev</span>
      </div>
      {/* A label wrapping the input turns the whole "screen" into a focusable
          target — clicking anywhere in the body focuses the input. */}
      <label className={styles.body} ref={bodyRef} htmlFor="terminal-input">
        {lines.map((l) => (
          <TerminalLineRenderer key={l.id} line={l} />
        ))}
        <div className={styles.inputRow}>
          <span className={styles.prompt} aria-hidden>
            $
          </span>
          <input
            id="terminal-input"
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            className={styles.input}
            autoComplete="off"
            spellCheck={false}
            aria-label="Terminal input"
          />
        </div>
      </label>
    </section>
  );
};
