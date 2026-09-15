import { NextRequest, NextResponse } from 'next/server';
import { getSurveyInsights, logSurveyResponse } from '@/lib/supabase';
import { cleanupRateLimitBuckets, enforceRateLimit, rejectOversizedRequest } from '@/lib/apiProtection';

export const dynamic = 'force-dynamic';

const helpfulnessOptions = new Set(['Not helpful', 'A little helpful', 'Somewhat helpful', 'Helpful', 'Very helpful']);
const featureOptions = new Set(['Mood check-in', 'Reflection journal', 'Breathing exercise', 'Grounding activity', 'Support resources', 'Other']);
const reuseOptions = new Set(['Yes', 'Maybe', 'No']);

export async function POST(req: NextRequest) {
  cleanupRateLimitBuckets();
  const oversized = rejectOversizedRequest(req);
  if (oversized) return oversized;
  const rateLimited = enforceRateLimit(req, 'survey-submit', 5, 60 * 60_000);
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json() as Record<string, unknown>;
    const helpfulness = body.helpfulness;
    const feature = body.feature;
    const reuse = body.reuse;
    const improvement = typeof body.improvement === 'string' ? body.improvement.trim().slice(0, 500) : '';

    if (
      typeof helpfulness !== 'string' || !helpfulnessOptions.has(helpfulness) ||
      typeof feature !== 'string' || !featureOptions.has(feature) ||
      typeof reuse !== 'string' || !reuseOptions.has(reuse)
    ) {
      return NextResponse.json({ success: false, message: 'Please complete the required survey choices.' }, { status: 400 });
    }

    const result = await logSurveyResponse({ helpfulness, feature, reuse, improvement: improvement || null });
    if (!result.success) {
      return NextResponse.json({ success: false, message: 'The survey could not be saved right now.' }, { status: 503 });
    }

    return NextResponse.json({ success: true, fallback: result.fallback });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid survey request.' }, { status: 400 });
  }
}

export async function GET() {
  const insights = await getSurveyInsights();
  return NextResponse.json(
    { success: true, data: insights },
    { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' } },
  );
}

