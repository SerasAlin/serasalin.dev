import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { format } from 'date-fns';
import type { GithubSummary } from '@/lib/github/schemas';
import { GithubLanguagesChart } from './github-languages-chart';
import styles from './github-dashboard.module.css';

export const GithubDashboard = ({ summary }: { summary: GithubSummary }) => (
  <div className={styles.wrapper}>
    <header className={styles.profile}>
      <Image
        src={summary.user.avatar_url}
        alt=""
        width={72}
        height={72}
        className={styles.avatar}
      />
      <div>
        <Typography variant="h5">{summary.user.name ?? summary.user.login}</Typography>
        <Typography color="text.secondary">@{summary.user.login}</Typography>
        {summary.user.bio ? <Typography sx={{ mt: 0.5 }}>{summary.user.bio}</Typography> : null}
      </div>
      <div className={styles.metrics}>
        <Metric label="Repos" value={summary.user.public_repos} />
        <Metric label="Stars" value={summary.totalStars} />
        <Metric label="Followers" value={summary.user.followers} />
      </div>
    </header>

    <section className={styles.grid}>
      <div className={styles.chartCard}>
        <Typography variant="overline" color="text.secondary">
          Languages
        </Typography>
        <GithubLanguagesChart languages={summary.languages} />
      </div>
      <div className={styles.topicsCard}>
        <Typography variant="overline" color="text.secondary">
          Topics
        </Typography>
        <div className={styles.topics}>
          {summary.topics.length === 0 ? (
            <Typography color="text.secondary">No topics on public repositories yet.</Typography>
          ) : (
            summary.topics.map((t) => (
              <Chip key={t.name} label={`${t.name} · ${t.count}`} size="small" variant="outlined" />
            ))
          )}
        </div>
      </div>
    </section>

    <section>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Recently updated
      </Typography>
      <ul className={styles.repos}>
        {summary.repos.map((repo) => (
          <li key={repo.id}>
            <a
              className={styles.repo}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.repoHeader}>
                <span className={styles.repoName}>{repo.name}</span>
                <span className={styles.repoMeta}>
                  {repo.language ?? 'various'} · ★ {repo.stargazers_count}
                </span>
              </div>
              {repo.description ? (
                <p className={styles.repoDescription}>{repo.description}</p>
              ) : null}
              <p className={styles.repoFooter}>
                {repo.pushed_at
                  ? `Last push ${format(new Date(repo.pushed_at), 'd MMM yyyy')}`
                  : 'No commits yet.'}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </section>
  </div>
);

const Metric = ({ label, value }: { label: string; value: number }) => (
  <div className={styles.metric}>
    <Typography variant="overline" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="h5">{value}</Typography>
  </div>
);
