import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { usesCategories } from '@/content/uses';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './uses.module.css';

export const metadata = buildPageMetadata({
  title: 'Uses',
  description: 'The tools I use every day.',
  path: '/uses',
});

export default function UsesPage() {
  return (
    <Container size="narrow">
      <PageHeader
        eyebrow="Uses"
        title="Tools I use every day."
        description="Editor, terminal, hardware. Updated when things actually change."
      />
      <div className={styles.grid}>
        {usesCategories.map((cat) => (
          <section key={cat.id} className={styles.card}>
            <Typography variant="h5" component="h2">
              {cat.title}
            </Typography>
            <ul className={styles.list}>
              {cat.items.map((item) => (
                <li key={item.name} className={styles.item}>
                  <span className={styles.name}>{item.name}</span>
                  {item.detail ? <span className={styles.detail}>{item.detail}</span> : null}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Container>
  );
}
