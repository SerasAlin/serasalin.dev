import { notFound } from 'next/navigation';
import Link from 'next/link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { Container } from '@/components/layout/container';
import { articles, getArticleBySlug, type ArticleBlock } from '@/content/writing';
import { buildPageMetadata } from '@/lib/seo/metadata';
import { ArticleJsonLd } from '@/components/seo/json-ld';
import styles from './article.module.css';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () => articles.map((a) => ({ slug: a.slug }));

export const generateMetadata = async ({ params }: PageProps) => {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return buildPageMetadata({ title: 'Article not found', path: `/writing/${slug}` });
  return buildPageMetadata({
    title: article.title,
    description: article.description,
    path: `/writing/${article.slug}`,
    type: 'article',
    publishedTime: article.publishedAt,
    keywords: article.tags,
  });
};

const renderBlock = (block: ArticleBlock, index: number) => {
  switch (block.type) {
    case 'heading': {
      const Tag = `h${block.level}` as unknown as 'h2' | 'h3';
      const variant = block.level === 2 ? 'h4' : 'h5';
      return (
        <Typography key={index} variant={variant} component={Tag} sx={{ mt: 3 }}>
          {block.text}
        </Typography>
      );
    }
    case 'paragraph':
      return (
        <Typography key={index} paragraph>
          {block.text}
        </Typography>
      );
    case 'code':
      return (
        <pre key={index} className={styles.code} aria-label={`${block.language} code`}>
          <code>{block.value}</code>
        </pre>
      );
    case 'callout':
      return (
        <Alert
          key={index}
          severity={block.tone === 'warning' ? 'warning' : 'info'}
          variant="outlined"
          sx={{ my: 2 }}
        >
          {block.text}
        </Alert>
      );
  }
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <Container size="narrow">
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        path={`/writing/${article.slug}`}
        datePublished={article.publishedAt}
        {...(article.updatedAt ? { dateModified: article.updatedAt } : {})}
      />
      <article className={styles.article}>
        <header className={styles.header}>
          <Typography variant="overline" color="text.secondary">
            {article.publishedAt} · {article.readingMinutes} min read
          </Typography>
          <Typography variant="h2" component="h1">
            {article.title}
          </Typography>
          <Typography color="text.secondary">{article.description}</Typography>
        </header>
        {article.body.map((block, i) => renderBlock(block, i))}
        <footer className={styles.footer}>
          <Button LinkComponent={Link} href="/writing" variant="text">
            ← All writing
          </Button>
        </footer>
      </article>
    </Container>
  );
}
