import { describe, expect, it, vi } from 'vitest';
import { commandRegistry, findCommand } from './commands';
import type { TerminalCommand, TerminalCommandContext } from './types';

const ctx = (overrides: Partial<TerminalCommandContext> = {}): TerminalCommandContext => ({
  args: [],
  raw: '',
  now: new Date(),
  navigate: vi.fn(),
  toggleTheme: vi.fn(),
  setTheme: vi.fn(),
  clear: vi.fn(),
  print: vi.fn(),
  commands: commandRegistry,
  ...overrides,
});

describe('command registry', () => {
  it('resolves aliases', () => {
    expect(findCommand('?')?.name).toBe('help');
    expect(findCommand('cls')?.name).toBe('clear');
  });

  it('help lists visible commands', async () => {
    const help = findCommand('help')!;
    const lines = await help.run(ctx());
    expect(lines.length).toBeGreaterThan(commandRegistry.filter((c) => !c.hidden).length);
  });

  it('open navigates to a shortcut', async () => {
    const open = findCommand('open')!;
    const navigate = vi.fn();
    await open.run(ctx({ args: ['projects'], navigate }));
    expect(navigate).toHaveBeenCalledWith('/projects');
  });

  it('theme without args cycles the theme', async () => {
    const theme = findCommand('theme')!;
    const toggleTheme = vi.fn();
    await theme.run(ctx({ toggleTheme }));
    expect(toggleTheme).toHaveBeenCalled();
  });

  it('clear invokes the clear callback', async () => {
    const clearCmd = findCommand('clear')! as TerminalCommand;
    const clear = vi.fn();
    await clearCmd.run(ctx({ clear }));
    expect(clear).toHaveBeenCalled();
  });
});
