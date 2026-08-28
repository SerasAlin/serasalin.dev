import Link from 'next/link';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-4 px-6 py-16">
      <Typography variant="overline" color="text.secondary">
        404 · not found
      </Typography>
      <Typography variant="h2" component="h1">
        This route does not exist.
      </Typography>
      <Typography color="text.secondary">
        Either the page was moved, or the address was typed by hand. Head back to the shell.
      </Typography>
      <Button LinkComponent={Link} href="/" variant="contained" className="mt-2">
        Go home
      </Button>
    </main>
  );
}
