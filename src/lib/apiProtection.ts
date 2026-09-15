import { NextRequest, NextResponse } from 'next/server';

const MAX_JSON_BODY_BYTES = 12_000;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function rejectOversizedRequest(req: NextRequest): NextResponse | null {
  const contentLength = Number(req.headers.get('content-length') || 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_JSON_BODY_BYTES) {
    return NextResponse.json(
      { success: false, message: 'Request is too large.' },
      { status: 413 }
    );
  }
  return null;
}

/**
 * Best-effort in-memory protection for a serverless instance.
 * The forwarded address is used only as a short-lived bucket key and is never persisted.
 */
export function enforceRateLimit(
  req: NextRequest,
  scope: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const clientKey = forwardedFor?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'anonymous';
  const key = `${scope}:${clientKey}`;
  const now = Date.now();
  const current = rateLimitBuckets.get(key);

  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  if (current.count >= limit) {
    return NextResponse.json(
      { success: false, message: 'Please wait a moment before trying again.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil((current.resetAt - now) / 1000)) },
      }
    );
  }

  current.count += 1;
  return null;
}

export function normalizeReferrer(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;

  try {
    const parsed = new URL(value.trim());
    return parsed.origin.slice(0, 200);
  } catch {
    return null;
  }
}

export function cleanupRateLimitBuckets(now = Date.now()): void {
  if (rateLimitBuckets.size < 1000) return;
  for (const [key, bucket] of Array.from(rateLimitBuckets.entries())) {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(key);
  }
}
