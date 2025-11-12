-- ============================================
-- Indeed Vacancy Monitoring - Supabase Schema
-- ============================================
-- This schema supports RSS feed-based job scraping
-- from Indeed Netherlands for marketing positions
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Main Jobs Table
-- ============================================
CREATE TABLE indeed_jobs (
  -- Primary identification
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id TEXT UNIQUE NOT NULL, -- Indeed's unique job ID from RSS

  -- Job details
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT, -- Often missing on Indeed
  job_type TEXT, -- Full-time, Part-time, Contract
  experience_level TEXT, -- Medior, Senior, Junior

  -- Content
  description TEXT, -- Full description from RSS
  snippet TEXT, -- Short preview
  job_url TEXT NOT NULL,

  -- Metadata
  posted_date TIMESTAMP NOT NULL,
  scraped_at TIMESTAMP DEFAULT NOW(),
  search_query TEXT NOT NULL, -- Which search found this job

  -- User interaction tracking
  is_new BOOLEAN DEFAULT TRUE,
  is_read BOOLEAN DEFAULT FALSE,
  is_favorited BOOLEAN DEFAULT FALSE,
  is_applied BOOLEAN DEFAULT FALSE,
  applied_at TIMESTAMP,

  -- Job-Assessment matching
  matched_assessment_types TEXT[], -- Array of matching assessment types
  matching_score INTEGER, -- 0-100 score for job-assessment match

  -- Additional data from RSS
  category TEXT, -- Job category from Indeed
  source TEXT DEFAULT 'indeed_rss',
  metadata JSONB -- Additional data storage
);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_indeed_jobs_job_id ON indeed_jobs(job_id);
CREATE INDEX idx_indeed_jobs_posted_date ON indeed_jobs(posted_date DESC);
CREATE INDEX idx_indeed_jobs_scraped_at ON indeed_jobs(scraped_at DESC);
CREATE INDEX idx_indeed_jobs_is_new ON indeed_jobs(is_new) WHERE is_new = true;
CREATE INDEX idx_indeed_jobs_search_query ON indeed_jobs(search_query);
CREATE INDEX idx_indeed_jobs_experience_level ON indeed_jobs(experience_level);
CREATE INDEX idx_indeed_jobs_location ON indeed_jobs(location);
CREATE INDEX idx_indeed_jobs_is_favorited ON indeed_jobs(is_favorited) WHERE is_favorited = true;
CREATE INDEX idx_indeed_jobs_matched_types ON indeed_jobs USING GIN(matched_assessment_types);

-- ============================================
-- Search Queries Configuration Table
-- ============================================
CREATE TABLE search_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keywords TEXT NOT NULL,
  location TEXT,
  experience_level TEXT[], -- Filter for experience levels
  is_active BOOLEAN DEFAULT TRUE,
  rss_url TEXT NOT NULL, -- Full RSS feed URL
  created_at TIMESTAMP DEFAULT NOW(),
  last_run TIMESTAMP,
  jobs_found_count INTEGER DEFAULT 0,
  last_job_date TIMESTAMP -- Track most recent job from this query
);

-- ============================================
-- Insert Default Search Queries (RSS Feeds)
-- ============================================
-- Indeed RSS format: https://nl.indeed.com/rss?q=keywords&l=location&sort=date

INSERT INTO search_queries (keywords, location, experience_level, rss_url) VALUES
  (
    'marketing manager medior OR senior',
    'Nederland',
    ARRAY['Medior', 'Senior'],
    'https://nl.indeed.com/rss?q=marketing+manager+medior+OR+senior&l=Nederland&sort=date'
  ),
  (
    'marketing director',
    'Nederland',
    ARRAY['Senior'],
    'https://nl.indeed.com/rss?q=marketing+director&l=Nederland&sort=date'
  ),
  (
    'brand manager medior OR senior',
    'Nederland',
    ARRAY['Medior', 'Senior'],
    'https://nl.indeed.com/rss?q=brand+manager+medior+OR+senior&l=Nederland&sort=date'
  ),
  (
    'digital marketing manager',
    'Nederland',
    ARRAY['Medior', 'Senior'],
    'https://nl.indeed.com/rss?q=digital+marketing+manager&l=Nederland&sort=date'
  ),
  (
    'content marketing manager',
    'Nederland',
    ARRAY['Medior', 'Senior'],
    'https://nl.indeed.com/rss?q=content+marketing+manager&l=Nederland&sort=date'
  ),
  (
    'performance marketing manager',
    'Nederland',
    ARRAY['Medior', 'Senior'],
    'https://nl.indeed.com/rss?q=performance+marketing+manager&l=Nederland&sort=date'
  ),
  (
    'marketing strategist',
    'Nederland',
    ARRAY['Medior', 'Senior'],
    'https://nl.indeed.com/rss?q=marketing+strategist&l=Nederland&sort=date'
  ),
  (
    'head of marketing',
    'Nederland',
    ARRAY['Senior'],
    'https://nl.indeed.com/rss?q=head+of+marketing&l=Nederland&sort=date'
  ),
  (
    'CMO OR "chief marketing officer"',
    'Nederland',
    ARRAY['Senior'],
    'https://nl.indeed.com/rss?q=CMO+OR+chief+marketing+officer&l=Nederland&sort=date'
  );

