import { apiSuccess } from '@/lib/api/errors';
import { projects } from '@/content/projects';

export const revalidate = 3600;

export function GET() {
  return apiSuccess(
    projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      year: p.year,
      status: p.status,
      featured: p.featured,
      tech: p.tech,
      links: p.links,
    })),
  );
}
