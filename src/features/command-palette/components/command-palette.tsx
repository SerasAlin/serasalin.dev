'use client';

import Dialog from '@mui/material/Dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import { useCommandPalette } from '../store';
import { useThemeMode } from '@/features/theme/store';
import { useTerminalStore } from '@/features/terminal/store';
import { buildActions } from '../lib/actions';
import { rankCommands } from '../lib/match';
import type { CommandAction } from '../types';
import styles from './command-palette.module.css';

const isModifier = (e: KeyboardEvent) => e.metaKey || e.ctrlKey;

const groupOrder: CommandAction['group'][] = ['Navigate', 'Actions', 'Toggle', 'External'];

export const CommandPalette = () => {
  const router = useRouter();
  const cycleTheme = useThemeMode((s) => s.cycle);
  const requestFocusTerminal = useTerminalStore((s) => s.requestFocus);

  const open = useCommandPalette((s) => s.open);
  const query = useCommandPalette((s) => s.query);
  const activeIndex = useCommandPalette((s) => s.activeIndex);
  const setQuery = useCommandPalette((s) => s.setQuery);
  const setActiveIndex = useCommandPalette((s) => s.setActiveIndex);
  const close = useCommandPalette((s) => s.close);
  const toggle = useCommandPalette((s) => s.toggle);

  const actions = useMemo(() => buildActions(), []);
  const ranked = useMemo(() => rankCommands(actions, query), [actions, query]);
  const grouped = useMemo(() => {
    const map = new Map<CommandAction['group'], CommandAction[]>();
    for (const cmd of ranked) {
      const bucket = map.get(cmd.group) ?? [];
      bucket.push(cmd);
      map.set(cmd.group, bucket);
    }
    return groupOrder
      .map((g) => ({ group: g, items: map.get(g) ?? [] }))
      .filter((section) => section.items.length > 0);
  }, [ranked]);

  const flatItems = useMemo(() => grouped.flatMap((section) => section.items), [grouped]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isModifier(event) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!listRef.current) return;
    const active = listRef.current.querySelector<HTMLLIElement>(`[data-index="${activeIndex}"]`);
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, ranked]);

  const perform = (cmd: CommandAction) => {
    void cmd.perform({
      router: { push: (href) => router.push(href) },
      toggleTheme: cycleTheme,
      openTerminal: requestFocusTerminal,
      close,
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(Math.min(activeIndex + 1, flatItems.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(Math.max(activeIndex - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = flatItems[activeIndex];
      if (target) perform(target);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={close}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { className: styles.paper } }}
      aria-labelledby="command-palette-label"
    >
      <div className={styles.container}>
        <label id="command-palette-label" className="sr-only" htmlFor="command-palette-input">
          Command palette
        </label>
        <div className={styles.inputRow}>
          <span className={styles.prompt} aria-hidden>
            &gt;
          </span>
          <input
            id="command-palette-input"
            ref={inputRef}
            className={styles.input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search commands, pages, actions…"
            role="combobox"
            aria-controls="command-palette-list"
            aria-expanded="true"
            aria-autocomplete="list"
            aria-activedescendant={
              flatItems[activeIndex] ? `cmd-${flatItems[activeIndex].id}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className={styles.kbd}>Esc</kbd>
        </div>

        <ul
          id="command-palette-list"
          ref={listRef}
          className={styles.list}
          role="listbox"
          aria-label="Commands"
        >
          {grouped.length === 0 ? (
            <li className={styles.empty}>No matches. Try another word.</li>
          ) : (
            grouped.map((section) => (
              <li key={section.group} className={styles.section}>
                <div className={styles.sectionTitle}>{section.group}</div>
                <ul className={styles.subList}>
                  {section.items.map((cmd) => {
                    const idx = flatItems.indexOf(cmd);
                    const isActive = idx === activeIndex;
                    return (
                      <li
                        key={cmd.id}
                        id={`cmd-${cmd.id}`}
                        data-index={idx}
                        role="option"
                        aria-selected={isActive}
                        className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                        onMouseEnter={() => setActiveIndex(idx)}
                        onMouseDown={(e) => {
                          // Prevent the input from losing focus before we run.
                          e.preventDefault();
                          perform(cmd);
                        }}
                      >
                        <div className={styles.itemTitle}>{cmd.title}</div>
                        {cmd.subtitle ? (
                          <div className={styles.itemSubtitle}>{cmd.subtitle}</div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))
          )}
        </ul>

        <div className={styles.footer}>
          <span>↑↓ to navigate</span>
          <span>⏎ to select</span>
          <span>Esc to close</span>
        </div>
      </div>
    </Dialog>
  );
};
