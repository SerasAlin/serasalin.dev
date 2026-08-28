import Link from 'next/link';
import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { articles } from '@/content/writing';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './writing.module.css';

export const metadata = buildPageMetadata({
  title: 'Writing',
  description: 'Notes on architecture, TypeScript, and React.',
  path: '/writing',
});

export default function WritingPage() {
  const sorted = [...articles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  return (
    <Container size="narrow">
      <PageHeader
        eyebrow="Writing"
        title="Notes on shipping software."
        description="Short posts, mostly about how I decide what belongs on the server."
      />
      <ul className={styles.list}>
        {sorted.map((a) => (
          <li key={a.slug}>
            <Link href={`/writing/${a.slug}`} className={styles.entry}>
              <Typography variant="h5" component="h2">
                {a.title}
              </Typography>
              <Typography color="text.secondary">{a.description}</Typography>
              <Typography variant="body2" className={styles.meta}>
                {a.publishedAt} · {a.readingMinutes} min read · {a.tags.join(', ')}
              </Typography>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
