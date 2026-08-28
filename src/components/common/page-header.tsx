import Typography from '@mui/material/Typography';
import styles from './page-header.module.css';

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export const PageHeader = ({ eyebrow, title, description }: Props) => (
  <header className={styles.header}>
    {eyebrow ? (
      <Typography variant="overline" color="text.secondary">
        {eyebrow}
      </Typography>
    ) : null}
    <Typography variant="h2" component="h1" className={styles.title}>
      {title}
    </Typography>
    {description ? (
      <Typography color="text.secondary" className={styles.description}>
        {description}
      </Typography>
    ) : null}
  </header>
);
