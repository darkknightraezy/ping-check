import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/adminAuth';
import { getAdminAnalytics } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const username = getAuthenticatedAdmin(request);
  if (!username) return NextResponse.json({ success: false, message: 'Admin authentication required.' }, { status: 401 });
  const analytics = await getAdminAnalytics();
  return NextResponse.json({ success: true, username, data: analytics }, { headers: { 'Cache-Control': 'private, no-store' } });
}
