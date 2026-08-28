import { apiError, apiSuccess, ErrorCode } from '@/lib/api/errors';
import { getProjectBySlug } from '@/content/projects';

export const revalidate = 3600;

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) {
    return apiError(ErrorCode.NOT_FOUND, `No project with slug "${slug}".`);
  }
  return apiSuccess(project);
}
