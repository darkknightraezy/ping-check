import { NextRequest, NextResponse } from 'next/server';
import { MoodKey, SUPPORTED_MOODS } from '@/lib/types';
import {
  cleanupRateLimitBuckets,
  enforceRateLimit,
  rejectOversizedRequest,
} from '@/lib/apiProtection';

interface VentPayload {
  text: string;
  mood?: string;
}

const validMoodKeys = new Set<string>(SUPPORTED_MOODS.map((m) => m.key));
const MAX_VENT_LENGTH = 1000;

/**
 * POST /api/vent
 * Accepts an anonymous student thought/vent.
 * Strictly non-identifying: does not persist IPs, headers, tokens, or cookies.
 */
export async function POST(req: NextRequest) {
  cleanupRateLimitBuckets();

  const oversized = rejectOversizedRequest(req);
  if (oversized) return oversized;

  const rateLimited = enforceRateLimit(req, 'vent-submit', 5, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const body = (await req.json()) as Partial<VentPayload>;
    const { text, mood } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Text cannot be empty.' },
        { status: 400 }
      );
    }

    if (text.length > MAX_VENT_LENGTH) {
      return NextResponse.json(
        { success: false, message: `Text cannot exceed ${MAX_VENT_LENGTH} characters.` },
        { status: 400 }
      );
    }

    const normalizedMood = typeof mood === 'string' && validMoodKeys.has(mood.toLowerCase())
      ? (mood.toLowerCase() as MoodKey)
      : 'unspecified';
    const sanitizedText = text.trim();

    console.log(
      `[Vent:Anonymous] Received anonymous student reflection (${sanitizedText.length} chars) - Mood: ${normalizedMood}`
    );

    return NextResponse.json({
      success: true,
      message: 'Your reflection was safely and anonymously received.',
    });
  } catch (err: unknown) {
    console.error('[API:vent] Error processing vent request:', err);
    return NextResponse.json(
      { success: false, message: 'Invalid request.' },
      { status: 400 }
    );
  }
}
