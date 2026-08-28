import 'server-only';
import { serverEnv } from '@/lib/env/server';
import {
  githubRepoSchema,
  githubUserSchema,
  type GithubRepo,
  type GithubSummary,
  type GithubUser,
} from './schemas';

const GITHUB_BASE = 'https://api.github.com';
const REVALIDATE_SECONDS = 60 * 10; // 10 minutes

const acceptHeader = 'application/vnd.github+json';

const headers = (): HeadersInit => {
  const base: Record<string, string> = {
    Accept: acceptHeader,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'serasalin.dev',
  };
  if (serverEnv.GITHUB_TOKEN) {
    base.Authorization = `Bearer ${serverEnv.GITHUB_TOKEN}`;
  }
  return base;
};

export class GithubApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly isRateLimit: boolean,
  ) {
    super(message);
    this.name = 'GithubApiError';
  }
}

const fetchGithub = async <T>(path: string): Promise<T> => {
  const res = await fetch(`${GITHUB_BASE}${path}`, {
    headers: headers(),
    next: { revalidate: REVALIDATE_SECONDS, tags: ['github'] },
  });

  if (!res.ok) {
    const rateLimited = res.status === 403 && res.headers.get('X-RateLimit-Remaining') === '0';
    throw new GithubApiError(
      rateLimited ? 'GitHub API rate limit exceeded' : `GitHub API responded with ${res.status}`,
      res.status,
      rateLimited,
    );
  }
  return (await res.json()) as T;
};

export const getGithubUser = async (username: string): Promise<GithubUser> => {
  const raw = await fetchGithub<unknown>(`/users/${encodeURIComponent(username)}`);
  return githubUserSchema.parse(raw);
};

export const getGithubRepos = async (username: string): Promise<GithubRepo[]> => {
  const raw = await fetchGithub<unknown[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated&type=owner`,
  );
  return raw
    .map((item) => githubRepoSchema.safeParse(item))
    .filter((r): r is { success: true; data: GithubRepo } => r.success)
    .map((r) => r.data);
};

export const getGithubSummary = async (
  username = serverEnv.GITHUB_USERNAME,
): Promise<GithubSummary> => {
  const [user, allRepos] = await Promise.all([getGithubUser(username), getGithubRepos(username)]);
  const repos = allRepos.filter((r) => !r.fork && !r.private && !r.archived);

  const languageCounts = new Map<string, number>();
  const topicCounts = new Map<string, number>();
  let totalStars = 0;

  for (const repo of repos) {
    totalStars += repo.stargazers_count;
    if (repo.language) {
      languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }
    for (const topic of repo.topics) {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    }
  }

  return {
    user,
    repos: repos
      .slice()
      .sort((a, b) => (b.pushed_at ?? '').localeCompare(a.pushed_at ?? ''))
      .slice(0, 12),
    languages: Array.from(languageCounts, ([name, count]) => ({ name, count })).sort(
      (a, b) => b.count - a.count,
    ),
    topics: Array.from(topicCounts, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 24),
    totalStars,
    fetchedAt: new Date().toISOString(),
  };
};
