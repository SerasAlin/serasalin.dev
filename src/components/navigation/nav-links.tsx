'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import type { NavItem } from '@/content/navigation';
import styles from './nav-links.module.css';

type Props = {
  items: readonly NavItem[];
  orientation?: 'row' | 'column';
  onNavigate?: () => void;
};

export const NavLinks = ({ items, orientation = 'row', onNavigate }: Props) => {
  const pathname = usePathname();

  return (
    <ul className={clsx(styles.list, orientation === 'column' && styles.column)}>
      {items.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(styles.link, isActive && styles.active)}
              aria-current={isActive ? 'page' : undefined}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
