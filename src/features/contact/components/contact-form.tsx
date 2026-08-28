'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { contactSchema, type ContactFormValues } from '../schema';
import styles from './contact-form.module.css';

type ServerState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

export const ContactForm = () => {
  const [state, setState] = useState<ServerState>({ kind: 'idle' });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '', website: '' },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (values) => {
    setState({ kind: 'submitting' });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          error?: { message?: string };
        } | null;
        setState({
          kind: 'error',
          message: body?.error?.message ?? 'Something went wrong. Please try again.',
        });
        return;
      }
      setState({ kind: 'success' });
      reset();
    } catch {
      setState({ kind: 'error', message: 'Network error. Please try again.' });
    }
  };

  return (
    <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.row}>
        <TextField
          label="Name"
          fullWidth
          required
          autoComplete="name"
          error={!!errors.name}
          helperText={errors.name?.message ?? ' '}
          {...register('name')}
        />
        <TextField
          label="Email"
          type="email"
          fullWidth
          required
          autoComplete="email"
          error={!!errors.email}
          helperText={errors.email?.message ?? ' '}
          {...register('email')}
        />
      </div>
      <TextField
        label="Subject"
        fullWidth
        required
        error={!!errors.subject}
        helperText={errors.subject?.message ?? ' '}
        {...register('subject')}
      />
      <TextField
        label="Message"
        multiline
        minRows={6}
        fullWidth
        required
        error={!!errors.message}
        helperText={errors.message?.message ?? ' '}
        {...register('message')}
      />

      {/* Honeypot field. Hidden from real users. */}
      <div className={styles.honeypot} aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      {state.kind === 'error' ? (
        <Alert severity="error" role="alert">
          {state.message}
        </Alert>
      ) : null}
      {state.kind === 'success' ? (
        <Alert severity="success" role="status">
          Message sent. I&apos;ll reply from my inbox.
        </Alert>
      ) : null}

      <div className={styles.actions}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting || state.kind === 'submitting'}
          endIcon={
            isSubmitting || state.kind === 'submitting' ? (
              <CircularProgress size={16} color="inherit" />
            ) : null
          }
        >
          Send message
        </Button>
      </div>
    </form>
  );
};
