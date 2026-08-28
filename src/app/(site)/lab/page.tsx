import Link from 'next/link';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { labExperiments } from '@/content/lab';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './lab.module.css';

export const metadata = buildPageMetadata({
  title: 'Lab',
  description: 'Interactive engineering experiments.',
  path: '/lab',
});

export default function LabIndexPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Lab"
        title="Interactive engineering experiments."
        description="A small collection of live tools. Each one models a system I wanted to understand better."
      />
      <ul className={styles.grid}>
        {labExperiments.map((exp) => {
          const isLive = exp.status === 'live';
          const inner = (
            <>
              <div className={styles.head}>
                <Typography variant="overline" color="text.secondary">
                  {exp.tags[0]}
                </Typography>
                <Chip
                  label={isLive ? 'Live' : 'Planned'}
                  color={isLive ? 'success' : 'default'}
                  size="small"
                  variant="outlined"
                />
              </div>
              <Typography variant="h5" component="h2">
                {exp.title}
              </Typography>
              <Typography color="text.secondary">{exp.tagline}</Typography>
            </>
          );
          return (
            <li key={exp.slug}>
              {isLive ? (
                <Link href={`/lab/${exp.slug}`} className={styles.card}>
                  {inner}
                </Link>
              ) : (
                <div className={`${styles.card} ${styles.disabled}`}>{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </Container>
  );
}
