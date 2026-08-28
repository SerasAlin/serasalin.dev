import { NextResponse } from 'next/server';
import { z } from 'zod';

export const ErrorCode = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMITED: 'RATE_LIMITED',
  UPSTREAM_ERROR: 'UPSTREAM_ERROR',
  INTERNAL: 'INTERNAL',
} as const;

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode];

export const errorEnvelopeSchema = z.object({
  error: z.object({
    code: z.enum([
      ErrorCode.VALIDATION_ERROR,
      ErrorCode.NOT_FOUND,
      ErrorCode.RATE_LIMITED,
      ErrorCode.UPSTREAM_ERROR,
      ErrorCode.INTERNAL,
    ]),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
});

export type ApiErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;

const statusFor: Record<ErrorCodeValue, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  UPSTREAM_ERROR: 502,
  INTERNAL: 500,
};

export const apiError = (
  code: ErrorCodeValue,
  message: string,
  details?: Record<string, unknown>,
): NextResponse<ApiErrorEnvelope> => {
  const body: ApiErrorEnvelope = { error: { code, message, ...(details ? { details } : {}) } };
  return NextResponse.json(body, { status: statusFor[code] });
};

export const apiSuccess = <T>(data: T, init?: ResponseInit): NextResponse<T> =>
  NextResponse.json(data, init);
