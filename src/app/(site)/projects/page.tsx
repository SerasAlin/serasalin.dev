import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { ProjectCard } from '@/features/projects/components/project-card';
import { projects } from '@/content/projects';
import { buildPageMetadata } from '@/lib/seo/metadata';
import styles from './projects.module.css';

export const metadata = buildPageMetadata({
  title: 'Projects',
  description: 'Case studies of projects I have shipped and experiments I care about.',
  path: '/projects',
});

export default function ProjectsPage() {
  return (
    <Container>
      <PageHeader
        eyebrow="Projects"
        title="Things I have built."
        description="Each entry is a case study with the problem, the architecture, and the tradeoffs I made."
      />
      <ul className={styles.grid}>
        {projects.map((p) => (
          <li key={p.slug}>
            <ProjectCard project={p} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
