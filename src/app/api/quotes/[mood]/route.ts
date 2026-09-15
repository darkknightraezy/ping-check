import { NextRequest, NextResponse } from 'next/server';
import { MoodKey, MoodQuotesRegistry } from '@/lib/types';
import moodQuotesData from '@/data/moodQuotes.json';

const quotes = moodQuotesData as MoodQuotesRegistry;

interface RouteParams {
  params: {
    mood: string;
  };
}

/**
 * GET /api/quotes/:mood
 * Returns the empathetic quote for a single specified mood.
 */
export async function GET(_req: NextRequest, { params }: RouteParams) {
  const mood = params.mood?.toLowerCase() as MoodKey;

  if (quotes[mood]) {
    return NextResponse.json({
      success: true,
      data: quotes[mood],
    });
  }

  return NextResponse.json(
    {
      success: false,
      message: `No quote found for mood '${params.mood}'`,
    },
    { status: 404 }
  );
}
