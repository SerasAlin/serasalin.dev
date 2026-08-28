import type { Meta, StoryObj } from '@storybook/react';
import { useEffect } from 'react';
import { CommandPalette } from './command-palette';
import { useCommandPalette } from '../store';

const AutoOpen = () => {
  const openPalette = useCommandPalette((s) => s.openPalette);
  useEffect(() => {
    openPalette();
  }, [openPalette]);
  return <CommandPalette />;
};

const meta: Meta<typeof CommandPalette> = {
  title: 'Features/Command Palette',
  component: CommandPalette,
  parameters: { layout: 'fullscreen' },
};

export default meta;

type Story = StoryObj<typeof CommandPalette>;

export const Default: Story = {
  render: () => <AutoOpen />,
};
