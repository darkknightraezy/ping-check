-- ===================================================================
-- Supabase Schema for "Ping Check: How's Your Connection With Yourself?"
-- ===================================================================

-- 1. Create the logs table for anonymous scan & mood tracking
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    mood TEXT NOT NULL,
    referrer TEXT
);

-- 2. Enable Row Level Security (RLS) on the logs table
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- 3. Create a strict insert-only policy for the anonymous role
-- This allows incoming anonymous pings to log mood and referrer,
-- but strictly disallows SELECT, UPDATE, or DELETE from the public/anon role.
DROP POLICY IF EXISTS "Allow anonymous insert only" ON public.logs;

CREATE POLICY "Allow anonymous insert only"
ON public.logs
FOR INSERT
TO anon
WITH CHECK (true);

-- Explicitly ensure no SELECT, UPDATE, or DELETE policies exist for anon.
-- Anonymous users cannot query or tamper with existing logs.

-- Optional: index on created_at and mood for aggregated analytical reports
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_mood ON public.logs(mood);
