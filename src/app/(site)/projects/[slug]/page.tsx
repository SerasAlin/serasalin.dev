import { notFound } from 'next/navigation';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { projects, getProjectBySlug, projectStatusLabel } from '@/content/projects';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './project-detail.module.css';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return buildPageMetadata({ title: 'Project not found', path: `/projects/${slug}` });
  return buildPageMetadata({
    title: project.title,
    description: project.tagline,
    path: `/projects/${project.slug}`,
    keywords: project.tech,
  });
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <Container size="narrow">
      <article className={styles.article}>
        <header className={styles.header}>
          <Typography variant="overline" color="text.secondary">
            {project.year} · {projectStatusLabel[project.status]}
          </Typography>
          <Typography variant="h2" component="h1">
            {project.title}
          </Typography>
          <Typography color="text.secondary" className={styles.tagline}>
            {project.tagline}
          </Typography>
          <div className={styles.tech}>
            {project.tech.map((t) => (
              <Chip key={t} label={t} size="small" variant="outlined" />
            ))}
          </div>
          <div className={styles.actions}>
            {project.links.live ? (
              <Button
                variant="contained"
                LinkComponent="a"
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live demo
              </Button>
            ) : null}
            {project.links.repository ? (
              <Button
                variant="outlined"
                LinkComponent="a"
                href={project.links.repository}
                target="_blank"
                rel="noopener noreferrer"
              >
                Repository
              </Button>
            ) : null}
          </div>
        </header>

        <section className={styles.section}>
          <Typography variant="h4" component="h2">
            Overview
          </Typography>
          <Typography paragraph>{project.overview}</Typography>
        </section>

        <section className={styles.section}>
          <Typography variant="h4" component="h2">
            Problem
          </Typography>
          <Typography paragraph>{project.problem}</Typography>
        </section>

        <section className={styles.section}>
          <Typography variant="h4" component="h2">
            Solution
          </Typography>
          <Typography paragraph>{project.solution}</Typography>
        </section>

        <section className={styles.section}>
          <Typography variant="h4" component="h2">
            Architecture
          </Typography>
          <Typography paragraph>{project.architecture}</Typography>
        </section>

        {project.decisions.length ? (
          <section className={styles.section}>
            <Typography variant="h4" component="h2">
              Decisions
            </Typography>
            <ul className={styles.decisionList}>
              {project.decisions.map((d) => (
                <li key={d.title}>
                  <Typography variant="h6" component="h3">
                    {d.title}
                  </Typography>
                  <Typography color="text.secondary">{d.body}</Typography>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.tradeoffs.length ? (
          <section className={styles.section}>
            <Typography variant="h4" component="h2">
              Tradeoffs
            </Typography>
            <ul className={styles.tradeoffList}>
              {project.tradeoffs.map((t) => (
                <li key={t.chose}>
                  <Typography variant="body2">
                    <strong>Chose:</strong> {t.chose}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Against:</strong> {t.against}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Why:</strong> {t.why}
                  </Typography>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.challenges.length ? (
          <section className={styles.section}>
            <Typography variant="h4" component="h2">
              Challenges
            </Typography>
            <ul>
              {project.challenges.map((c) => (
                <li key={c}>
                  <Typography>{c}</Typography>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.lessons.length ? (
          <section className={styles.section}>
            <Typography variant="h4" component="h2">
              Lessons
            </Typography>
            <ul>
              {project.lessons.map((l) => (
                <li key={l}>
                  <Typography>{l}</Typography>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <footer className={styles.footer}>
          <Button LinkComponent={Link} href="/projects" variant="text">
            ← All projects
          </Button>
        </footer>
      </article>
    </Container>
  );
}
