import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { getGithubSummary, GithubApiError } from '@/lib/github/client';
import { GithubDashboard } from '@/features/github/components/github-dashboard';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata({
  title: 'GitHub',
  description: 'Recent public activity, top languages, and starred work.',
  path: '/github',
});

export const revalidate = 600;

export default async function GithubPage() {
  try {
    const summary = await getGithubSummary();
    return (
      <Container>
        <PageHeader
          eyebrow="GitHub"
          title="Public activity."
          description={`Cached from api.github.com every 10 minutes. Last fetch: ${new Date(summary.fetchedAt).toUTCString()}.`}
        />
        <GithubDashboard summary={summary} />
      </Container>
    );
  } catch (error) {
    const isRate = error instanceof GithubApiError && error.isRateLimit;
    return (
      <Container size="narrow">
        <PageHeader eyebrow="GitHub" title="Public activity." />
        <Typography color="text.secondary">
          {isRate
            ? 'GitHub is rate limiting anonymous requests. Setting a GITHUB_TOKEN in the environment raises the limit to 5,000/hour.'
            : 'GitHub is temporarily unavailable. Try again in a few minutes.'}
        </Typography>
      </Container>
    );
  }
}
