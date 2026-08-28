import { NextResponse } from 'next/server';
import { apiError, apiSuccess, ErrorCode } from '@/lib/api/errors';
import { rateLimit, rateLimitHeaders } from '@/lib/security/rate-limit';
import { contactSchema } from '@/features/contact/schema';
import { sendContactMessage } from '@/features/contact/server/send';

const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

const getClientKey = (request: Request): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return request.headers.get('x-real-ip') ?? 'anonymous';
};

export async function POST(request: Request) {
  const key = `contact:${getClientKey(request)}`;
  const gate = rateLimit(key, { limit: RATE_LIMIT, windowMs: WINDOW_MS });
  const headers = rateLimitHeaders(gate, RATE_LIMIT);
  if (!gate.ok) {
    const response = apiError(ErrorCode.RATE_LIMITED, 'Too many messages. Try again later.');
    Object.entries(headers).forEach(([k, v]) => response.headers.set(k, String(v)));
    return response;
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return apiError(ErrorCode.VALIDATION_ERROR, 'Body must be JSON.');
  }

  const parsed = contactSchema.safeParse(json);
  if (!parsed.success) {
    return apiError(ErrorCode.VALIDATION_ERROR, 'Invalid submission.', {
      fieldErrors: parsed.error.flatten().fieldErrors,
    });
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    // Honeypot filled — pretend success. Bots do not need the truth.
    return apiSuccess({ ok: true });
  }

  const result = await sendContactMessage(parsed.data);
  if (!result.ok) {
    return apiError(ErrorCode.UPSTREAM_ERROR, 'Message could not be delivered.');
  }

  const response = NextResponse.json({ ok: true });
  Object.entries(headers).forEach(([k, v]) => response.headers.set(k, String(v)));
  return response;
}
