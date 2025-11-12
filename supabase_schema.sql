-- Marketing Assessment Platform - Database Schema with RLS
-- This SQL should be run in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USER PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  target_role TEXT NOT NULL CHECK (target_role IN (
    'Marketing Manager',
    'Communications Manager',
    'Brand Manager',
    'Digital Marketing Manager'
  )),
  industry TEXT NOT NULL CHECK (industry IN (
    'Retail',
    'FMCG',
    'B2B Services',
    'Tech',
    'Healthcare',
    'E-commerce',
    'General'
  )),
  experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile"
  ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can create their own profile"
  ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS user_profiles_id_idx ON public.user_profiles(id);

-- ============================================================================
-- ASSESSMENT SESSIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assessment_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  score NUMERIC(5,2) NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('entry', 'mid', 'senior')),
  type TEXT NOT NULL CHECK (type IN (
    'numerical',
    'verbal',
    'logical',
    'abstract',
    'situational',
    'case-study',
    'personality',
    'technical',
    'behavioral'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on assessment_sessions
ALTER TABLE public.assessment_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_sessions
CREATE POLICY "Users can view their own assessment sessions"
  ON public.assessment_sessions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessment sessions"
  ON public.assessment_sessions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own assessment sessions"
  ON public.assessment_sessions
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS assessment_sessions_user_id_idx ON public.assessment_sessions(user_id);
CREATE INDEX IF NOT EXISTS assessment_sessions_created_at_idx ON public.assessment_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS assessment_sessions_type_idx ON public.assessment_sessions(type);

-- ============================================================================
-- ASSESSMENT RESULTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.assessment_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL,
  question_id TEXT NOT NULL,
  user_answer TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_spent INTEGER NOT NULL, -- in seconds
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on assessment_results
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_results
CREATE POLICY "Users can view their own assessment results"
  ON public.assessment_results
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own assessment results"
  ON public.assessment_results
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS assessment_results_user_id_idx ON public.assessment_results(user_id);
CREATE INDEX IF NOT EXISTS assessment_results_session_id_idx ON public.assessment_results(session_id);
CREATE INDEX IF NOT EXISTS assessment_results_question_id_idx ON public.assessment_results(question_id);

-- ============================================================================
-- BOOKMARKED QUESTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookmarked_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  bookmarked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Enable RLS on bookmarked_questions
ALTER TABLE public.bookmarked_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarked_questions
CREATE POLICY "Users can view their own bookmarked questions"
  ON public.bookmarked_questions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarked questions"
  ON public.bookmarked_questions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarked questions"
  ON public.bookmarked_questions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS bookmarked_questions_user_id_idx ON public.bookmarked_questions(user_id);
CREATE INDEX IF NOT EXISTS bookmarked_questions_question_id_idx ON public.bookmarked_questions(question_id);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create a placeholder profile that will be updated during onboarding
  INSERT INTO public.user_profiles (id, target_role, industry, experience_years)
  VALUES (
    NEW.id,
    'Marketing Manager',
    'General',
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on user_profiles
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- VIEWS FOR EASY DATA ACCESS
-- ============================================================================

-- View to get user progress summary
CREATE OR REPLACE VIEW public.user_progress_summary AS
SELECT
  up.id AS user_id,
  up.target_role,
  up.industry,
  up.experience_years,
  COUNT(DISTINCT ases.id) AS total_assessments,
  COUNT(DISTINCT CASE WHEN ases.end_time IS NOT NULL THEN ases.id END) AS completed_assessments,
  COALESCE(AVG(CASE WHEN ases.end_time IS NOT NULL THEN ases.score END), 0) AS average_score,
  COALESCE(SUM(CASE WHEN ar.is_correct THEN 1 ELSE 0 END)::FLOAT / NULLIF(COUNT(ar.id), 0) * 100, 0) AS overall_accuracy
FROM public.user_profiles up
LEFT JOIN public.assessment_sessions ases ON up.id = ases.user_id
LEFT JOIN public.assessment_results ar ON up.id = ar.user_id
GROUP BY up.id, up.target_role, up.industry, up.experience_years;

-- Grant access to the view
GRANT SELECT ON public.user_progress_summary TO authenticated;

-- RLS for the view
ALTER VIEW public.user_progress_summary SET (security_invoker = on);

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.user_profiles IS 'Stores user profile information including role, industry, and experience';
COMMENT ON TABLE public.assessment_sessions IS 'Stores completed assessment sessions with scores and metadata';
COMMENT ON TABLE public.assessment_results IS 'Stores individual question results for each assessment session';
COMMENT ON TABLE public.bookmarked_questions IS 'Stores user bookmarked questions for later review';
COMMENT ON VIEW public.user_progress_summary IS 'Aggregated view of user progress across all assessments';
