import { NextResponse } from 'next/server';
import { MoodQuotesRegistry, SUPPORTED_MOODS } from '@/lib/types';
import moodQuotesData from '@/data/moodQuotes.json';

const quotes = moodQuotesData as MoodQuotesRegistry;

/**
 * GET /api/quotes
 * Returns the list of supported moods and their empathetic affirmations.
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      moods: SUPPORTED_MOODS,
      quotes,
    },
  });
}
