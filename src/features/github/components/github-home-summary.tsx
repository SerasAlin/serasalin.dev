import Typography from '@mui/material/Typography';
import type { GithubSummary } from '@/lib/github/schemas';
import styles from './github-home-summary.module.css';

type Failure = { error: 'rate-limit' | 'upstream' | 'unknown' };
type Props = { summary: GithubSummary | Failure };

const isFailure = (s: Props['summary']): s is Failure => 'error' in s;

const failureMessage: Record<Failure['error'], string> = {
  'rate-limit': 'GitHub is rate limiting anonymous requests. Set GITHUB_TOKEN to raise the limit.',
  upstream: 'GitHub responded with an error. It should recover shortly.',
  unknown: 'Could not reach GitHub right now.',
};

export const GithubHomeSummary = ({ summary }: Props) => {
  if (isFailure(summary)) {
    return (
      <div className={styles.errorCard}>
        <Typography variant="overline" color="warning.main">
          GitHub unavailable
        </Typography>
        <Typography color="text.secondary">{failureMessage[summary.error]}</Typography>
      </div>
    );
  }
  const topRepos = summary.repos.slice(0, 4);
  return (
    <div className={styles.grid}>
      <div className={styles.stats}>
        <div>
          <Typography variant="overline" color="text.secondary">
            Public repos
          </Typography>
          <Typography variant="h4">{summary.user.public_repos}</Typography>
        </div>
        <div>
          <Typography variant="overline" color="text.secondary">
            Stars earned
          </Typography>
          <Typography variant="h4">{summary.totalStars}</Typography>
        </div>
        <div>
          <Typography variant="overline" color="text.secondary">
            Top language
          </Typography>
          <Typography variant="h4">{summary.languages[0]?.name ?? '—'}</Typography>
        </div>
      </div>
      <ul className={styles.repos}>
        {topRepos.map((repo) => (
          <li key={repo.id}>
            <a
              href={repo.html_url}
              className={styles.repoLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className={styles.repoName}>{repo.name}</span>
              <span className={styles.repoMeta}>
                {repo.language ?? 'various'} · ★ {repo.stargazers_count}
              </span>
            </a>
            {repo.description ? <p className={styles.repoDescription}>{repo.description}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
};
