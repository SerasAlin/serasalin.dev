import Link from 'next/link';
import { primaryNav } from '@/content/navigation';
import { profile } from '@/content/profile';
import { NavLinks } from '@/components/navigation/nav-links';
import { ThemeToggle } from '@/components/navigation/theme-toggle';
import { CommandPaletteTrigger } from '@/features/command-palette/components/command-palette-trigger';
import { MobileNavToggle } from '@/components/navigation/mobile-nav-toggle';
import styles from './site-header.module.css';

export const SiteHeader = () => (
  <header className={styles.header}>
    <div className={styles.inner}>
      <Link href="/" className={styles.brand} aria-label={`${profile.name} home`}>
        <span className={styles.brandGlyph} aria-hidden>
          <span className={styles.brandPrompt}>&gt;_</span>
        </span>
        <span className={styles.brandName}>{profile.username.toLowerCase()}.dev</span>
      </Link>

      <nav className={styles.nav} aria-label="Primary">
        <NavLinks items={primaryNav} />
      </nav>

      <div className={styles.actions}>
        <CommandPaletteTrigger />
        <ThemeToggle />
        <MobileNavToggle />
      </div>
    </div>
  </header>
);
