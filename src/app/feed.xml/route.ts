import { NextResponse } from 'next/server';
import { articles } from '@/content/writing';
import { siteMetadata } from '@/lib/seo/metadata';
import { profile } from '@/content/profile';

const escapeXml = (unsafe: string): string =>
  unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const revalidate = 3600;

export function GET() {
  const items = [...articles]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .map((article) => {
      const url = `${siteMetadata.siteUrl}/writing/${article.slug}`;
      return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(article.description)}</description>
    </item>`;
    })
    .join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(siteMetadata.siteName)}</title>
    <link>${siteMetadata.siteUrl}</link>
    <description>Writing by ${escapeXml(profile.name)}.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;

  return new NextResponse(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
