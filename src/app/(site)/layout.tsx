import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { SkipLink } from '@/components/navigation/skip-link';
import { CommandPalette } from '@/features/command-palette/components/command-palette';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main" className="min-h-[calc(100vh-8rem)]">
        {children}
      </main>
      <SiteFooter />
      <CommandPalette />
    </>
  );
}
