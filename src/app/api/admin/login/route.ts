import { NextRequest, NextResponse } from 'next/server';
import { authenticate, attachAdminSession } from '@/lib/adminAuth';
import { cleanupRateLimitBuckets, enforceRateLimit } from '@/lib/apiProtection';

export async function POST(request: NextRequest) {
  cleanupRateLimitBuckets();
  const rateLimited = enforceRateLimit(request, 'admin-login', 10, 15 * 60_000);
  if (rateLimited) return rateLimited;
  try {
    const body = await request.json() as { username?: string; password?: string };
    const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!authenticate(username, password)) {
      return NextResponse.json({ success: false, message: 'Invalid admin credentials.' }, { status: 401 });
    }
    return attachAdminSession(NextResponse.json({ success: true, username }), username);
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid login request.' }, { status: 400 });
  }
}
