import Link from 'next/link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { profile } from '@/content/profile';
import { featuredProjects } from '@/content/projects';
import { now as nowContent } from '@/content/now';
import { articles } from '@/content/writing';
import { getGithubSummary, GithubApiError } from '@/lib/github/client';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/common/section';
import { Terminal } from '@/features/terminal/components/terminal';
import { ProjectCard } from '@/features/projects/components/project-card';
import { GithubHomeSummary } from '@/features/github/components/github-home-summary';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './home.module.css';

export const metadata = buildPageMetadata({
  title: `${profile.name} — ${profile.role}`,
  description: profile.bio,
  path: '/',
});

export const revalidate = 600;

const loadGithub = async () => {
  try {
    return await getGithubSummary();
  } catch (error) {
    if (error instanceof GithubApiError) {
      return { error: error.isRateLimit ? 'rate-limit' : 'upstream' } as const;
    }
    return { error: 'unknown' } as const;
  }
};

export default async function HomePage() {
  const github = await loadGithub();

  return (
    <>
      <section className={styles.hero}>
        <Container>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <Typography variant="overline" color="text.secondary">
                {profile.location} · {profile.role.toLowerCase()}
              </Typography>
              <Typography variant="h1" component="h1" className={styles.heroTitle}>
                {profile.name}
              </Typography>
              <Typography
                variant="h5"
                component="p"
                color="text.secondary"
                className={styles.heroSubtitle}
              >
                {profile.headline}
              </Typography>
              <Typography color="text.secondary" className={styles.heroBio}>
                {profile.bio}
              </Typography>
              <div className={styles.heroActions}>
                <Button LinkComponent={Link} href="/projects" variant="contained" size="large">
                  Explore my work
                </Button>
                <Button LinkComponent={Link} href="/api/docs" variant="outlined" size="large">
                  Read the API
                </Button>
              </div>
              <p className={styles.heroHint}>
                <kbd>⌘</kbd>
                <kbd>K</kbd> for the command palette.
              </p>
            </div>
            <div className={styles.heroTerminal}>
              <Terminal />
            </div>
          </div>
        </Container>
      </section>

      <Container>
        <Section
          eyebrow="Featured"
          title="Selected projects"
          description="A short list. Full case studies in /projects."
          actions={
            <Button LinkComponent={Link} href="/projects" variant="text">
              All projects →
            </Button>
          }
        >
          <div className={styles.projectGrid}>
            {featuredProjects.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Section>

        <Section
          eyebrow="Now"
          title="What I am focused on"
          description={`Updated ${nowContent.updated}.`}
          actions={
            <Button LinkComponent={Link} href="/now" variant="text">
              /now →
            </Button>
          }
        >
          <div className={styles.nowGrid}>
            <div className={styles.nowCard}>
              <Typography variant="overline" color="text.secondary">
                Building
              </Typography>
              <ul className={styles.nowList}>
                {nowContent.building.slice(0, 2).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className={styles.nowCard}>
              <Typography variant="overline" color="text.secondary">
                Learning
              </Typography>
              <ul className={styles.nowList}>
                {nowContent.learning.slice(0, 2).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section
          eyebrow="Public activity"
          title="Recent GitHub"
          actions={
            <Button LinkComponent={Link} href="/github" variant="text">
              /github →
            </Button>
          }
        >
          <GithubHomeSummary summary={github} />
        </Section>

        <Section
          eyebrow="Notes"
          title="Recent writing"
          actions={
            <Button LinkComponent={Link} href="/writing" variant="text">
              /writing →
            </Button>
          }
        >
          <ul className={styles.writingList}>
            {articles.slice(0, 3).map((a) => (
              <li key={a.slug}>
                <Link href={`/writing/${a.slug}`} className={styles.writingLink}>
                  <span className={styles.writingTitle}>{a.title}</span>
                  <span className={styles.writingMeta}>
                    {a.publishedAt} · {a.readingMinutes} min read
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </Container>
    </>
  );
}
