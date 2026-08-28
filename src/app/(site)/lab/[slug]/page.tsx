import { notFound } from 'next/navigation';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { labExperiments, getLabExperimentBySlug } from '@/content/lab';
import { EventLoopVisualizer } from '@/features/lab/event-loop/event-loop-visualizer';
import { JwtInspector } from '@/features/lab/jwt-inspector/jwt-inspector';
import { JsonDiff } from '@/features/lab/json-diff/json-diff';
import { CronExplorer } from '@/features/lab/cron-explorer/cron-explorer';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './experiment.module.css';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () =>
  labExperiments.filter((l) => l.status === 'live').map((l) => ({ slug: l.slug }));

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = await params;
  const exp = getLabExperimentBySlug(slug);
  if (!exp) return buildPageMetadata({ title: 'Experiment not found', path: `/lab/${slug}` });
  return buildPageMetadata({
    title: exp.title,
    description: exp.tagline,
    path: `/lab/${exp.slug}`,
    keywords: exp.tags,
  });
};

const experimentComponent = (slug: string) => {
  switch (slug) {
    case 'event-loop':
      return <EventLoopVisualizer />;
    case 'jwt-inspector':
      return <JwtInspector />;
    case 'json-diff':
      return <JsonDiff />;
    case 'cron-explorer':
      return <CronExplorer />;
    default:
      return null;
  }
};

export default async function LabExperimentPage({ params }: PageProps) {
  const { slug } = await params;
  const exp = getLabExperimentBySlug(slug);
  if (!exp || exp.status !== 'live') notFound();
  const component = experimentComponent(exp.slug);
  if (!component) notFound();

  return (
    <Container>
      <header className={styles.header}>
        <Typography variant="overline" color="text.secondary">
          Lab · {exp.tags.join(' / ')}
        </Typography>
        <Typography variant="h3" component="h1">
          {exp.title}
        </Typography>
        <Typography color="text.secondary" className={styles.tagline}>
          {exp.tagline}
        </Typography>
      </header>
      <div className={styles.body}>{component}</div>
      <footer className={styles.footer}>
        <Button LinkComponent={Link} href="/lab" variant="text">
          ← All experiments
        </Button>
      </footer>
    </Container>
  );
}
