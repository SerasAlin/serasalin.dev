import { apiSuccess } from '@/lib/api/errors';
import { now } from '@/content/now';

export const revalidate = 3600;

export function GET() {
  return apiSuccess(now);
}
