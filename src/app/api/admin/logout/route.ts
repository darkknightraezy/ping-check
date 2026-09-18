import { NextResponse } from 'next/server';
import { clearAdminSession } from '@/lib/adminAuth';

export async function POST() {
  return clearAdminSession(NextResponse.json({ success: true }));
}
