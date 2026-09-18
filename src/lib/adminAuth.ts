import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

const SESSION_COOKIE = 'ping-check-admin-session';
const SESSION_MAX_AGE = 60 * 60 * 8;

// These defaults make the requested accounts available immediately without
// storing the passwords in plaintext. For production, set
// PING_CHECK_ADMIN_USERS to a JSON object of SHA-256 password hashes and set
// PING_CHECK_ADMIN_SECRET to a long random value.
const DEFAULT_USERS: Record<string, string> = {
  president: 'e69a67e0ac7ca571be701be2c2f19c49fa019fc49c5225566a45361a19355753',
  devteam: '0671a1e00af93fec8edba5dce43ec3452b0090c141c2799e7b29fe7b0bd42b52',
  adviser: '65f2968c4a12b58f0ea473c2493348bc50347763b13116a3d5a61653bce6ddfe',
};

function users(): Record<string, string> {
  const configured = process.env.PING_CHECK_ADMIN_USERS;
  if (!configured) return DEFAULT_USERS;
  try {
    const parsed = JSON.parse(configured) as Record<string, string>;
    return Object.fromEntries(Object.entries(parsed).filter(([name, password]) => name && typeof password === 'string'));
  } catch {
    console.error('[Admin] Invalid PING_CHECK_ADMIN_USERS configuration; using safe defaults.');
    return DEFAULT_USERS;
  }
}

function digest(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

function secret(): string {
  return process.env.PING_CHECK_ADMIN_SECRET || '48170cf0c9eda74162dceac212021d68ed4fa10f49928b01f10a2633e922815f';
}

function signature(username: string): string {
  return createHmac('sha256', secret()).update(username).digest('hex');
}

function safeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function authenticate(username: string, password: string): boolean {
  const expected = users()[username];
  if (!expected || typeof password !== 'string') return false;
  return safeEqual(digest(password).toString('hex'), expected);
}

export function createSession(username: string): string {
  return `${username}.${signature(username)}`;
}

export function getAuthenticatedAdmin(request: NextRequest): string | null {
  const value = request.cookies.get(SESSION_COOKIE)?.value || '';
  const separator = value.indexOf('.');
  if (separator < 1) return null;
  const username = value.slice(0, separator);
  const suppliedSignature = value.slice(separator + 1);
  return users()[username] && safeEqual(suppliedSignature, signature(username)) ? username : null;
}

export function attachAdminSession(response: NextResponse, username: string): NextResponse {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: createSession(username),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  return response;
}

export function clearAdminSession(response: NextResponse): NextResponse {
  response.cookies.set({ name: SESSION_COOKIE, value: '', httpOnly: true, expires: new Date(0), path: '/' });
  return response;
}

export { SESSION_COOKIE };
