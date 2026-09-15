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
DROP POLICY IF EXISTS "Allow anonymous insert only" ON public.logs;

CREATE POLICY "Allow anonymous insert only"
ON public.logs
FOR INSERT
TO anon
WITH CHECK (true);

-- Anonymous users cannot query or tamper with existing logs.
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON public.logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_logs_mood ON public.logs(mood);

-- 4. Anonymous survey responses. No identity, IP, session, or journal data is stored.
CREATE TABLE IF NOT EXISTS public.survey_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    helpfulness TEXT NOT NULL CHECK (helpfulness IN ('Not helpful', 'A little helpful', 'Somewhat helpful', 'Helpful', 'Very helpful')),
    feature TEXT NOT NULL CHECK (feature IN ('Mood check-in', 'Reflection journal', 'Breathing exercise', 'Grounding activity', 'Support resources', 'Other')),
    reuse TEXT NOT NULL CHECK (reuse IN ('Yes', 'Maybe', 'No')),
    improvement TEXT
);

ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous survey insert only" ON public.survey_responses;
CREATE POLICY "Allow anonymous survey insert only"
ON public.survey_responses
FOR INSERT
TO anon
WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_survey_responses_created_at ON public.survey_responses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_survey_responses_helpfulness ON public.survey_responses(helpfulness);
CREATE INDEX IF NOT EXISTS idx_survey_responses_feature ON public.survey_responses(feature);
