import clsx from 'clsx';
import type { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import styles from './section.module.css';

type Props = {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export const Section = ({
  id,
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: Props) => (
  <section id={id} className={clsx(styles.section, className)}>
    {(eyebrow || title || description) && (
      <header className={styles.header}>
        <div>
          {eyebrow ? (
            <Typography variant="overline" color="text.secondary">
              {eyebrow}
            </Typography>
          ) : null}
          {title ? (
            <Typography variant="h3" component="h2" className={styles.title}>
              {title}
            </Typography>
          ) : null}
          {description ? (
            <Typography color="text.secondary" className={styles.description}>
              {description}
            </Typography>
          ) : null}
        </div>
        {actions ? <div className={styles.actions}>{actions}</div> : null}
      </header>
    )}
    {children}
  </section>
);
