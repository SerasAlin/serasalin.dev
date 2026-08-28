import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { skillCategories, skillLevelLabel } from '@/content/skills';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './stack.module.css';

export const metadata = buildPageMetadata({
  title: 'Stack',
  description: 'Languages, frameworks, and tools I reach for.',
  path: '/stack',
});

export default function StackPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Stack"
        title="What I reach for."
        description="Grouped by intent, not by skill percentage. Level is a rough gauge, not a benchmark."
      />
      <div className={styles.grid}>
        {skillCategories.map((cat) => (
          <section key={cat.id} className={styles.card}>
            <Typography variant="h5" component="h2">
              {cat.title}
            </Typography>
            <Typography color="text.secondary" className={styles.description}>
              {cat.description}
            </Typography>
            <ul className={styles.list}>
              {cat.skills.map((skill) => (
                <li key={skill.name} className={styles.item}>
                  <div className={styles.row}>
                    <span className={styles.name}>{skill.name}</span>
                    <span className={`${styles.level} ${styles[skill.level]}`}>
                      {skillLevelLabel[skill.level]}
                    </span>
                  </div>
                  {skill.note ? (
                    <Typography variant="body2" color="text.secondary">
                      {skill.note}
                    </Typography>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
