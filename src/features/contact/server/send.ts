import 'server-only';
import { serverEnv } from '@/lib/env/server';
import type { ContactFormValues } from '../schema';

export type SendResult =
  { ok: true } | { ok: false; reason: 'provider-error' | 'provider-not-configured' };

/**
 * The email provider is intentionally abstracted so this repository does not
 * depend on any paid service. The default `log` provider prints to the server
 * console; `resend`/`postmark` are opt-in and require env vars.
 */
export const sendContactMessage = async (values: ContactFormValues): Promise<SendResult> => {
  const provider = serverEnv.CONTACT_EMAIL_PROVIDER;

  if (provider === 'log') {
    console.info('[contact]', {
      name: values.name,
      email: values.email,
      subject: values.subject,
      length: values.message.length,
    });
    return { ok: true };
  }

  if (provider === 'resend') {
    if (!serverEnv.RESEND_API_KEY || !serverEnv.CONTACT_TO_ADDRESS) {
      return { ok: false, reason: 'provider-not-configured' };
    }
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serverEnv.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'contact@serasalin.dev',
          to: serverEnv.CONTACT_TO_ADDRESS,
          reply_to: values.email,
          subject: `[serasalin.dev] ${values.subject}`,
          text: `From: ${values.name} <${values.email}>\n\n${values.message}`,
        }),
      });
      return response.ok ? { ok: true } : { ok: false, reason: 'provider-error' };
    } catch {
      return { ok: false, reason: 'provider-error' };
    }
  }

  // postmark: unimplemented — provider-not-configured signals graceful failure.
  return { ok: false, reason: 'provider-not-configured' };
};
