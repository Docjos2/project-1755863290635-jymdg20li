import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client (typed)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We're not using auth yet
  },
  realtime: {
    params: {
      eventsPerSecond: 2, // Rate limit for free tier
    },
  },
});

// Create untyped client for operations where generated types don't match manual schema
export const supabaseUntyped = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Type exports for Indeed Jobs
export type IndeedJob = Database['public']['Tables']['indeed_jobs']['Row'];
export type IndeedJobInsert = Database['public']['Tables']['indeed_jobs']['Insert'];
export type IndeedJobUpdate = Database['public']['Tables']['indeed_jobs']['Update'];

export type SearchQuery = Database['public']['Tables']['search_queries']['Row'];
export type UserJobInteraction = Database['public']['Tables']['user_job_interactions']['Row'];

// Helper type for job with additional computed fields
export interface EnrichedIndeedJob extends IndeedJob {
  daysAgo?: number;
  isRecentlyPosted?: boolean;
  matchPercentage?: number;
}

// Export database type for external use
export type { Database };
