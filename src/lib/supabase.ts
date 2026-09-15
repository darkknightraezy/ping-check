import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { MoodKey } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: SupabaseClient | null = null;
let supabaseAdmin: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project')) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log('[Analytics] Connected to Supabase analytics table.');
  } catch (err) {
    console.error('[Analytics] Failed to initialize Supabase client:', err);
  }
} else {
  console.log('[Analytics] Supabase credentials not configured. Operating in local anonymous logging mode.');
}

if (supabaseUrl && supabaseServiceKey && !supabaseUrl.includes('your-project')) {
  try {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } catch (err) {
    console.error('[Analytics] Failed to initialize aggregate insights client:', err);
  }
}

/**
 * Record an anonymous mood selection to Supabase.
 * Strictly non-identifying: strips IP addresses, cookies, session tokens, and user agents.
 * Only records: timestamp (auto-generated in DB), mood, and referrer.
 */
export async function logMoodSelection(
  mood: MoodKey,
  referrer?: string | null
): Promise<{ success: boolean; fallback?: boolean; error?: string }> {
  const sanitizedReferrer = referrer && typeof referrer === 'string'
    ? referrer.slice(0, 500)
    : null;

  if (!supabase) {
    console.log(`[Analytics:Local] Logged scan - Mood: ${mood}, Referrer: ${sanitizedReferrer || 'direct'}`);
    return { success: true, fallback: true };
  }

  try {
    // Insert-only call: no SELECT performed to strictly respect insert-only RLS policy
    const { error } = await supabase
      .from('logs')
      .insert([
        {
          mood,
          referrer: sanitizedReferrer,
        },
      ]);

    if (error) {
      console.error('[Analytics] Error writing to Supabase logs table:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Analytics] Unexpected error logging mood:', message);
    return { success: false, error: message };
  }
}

export interface SurveyResponsePayload {
  helpfulness: string;
  feature: string;
  reuse: string;
  improvement?: string | null;
}

export async function logSurveyResponse(
  response: SurveyResponsePayload,
): Promise<{ success: boolean; fallback?: boolean; error?: string }> {
  if (!supabase) {
    console.log('[Analytics:Local] Survey response received without persistence.');
    return { success: true, fallback: true };
  }

  try {
    const { error } = await supabase
      .from('survey_responses')
      .insert([{ ...response, improvement: response.improvement?.slice(0, 500) || null }]);

    if (error) {
      console.error('[Analytics] Error writing survey response:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Analytics] Unexpected survey error:', message);
    return { success: false, error: message };
  }
}

export interface SurveyInsights {
  available: boolean;
  total: number;
  windowDays: number;
  helpfulness: Array<{ label: string; percentage: number }>;
  features: Array<{ label: string; percentage: number }>;
  reuse: Array<{ label: string; percentage: number }>;
}

export async function getSurveyInsights(): Promise<SurveyInsights> {
  const windowDays = 90;
  const minimumResponses = 10;
  const unavailable: SurveyInsights = { available: false, total: 0, windowDays, helpfulness: [], features: [], reuse: [] };
  if (!supabaseAdmin) return unavailable;

  try {
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabaseAdmin
      .from('survey_responses')
      .select('helpfulness,feature,reuse,created_at')
      .gte('created_at', since)
      .limit(5000);
    if (error || !data || data.length < minimumResponses) return unavailable;

    const summarize = (field: 'helpfulness' | 'feature' | 'reuse') => {
      const counts = new Map<string, number>();
      for (const row of data) counts.set(row[field], (counts.get(row[field]) || 0) + 1);
      return Array.from(counts.entries())
        .map(([label, count]) => ({ label, percentage: Math.round((count / data.length) * 100) }))
        .sort((a, b) => b.percentage - a.percentage);
    };

    return {
      available: true,
      total: data.length,
      windowDays,
      helpfulness: summarize('helpfulness'),
      features: summarize('feature'),
      reuse: summarize('reuse'),
    };
  } catch (err) {
    console.error('[Analytics] Failed to build survey insights:', err);
    return unavailable;
  }
}

export interface CommunityMoodInsights {
  available: boolean;
  total: number;
  windowDays: number;
  distribution: Array<{ mood: MoodKey; percentage: number }>;
}

/**
 * Return only coarse, aggregate mood percentages. Raw rows never leave the server.
 * The minimum threshold prevents small groups from being represented publicly.
 */
export async function getCommunityMoodInsights(): Promise<CommunityMoodInsights> {
  const windowDays = 30;
  const minimumResponses = 10;
  const unavailable: CommunityMoodInsights = {
    available: false,
    total: 0,
    windowDays,
    distribution: [],
  };

  if (!supabaseAdmin) return unavailable;

  try {
    const since = new Date(Date.now() - windowDays * 24 * 60 * 60 * 1000).toISOString();
    const { data, error } = await supabaseAdmin
      .from('logs')
      .select('mood,created_at')
      .gte('created_at', since)
      .limit(5000);

    if (error || !data || data.length < minimumResponses) return unavailable;

    const counts = new Map<string, number>();
    for (const row of data) counts.set(row.mood, (counts.get(row.mood) || 0) + 1);

    const distribution = Array.from(counts.entries())
      .map(([mood, count]) => ({
        mood: mood as MoodKey,
        percentage: Math.round((count / data.length) * 100),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return { available: true, total: data.length, windowDays, distribution };
  } catch (err) {
    console.error('[Analytics] Failed to build community insights:', err);
    return unavailable;
  }
}
