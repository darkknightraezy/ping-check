import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  const username = getAuthenticatedAdmin(request);
  return NextResponse.json({ authenticated: Boolean(username), username });
}
