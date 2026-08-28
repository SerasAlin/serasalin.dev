import { apiSuccess } from '@/lib/api/errors';
import { skillCategories } from '@/content/skills';

export const revalidate = 3600;

export function GET() {
  return apiSuccess(skillCategories);
}
