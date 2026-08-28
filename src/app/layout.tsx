import type { Metadata, Viewport } from 'next';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@/styles/globals.css';
import { Providers } from './providers';
import { profile } from '@/content/profile';
import { siteMetadata, buildPageMetadata } from '@/lib/seo/metadata';
import { PersonJsonLd, WebSiteJsonLd } from '@/components/seo/json-ld';

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: `${profile.name} — ${profile.role}`,
    description: profile.bio,
    path: '/',
  }),
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s · ${siteMetadata.siteName}`,
  },
  applicationName: siteMetadata.siteName,
  authors: [{ name: profile.name, url: siteMetadata.siteUrl }],
  creator: profile.name,
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d12' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InitColorSchemeScript attribute="data-mui-color-scheme" defaultMode="system" />
        <Providers>{children}</Providers>
        <PersonJsonLd />
        <WebSiteJsonLd />
      </body>
    </html>
  );
}
