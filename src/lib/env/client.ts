import { z } from 'zod';

const ClientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
});

const raw = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
};

const parsed = ClientEnvSchema.safeParse(raw);

if (!parsed.success) {
  const flat = parsed.error.flatten().fieldErrors;
  const formatted = Object.entries(flat)
    .map(([key, errs]) => `  ${key}: ${errs?.join(', ')}`)
    .join('\n');
  throw new Error(`Invalid public environment variables:\n${formatted}`);
}

export const clientEnv = parsed.data;
export type ClientEnv = typeof clientEnv;
