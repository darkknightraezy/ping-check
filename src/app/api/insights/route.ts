import { NextResponse } from 'next/server';
import { getCommunityMoodInsights } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const insights = await getCommunityMoodInsights();
  return NextResponse.json(
    { success: true, data: insights },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    },
  );
}

