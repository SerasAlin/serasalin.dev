import { apiSuccess } from '@/lib/api/errors';
import { profile } from '@/content/profile';

export const revalidate = 3600;

export function GET() {
  return apiSuccess({
    name: profile.name,
    role: profile.role,
    headline: profile.headline,
    location: profile.location,
    timezone: profile.timezone,
    currentlyLearning: profile.currentlyLearning,
    favoriteStack: profile.favoriteStack,
    focus: profile.focus,
    links: {
      github: profile.github,
      linkedin: profile.linkedin,
      email: profile.email,
    },
  });
}
