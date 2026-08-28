import Link from 'next/link';
import { profile } from '@/content/profile';
import { socialLinks } from '@/content/social';
import { utilityNav } from '@/content/navigation';
import styles from './site-footer.module.css';

export const SiteFooter = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div>
        <p className={styles.line}>
          Built by <span className={styles.name}>{profile.name}</span> with Next.js, TypeScript, and
          intent.
        </p>
        <p className={styles.subtle}>Source and content live on GitHub.</p>
      </div>
      <nav aria-label="Utility" className={styles.utility}>
        <ul className={styles.list}>
          {utilityNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/feed.xml" className={styles.link}>
              RSS
            </Link>
          </li>
        </ul>
      </nav>
      <ul className={styles.socials}>
        {socialLinks.map((l) => (
          <li key={l.id}>
            <a
              className={styles.link}
              href={l.href}
              rel={l.external ? 'noopener noreferrer' : undefined}
              target={l.external ? '_blank' : undefined}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  </footer>
);
