import { apiSuccess } from '@/lib/api/errors';
import { labExperiments } from '@/content/lab';

export const revalidate = 3600;

export function GET() {
  return apiSuccess(labExperiments);
}
