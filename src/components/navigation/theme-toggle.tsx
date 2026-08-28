'use client';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import { useThemeMode } from '@/features/theme/store';

const iconFor = (mode: 'system' | 'light' | 'dark') => {
  if (mode === 'light') return <LightModeIcon fontSize="small" />;
  if (mode === 'dark') return <DarkModeIcon fontSize="small" />;
  return <SettingsBrightnessIcon fontSize="small" />;
};

const nextLabel: Record<'system' | 'light' | 'dark', string> = {
  system: 'Use light theme',
  light: 'Use dark theme',
  dark: 'Follow system theme',
};

export const ThemeToggle = () => {
  const mode = useThemeMode((s) => s.mode);
  const cycle = useThemeMode((s) => s.cycle);
  return (
    <Tooltip title={nextLabel[mode]}>
      <IconButton aria-label={nextLabel[mode]} onClick={cycle} size="small" color="inherit">
        {iconFor(mode)}
      </IconButton>
    </Tooltip>
  );
};
