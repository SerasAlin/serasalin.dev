import clsx from 'clsx';
import type { ReactNode } from 'react';
import styles from './container.module.css';

type Props = {
  children: ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
};

export const Container = ({ children, className, size = 'default' }: Props) => (
  <div className={clsx(styles.container, styles[size], className)}>{children}</div>
);
