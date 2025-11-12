-- =====================================================
-- Marketing Assessment Platform - Database Schema
-- =====================================================
-- This script creates all necessary tables and security policies
-- for the marketing assessment preparation platform.
--
-- Run this SQL in your Supabase SQL Editor:
-- https://hxkptqkegbtuaezojnoa.supabase.co/project/_/sql
-- =====================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLE: profiles
-- =====================================================
-- Extends Supabase auth.users with additional user profile data
-- =====================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- TABLE: user_progress
-- =====================================================
-- Tracks overall user progress across all assessments
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_questions_attempted INTEGER DEFAULT 0,
  total_correct_answers INTEGER DEFAULT 0,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  average_score NUMERIC(5,2) DEFAULT 0.00,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_progress
CREATE POLICY "Users can view their own progress"
  ON public.user_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
  ON public.user_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
  ON public.user_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);

-- =====================================================
-- TABLE: assessment_results
-- =====================================================
-- Stores individual assessment attempt results
-- =====================================================

CREATE TABLE IF NOT EXISTS public.assessment_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- 'numerical', 'verbal', 'logical', etc.
  score NUMERIC(5,2) NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken INTEGER NOT NULL, -- in seconds
  answers JSONB NOT NULL, -- Array of {questionId, userAnswer, isCorrect, timeSpent}
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.assessment_results ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessment_results
CREATE POLICY "Users can view their own assessment results"
  ON public.assessment_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own assessment results"
  ON public.assessment_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX idx_assessment_results_user_id ON public.assessment_results(user_id);
CREATE INDEX idx_assessment_results_category ON public.assessment_results(category);
CREATE INDEX idx_assessment_results_completed_at ON public.assessment_results(completed_at DESC);

-- =====================================================
-- TABLE: bookmarked_questions
-- =====================================================
-- Stores user's bookmarked questions for later review
-- =====================================================

CREATE TABLE IF NOT EXISTS public.bookmarked_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question_id TEXT NOT NULL, -- The ID from the question data
  category TEXT NOT NULL, -- 'numerical', 'verbal', etc.
  notes TEXT, -- Optional user notes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Enable Row Level Security
ALTER TABLE public.bookmarked_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmarked_questions
CREATE POLICY "Users can view their own bookmarks"
  ON public.bookmarked_questions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks"
  ON public.bookmarked_questions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.bookmarked_questions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON public.bookmarked_questions FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX idx_bookmarked_questions_user_id ON public.bookmarked_questions(user_id);
CREATE INDEX idx_bookmarked_questions_category ON public.bookmarked_questions(category);

-- =====================================================
-- TABLE: user_settings
-- =====================================================
-- Stores user preferences and settings
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'light', -- 'light' or 'dark'
  sound_enabled BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  default_timer_duration INTEGER DEFAULT 30, -- in minutes
  preferred_language TEXT DEFAULT 'nl', -- 'nl' or 'en'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_settings
CREATE POLICY "Users can view their own settings"
  ON public.user_settings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings"
  ON public.user_settings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings"
  ON public.user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX idx_user_settings_user_id ON public.user_settings(user_id);

-- =====================================================
-- TABLE: category_statistics
-- =====================================================
-- Aggregated statistics per category for each user
-- =====================================================

CREATE TABLE IF NOT EXISTS public.category_statistics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  attempts_count INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  total_correct_answers INTEGER DEFAULT 0,
  best_score NUMERIC(5,2) DEFAULT 0.00,
  average_score NUMERIC(5,2) DEFAULT 0.00,
  total_time_spent INTEGER DEFAULT 0, -- in seconds
  last_attempt_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, category)
);

-- Enable Row Level Security
ALTER TABLE public.category_statistics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for category_statistics
CREATE POLICY "Users can view their own category statistics"
  ON public.category_statistics FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own category statistics"
  ON public.category_statistics FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own category statistics"
  ON public.category_statistics FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes for faster queries
CREATE INDEX idx_category_statistics_user_id ON public.category_statistics(user_id);
CREATE INDEX idx_category_statistics_category ON public.category_statistics(category);

-- =====================================================
-- FUNCTIONS: Auto-update updated_at timestamp
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers to tables with updated_at columns
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.category_statistics
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- FUNCTION: Auto-create profile on user signup
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');

  INSERT INTO public.user_progress (user_id)
  VALUES (NEW.id);

  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile, progress, and settings when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNCTION: Update category statistics after assessment
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_category_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.category_statistics (
    user_id,
    category,
    attempts_count,
    total_questions_answered,
    total_correct_answers,
    best_score,
    average_score,
    total_time_spent,
    last_attempt_at
  )
  VALUES (
    NEW.user_id,
    NEW.category,
    1,
    NEW.total_questions,
    NEW.correct_answers,
    NEW.score,
    NEW.score,
    NEW.time_taken,
    NEW.completed_at
  )
  ON CONFLICT (user_id, category)
  DO UPDATE SET
    attempts_count = category_statistics.attempts_count + 1,
    total_questions_answered = category_statistics.total_questions_answered + NEW.total_questions,
    total_correct_answers = category_statistics.total_correct_answers + NEW.correct_answers,
    best_score = GREATEST(category_statistics.best_score, NEW.score),
    average_score = (
      (category_statistics.average_score * category_statistics.attempts_count + NEW.score) /
      (category_statistics.attempts_count + 1)
    ),
    total_time_spent = category_statistics.total_time_spent + NEW.time_taken,
    last_attempt_at = NEW.completed_at,
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update category stats after each assessment
CREATE TRIGGER on_assessment_completed
  AFTER INSERT ON public.assessment_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_category_stats();

-- =====================================================
-- FUNCTION: Update user progress after assessment
-- =====================================================

CREATE OR REPLACE FUNCTION public.update_user_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_assessments INTEGER;
  total_score NUMERIC;
BEGIN
  -- Calculate totals
  SELECT
    COUNT(*),
    AVG(score)
  INTO total_assessments, total_score
  FROM public.assessment_results
  WHERE user_id = NEW.user_id;

  -- Update user progress
  UPDATE public.user_progress
  SET
    total_questions_attempted = (
      SELECT COALESCE(SUM(total_questions), 0)
      FROM public.assessment_results
      WHERE user_id = NEW.user_id
    ),
    total_correct_answers = (
      SELECT COALESCE(SUM(correct_answers), 0)
      FROM public.assessment_results
      WHERE user_id = NEW.user_id
    ),
    total_time_spent = (
      SELECT COALESCE(SUM(time_taken), 0)
      FROM public.assessment_results
      WHERE user_id = NEW.user_id
    ),
    average_score = total_score,
    last_active_at = NEW.completed_at,
    updated_at = NOW()
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update user progress after each assessment
CREATE TRIGGER on_assessment_update_progress
  AFTER INSERT ON public.assessment_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_progress();

-- =====================================================
-- Grant necessary permissions
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant permissions on tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- Grant permissions on sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- Success message
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📋 Tables created:';
  RAISE NOTICE '   - profiles';
  RAISE NOTICE '   - user_progress';
  RAISE NOTICE '   - assessment_results';
  RAISE NOTICE '   - bookmarked_questions';
  RAISE NOTICE '   - user_settings';
  RAISE NOTICE '   - category_statistics';
  RAISE NOTICE '🔒 Row Level Security enabled on all tables';
  RAISE NOTICE '🎯 Auto-triggers configured for user creation and statistics';
END $$;
