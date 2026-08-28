import 'server-only';
import { z } from 'zod';

const ServerEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  GITHUB_USERNAME: z.string().min(1).default('SerasAlin'),
  GITHUB_TOKEN: z.string().min(1).optional(),
  CONTACT_EMAIL_PROVIDER: z.enum(['log', 'resend', 'postmark']).default('log'),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_TO_ADDRESS: z.string().email().optional(),
});

const parsed = ServerEnvSchema.safeParse(process.env);

if (!parsed.success) {
  // Aggregate errors, then throw so the failure is visible during boot.
  const flat = parsed.error.flatten().fieldErrors;
  const formatted = Object.entries(flat)
    .map(([key, errs]) => `  ${key}: ${errs?.join(', ')}`)
    .join('\n');
  throw new Error(`Invalid server environment variables:\n${formatted}`);
}

export const serverEnv = parsed.data;
export type ServerEnv = typeof serverEnv;
