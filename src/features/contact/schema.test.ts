import { describe, expect, it } from 'vitest';
import { contactSchema } from './schema';

describe('contactSchema', () => {
  it('accepts a valid submission', () => {
    const result = contactSchema.safeParse({
      name: 'Ada',
      email: 'ada@example.com',
      subject: 'Hi',
      message: 'This is a message longer than twenty chars.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a short message', () => {
    const result = contactSchema.safeParse({
      name: 'Ada',
      email: 'ada@example.com',
      subject: 'Hi',
      message: 'too short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = contactSchema.safeParse({
      name: 'Ada',
      email: 'not-an-email',
      subject: 'Hi',
      message: 'This is a message longer than twenty chars.',
    });
    expect(result.success).toBe(false);
  });
});
