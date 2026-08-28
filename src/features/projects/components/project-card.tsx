import Link from 'next/link';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { projectStatusLabel, type Project } from '@/content/projects';
import styles from './project-card.module.css';

const statusTone: Record<Project['status'], 'primary' | 'default' | 'success' | 'warning'> = {
  shipping: 'success',
  active: 'primary',
  concept: 'default',
  sunset: 'warning',
};

export const ProjectCard = ({ project }: { project: Project }) => (
  <Link href={`/projects/${project.slug}`} className={styles.card}>
    <div className={styles.header}>
      <Typography variant="overline" color="text.secondary" component="span">
        {project.year}
      </Typography>
      <Chip
        label={projectStatusLabel[project.status]}
        color={statusTone[project.status]}
        size="small"
        variant="outlined"
      />
    </div>
    <Typography variant="h5" component="h3" className={styles.title}>
      {project.title}
    </Typography>
    <Typography color="text.secondary" className={styles.tagline}>
      {project.tagline}
    </Typography>
    <div className={styles.tags}>
      {project.tech.slice(0, 5).map((t) => (
        <span key={t} className={styles.tag}>
          {t}
        </span>
      ))}
      {project.tech.length > 5 ? (
        <span className={styles.tagMore}>+{project.tech.length - 5}</span>
      ) : null}
    </div>
  </Link>
);
