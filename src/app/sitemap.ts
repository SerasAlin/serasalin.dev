import type { MetadataRoute } from 'next';
import { siteMetadata } from '@/lib/seo/metadata';
import { projects } from '@/content/projects';
import { labExperiments } from '@/content/lab';
import { articles } from '@/content/writing';

const STATIC_ROUTES = [
  '/',
  '/about',
  '/projects',
  '/lab',
  '/github',
  '/stack',
  '/uses',
  '/writing',
  '/now',
  '/contact',
  '/api/docs',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteMetadata.siteUrl;

  return [
    ...STATIC_ROUTES.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: path === '/' ? 1 : 0.7,
    })),
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...labExperiments
      .filter((l) => l.status === 'live')
      .map((l) => ({
        url: `${base}/lab/${l.slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      })),
    ...articles.map((a) => ({
      url: `${base}/writing/${a.slug}`,
      lastModified: new Date(a.updatedAt ?? a.publishedAt),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ];
}
