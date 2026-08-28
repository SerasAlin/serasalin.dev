import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { now } from '@/content/now';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata({
  title: 'Now',
  description: 'A snapshot of what I am building, learning, and thinking about.',
  path: '/now',
});

const Group = ({ title, items }: { title: string; items: readonly string[] }) => (
  <section>
    <Typography variant="h5" component="h2" sx={{ mt: 3 }}>
      {title}
    </Typography>
    <ul>
      {items.map((item) => (
        <li key={item}>
          <Typography>{item}</Typography>
        </li>
      ))}
    </ul>
  </section>
);

export default function NowPage() {
  return (
    <Container size="narrow">
      <PageHeader
        eyebrow="Now"
        title="What I am focused on right now."
        description={`Last updated ${now.updated}.`}
      />
      <Group title="Building" items={now.building} />
      <Group title="Learning" items={now.learning} />
      <Group title="Reading" items={now.reading} />
      <Group title="Interested in" items={now.interests} />
    </Container>
  );
}
