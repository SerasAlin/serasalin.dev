import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, 'Please tell me who you are.').max(120),
  email: z.string().email('That does not look like an email address.'),
  subject: z.string().min(1, 'Add a short subject.').max(160),
  message: z.string().min(20, 'A little more context helps.').max(4000),
  // Simple honeypot — filled by bots, ignored by humans.
  website: z.string().max(0).optional().default(''),
});

export type ContactFormValues = z.infer<typeof contactSchema>;
