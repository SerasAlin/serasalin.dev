import { profile } from '@/content/profile';
import { siteMetadata } from '@/lib/seo/metadata';

type LdProps = {
  data: Record<string, unknown>;
};

const JsonLd = ({ data }: LdProps) => (
  <script
    type="application/ld+json"
    // Static content only, never user-generated. JSON.stringify escapes reliably.
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export const PersonJsonLd = () => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: profile.name,
      alternateName: profile.username,
      jobTitle: profile.role,
      url: siteMetadata.siteUrl,
      sameAs: [profile.github, profile.linkedin],
      email: `mailto:${profile.email}`,
    }}
  />
);

export const WebSiteJsonLd = () => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: siteMetadata.siteName,
      url: siteMetadata.siteUrl,
      publisher: {
        '@type': 'Person',
        name: profile.name,
      },
    }}
  />
);

export const ArticleJsonLd = ({
  title,
  description,
  path,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
}) => (
  <JsonLd
    data={{
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      author: { '@type': 'Person', name: profile.name, url: siteMetadata.siteUrl },
      datePublished,
      dateModified: dateModified ?? datePublished,
      url: `${siteMetadata.siteUrl}${path}`,
      mainEntityOfPage: `${siteMetadata.siteUrl}${path}`,
    }}
  />
);
