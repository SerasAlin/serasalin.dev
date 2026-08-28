import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { profile } from '@/content/profile';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata({
  title: 'About',
  description: profile.bio,
  path: '/about',
});

export default function AboutPage() {
  return (
    <Container size="narrow">
      <PageHeader
        eyebrow="About"
        title={`${profile.name}, ${profile.role.toLowerCase()}.`}
        description={profile.headline}
      />
      <Typography paragraph>{profile.bio}</Typography>
      <Typography variant="h5" component="h2">
        What I care about
      </Typography>
      <ul>
        {profile.focus.map((f) => (
          <li key={f}>
            <Typography component="span">{f}</Typography>
          </li>
        ))}
      </ul>
      <Typography variant="h5" component="h2" sx={{ mt: 3 }}>
        Currently learning
      </Typography>
      <Typography paragraph color="text.secondary">
        {profile.currentlyLearning.join(', ')}.
      </Typography>
      <Typography variant="h5" component="h2" sx={{ mt: 3 }}>
        Where to find me
      </Typography>
      <Typography component="p" color="text.secondary">
        Location: {profile.location} ({profile.timezone}).
      </Typography>
      <Typography component="p">
        Email: <a href={`mailto:${profile.email}`}>{profile.email}</a>.
      </Typography>
    </Container>
  );
}
