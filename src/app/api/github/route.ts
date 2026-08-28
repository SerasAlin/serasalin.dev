import { apiError, apiSuccess, ErrorCode } from '@/lib/api/errors';
import { getGithubSummary, GithubApiError } from '@/lib/github/client';

export const revalidate = 600;

export async function GET() {
  try {
    const summary = await getGithubSummary();
    return apiSuccess({
      user: {
        login: summary.user.login,
        name: summary.user.name,
        bio: summary.user.bio,
        publicRepos: summary.user.public_repos,
        followers: summary.user.followers,
      },
      languages: summary.languages,
      topics: summary.topics,
      totalStars: summary.totalStars,
      repos: summary.repos.map((r) => ({
        name: r.name,
        html: r.html_url,
        description: r.description,
        language: r.language,
        stars: r.stargazers_count,
        forks: r.forks_count,
        pushedAt: r.pushed_at,
      })),
      fetchedAt: summary.fetchedAt,
    });
  } catch (err) {
    if (err instanceof GithubApiError) {
      return apiError(
        err.isRateLimit ? ErrorCode.RATE_LIMITED : ErrorCode.UPSTREAM_ERROR,
        err.message,
      );
    }
    return apiError(ErrorCode.INTERNAL, 'Failed to load GitHub summary.');
  }
}
