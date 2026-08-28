import Typography from '@mui/material/Typography';
import { Container } from '@/components/layout/container';
import { PageHeader } from '@/components/common/page-header';
import { ContactForm } from '@/features/contact/components/contact-form';
import { profile } from '@/content/profile';
import { buildPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildPageMetadata({
  title: 'Contact',
  description: 'Send me a message.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <Container size="narrow">
      <PageHeader
        eyebrow="Contact"
        title="Say hello."
        description="Direct email works too — but this form lands in the same inbox."
      />
      <ContactForm />
      <Typography color="text.secondary" sx={{ mt: 3 }}>
        Or reach me directly at <a href={`mailto:${profile.email}`}>{profile.email}</a>.
      </Typography>
    </Container>
  );
}
