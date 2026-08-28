import type { Metadata } from 'next';
import { clientEnv } from '@/lib/env/client';
import { profile } from '@/content/profile';

const siteName = 'serasalin.dev';
const defaultDescription =
  'An interactive developer OS — portfolio, engineering lab, and public API by ' +
  profile.name +
  '.';

export const siteMetadata = {
  siteName,
  siteUrl: clientEnv.NEXT_PUBLIC_SITE_URL,
  defaultDescription,
  twitterHandle: '@serasalin',
} as const;

type BuildPageMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  keywords?: string[];
};

export const buildPageMetadata = (input: BuildPageMetadataInput = {}): Metadata => {
  const title = input.title ?? profile.name;
  const description = input.description ?? defaultDescription;
  const canonical = `${siteMetadata.siteUrl}${input.path ?? '/'}`;
  const image = input.image ?? `${siteMetadata.siteUrl}/opengraph-image`;

  return {
    title,
    description,
    alternates: { canonical },
    keywords: input.keywords,
    openGraph: {
      type: input.type ?? 'website',
      title,
      description,
      url: canonical,
      siteName,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(input.publishedTime ? { publishedTime: input.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: siteMetadata.twitterHandle,
    },
  };
};
