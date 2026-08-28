import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './api-docs.module.css';

export const metadata = buildPageMetadata({
  title: 'Public API',
  description: 'A tiny public API for this site.',
  path: '/api/docs',
});

type Endpoint = {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  sampleResponse: string;
  status?: string[];
};

const endpoints: readonly Endpoint[] = [
  {
    method: 'GET',
    path: '/api/me',
    description: 'Basic profile and preferred stack.',
    sampleResponse: JSON.stringify(
      {
        name: 'Your Name',
        role: 'Software Engineer',
        headline: 'I build systems for the web.',
        favoriteStack: {
          frontend: 'Next.js',
          backend: 'Node.js',
          language: 'TypeScript',
          data: 'PostgreSQL',
        },
      },
      null,
      2,
    ),
  },
  {
    method: 'GET',
    path: '/api/projects',
    description: 'All projects.',
    sampleResponse: '[ { "slug": "…", "title": "…", "tagline": "…" } ]',
  },
  {
    method: 'GET',
    path: '/api/projects/{slug}',
    description: 'Full case-study payload.',
    sampleResponse: '{ "slug": "…", "problem": "…", "solution": "…" }',
    status: ['200 OK', '404 NOT_FOUND'],
  },
  {
    method: 'GET',
    path: '/api/skills',
    description: 'Grouped skill catalog.',
    sampleResponse: '[ { "id": "languages", "skills": [ { "name": "TypeScript" } ] } ]',
  },
  {
    method: 'GET',
    path: '/api/now',
    description: 'A /now snapshot.',
    sampleResponse: '{ "updated": "…", "building": [ "…" ] }',
  },
  {
    method: 'GET',
    path: '/api/lab',
    description: 'Lab experiments and status.',
    sampleResponse: '[ { "slug": "event-loop", "status": "live" } ]',
  },
  {
    method: 'GET',
    path: '/api/github',
    description: 'Cached GitHub summary. May return RATE_LIMITED under load.',
    sampleResponse: '{ "user": { … }, "languages": [ … ], "repos": [ … ] }',
    status: ['200 OK', '429 RATE_LIMITED', '502 UPSTREAM_ERROR'],
  },
  {
    method: 'POST',
    path: '/api/contact',
    description: 'Submit a contact form message. Rate limited per IP.',
    sampleResponse: '{ "ok": true }',
    status: ['200 OK', '400 VALIDATION_ERROR', '429 RATE_LIMITED', '502 UPSTREAM_ERROR'],
  },
];

const errorShape = JSON.stringify(
  {
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Invalid submission.',
      details: { fieldErrors: { email: ['That does not look like an email address.'] } },
    },
  },
  null,
  2,
);

export default function ApiDocsPage() {
  return (
    <Container size="narrow">
      <PageHeader
        eyebrow="Public API"
        title="A tiny API for this site."
        description="Everything the site knows is served over HTTP. Responses are JSON. Errors follow a single shape."
      />
      <section className={styles.section}>
        <Typography variant="h5" component="h2">
          Error envelope
        </Typography>
        <pre className={styles.code}>
          <code>{errorShape}</code>
        </pre>
      </section>

      <section className={styles.section}>
        <Typography variant="h5" component="h2">
          Endpoints
        </Typography>
        <ul className={styles.list}>
          {endpoints.map((ep) => (
            <li key={ep.path} className={styles.endpoint}>
              <div className={styles.header}>
                <span
                  className={`${styles.method} ${ep.method === 'POST' ? styles.post : styles.get}`}
                >
                  {ep.method}
                </span>
                <code className={styles.path}>{ep.path}</code>
              </div>
              <Typography color="text.secondary">{ep.description}</Typography>
              {ep.status ? (
                <div className={styles.status}>
                  {ep.status.map((s) => (
                    <code key={s}>{s}</code>
                  ))}
                </div>
              ) : null}
              <details>
                <summary>Example response</summary>
                <pre className={styles.code}>
                  <code>{ep.sampleResponse}</code>
                </pre>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </Container>
  );
}