-- ============================================
-- User Job Interactions Table (Future: Multi-user Support)
-- ============================================
CREATE TABLE user_job_interactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL, -- localStorage ID or future auth ID
  job_id UUID REFERENCES indeed_jobs(id) ON DELETE CASCADE,
  is_favorited BOOLEAN DEFAULT FALSE,
  is_applied BOOLEAN DEFAULT FALSE,
  notes TEXT,
  application_status TEXT, -- 'applied', 'interview', 'rejected', 'accepted'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(user_id, job_id) -- One interaction per user per job
);

CREATE INDEX idx_user_interactions_user_id ON user_job_interactions(user_id);
CREATE INDEX idx_user_interactions_job_id ON user_job_interactions(job_id);

-- ============================================
-- Row Level Security (RLS) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE indeed_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_job_interactions ENABLE ROW LEVEL SECURITY;

-- Jobs table: Allow anonymous read access
CREATE POLICY "Allow anonymous read access on jobs"
  ON indeed_jobs FOR SELECT
  TO anon
  USING (true);

-- Jobs table: Allow service role full access (for N8N)
CREATE POLICY "Allow service role full access on jobs"
  ON indeed_jobs FOR ALL
  TO service_role
  USING (true);

-- Search queries: Allow anonymous read access
CREATE POLICY "Allow anonymous read access on search_queries"
  ON search_queries FOR SELECT
  TO anon
  USING (true);

-- Search queries: Allow service role full access
CREATE POLICY "Allow service role full access on search_queries"
  ON search_queries FOR ALL
  TO service_role
  USING (true);

-- User interactions: Users can manage their own interactions
CREATE POLICY "Users can view their own interactions"
  ON user_job_interactions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users can insert their own interactions"
  ON user_job_interactions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can update their own interactions"
  ON user_job_interactions FOR UPDATE
  TO anon
  USING (true);

-- ============================================
-- Helper Functions
-- ============================================

-- Function to mark jobs older than 24 hours as not new
CREATE OR REPLACE FUNCTION mark_old_jobs_as_read()
RETURNS INTEGER AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE indeed_jobs
  SET is_new = false
  WHERE is_new = true
    AND scraped_at < NOW() - INTERVAL '24 hours';

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up old jobs (older than 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_jobs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM indeed_jobs
  WHERE posted_date < NOW() - INTERVAL '90 days'
    AND is_favorited = false
    AND is_applied = false;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get job statistics
CREATE OR REPLACE FUNCTION get_job_stats()
RETURNS TABLE(
  total_jobs BIGINT,
  new_jobs BIGINT,
  favorited_jobs BIGINT,
  applied_jobs BIGINT,
  medior_jobs BIGINT,
  senior_jobs BIGINT,
  jobs_last_24h BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::BIGINT as total_jobs,
    COUNT(*) FILTER (WHERE is_new = true)::BIGINT as new_jobs,
    COUNT(*) FILTER (WHERE is_favorited = true)::BIGINT as favorited_jobs,
    COUNT(*) FILTER (WHERE is_applied = true)::BIGINT as applied_jobs,
    COUNT(*) FILTER (WHERE experience_level = 'Medior')::BIGINT as medior_jobs,
    COUNT(*) FILTER (WHERE experience_level = 'Senior')::BIGINT as senior_jobs,
    COUNT(*) FILTER (WHERE scraped_at > NOW() - INTERVAL '24 hours')::BIGINT as jobs_last_24h
  FROM indeed_jobs;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Sample Views for Common Queries
-- ============================================

-- View: Recent jobs (last 7 days)
CREATE OR REPLACE VIEW recent_jobs AS
SELECT
  id,
  job_id,
  title,
  company,
  location,
  experience_level,
  posted_date,
  job_url,
  is_new,
  matched_assessment_types,
  matching_score
FROM indeed_jobs
WHERE posted_date > NOW() - INTERVAL '7 days'
ORDER BY posted_date DESC;

-- View: Top matched jobs (high matching score)
CREATE OR REPLACE VIEW top_matched_jobs AS
SELECT
  id,
  job_id,
  title,
  company,
  location,
  experience_level,
  matched_assessment_types,
  matching_score,
  job_url
FROM indeed_jobs
WHERE matching_score >= 70
  AND matched_assessment_types IS NOT NULL
ORDER BY matching_score DESC, posted_date DESC;

-- ============================================
-- Database Setup Complete
-- ============================================
-- Next steps:
-- 1. Copy this file and run it in Supabase SQL Editor
-- 2. Verify tables are created successfully
-- 3. Get your anon key and service role key from Supabase settings
-- 4. Configure N8N workflow with Supabase credentials
-- 5. Test the workflow with a single search query
-- ============================================
