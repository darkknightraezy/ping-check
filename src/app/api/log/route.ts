import { NextRequest, NextResponse } from 'next/server';
import { logMoodSelection } from '@/lib/supabase';
import { MoodKey, SUPPORTED_MOODS, LogPayload } from '@/lib/types';
import {
  cleanupRateLimitBuckets,
  enforceRateLimit,
  normalizeReferrer,
  rejectOversizedRequest,
} from '@/lib/apiProtection';

const validMoodKeys = new Set<string>(SUPPORTED_MOODS.map((m) => m.key));

/**
 * POST /api/log
 * Logs an anonymous mood selection.
 * No IP, session, or identifier is persisted by the application.
 */
export async function POST(req: NextRequest) {
  cleanupRateLimitBuckets();

  const oversized = rejectOversizedRequest(req);
  if (oversized) return oversized;

  const rateLimited = enforceRateLimit(req, 'mood-log', 30, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const body = (await req.json()) as Partial<LogPayload>;
    const { mood, referrer } = body;

    if (!mood || typeof mood !== 'string' || !validMoodKeys.has(mood.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid or missing mood. Must be one of: ${Array.from(validMoodKeys).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const normalizedMood = mood.toLowerCase() as MoodKey;
    const sanitizedReferrer = normalizeReferrer(referrer);
    const result = await logMoodSelection(normalizedMood, sanitizedReferrer);

    return NextResponse.json({
      success: true,
      message: 'Logged anonymously',
      fallback: result.fallback,
    });
  } catch (err: unknown) {
    console.error('[API:log] Error processing log request:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid request.',
      },
      { status: 400 }
    );
  }
}
