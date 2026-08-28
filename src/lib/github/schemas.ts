import { z } from 'zod';

export const githubUserSchema = z.object({
  login: z.string(),
  name: z.string().nullable(),
  avatar_url: z.string().url(),
  html_url: z.string().url(),
  bio: z.string().nullable(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  public_repos: z.number().int().nonnegative(),
  followers: z.number().int().nonnegative(),
  following: z.number().int().nonnegative(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const githubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  html_url: z.string().url(),
  description: z.string().nullable(),
  fork: z.boolean(),
  archived: z.boolean(),
  private: z.boolean(),
  stargazers_count: z.number().int().nonnegative(),
  forks_count: z.number().int().nonnegative(),
  language: z.string().nullable(),
  topics: z.array(z.string()).default([]),
  pushed_at: z.string().nullable(),
  updated_at: z.string(),
  created_at: z.string(),
});

export type GithubUser = z.infer<typeof githubUserSchema>;
export type GithubRepo = z.infer<typeof githubRepoSchema>;

export type GithubSummary = {
  user: GithubUser;
  repos: GithubRepo[];
  languages: Array<{ name: string; count: number }>;
  topics: Array<{ name: string; count: number }>;
  totalStars: number;
  fetchedAt: string;
};
