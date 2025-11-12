// TypeScript types generated from Supabase schema
// This file defines the database structure for type safety

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      indeed_jobs: {
        Row: {
          id: string
          job_id: string
          title: string
          company: string
          location: string
          salary: string | null
          job_type: string | null
          experience_level: string | null
          description: string | null
          snippet: string | null
          job_url: string
          posted_date: string
          scraped_at: string
          search_query: string
          is_new: boolean
          is_read: boolean
          is_favorited: boolean
          is_applied: boolean
          applied_at: string | null
          matched_assessment_types: string[] | null
          matching_score: number | null
          category: string | null
          source: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          job_id: string
          title: string
          company: string
          location: string
          salary?: string | null
          job_type?: string | null
          experience_level?: string | null
          description?: string | null
          snippet?: string | null
          job_url: string
          posted_date: string
          scraped_at?: string
          search_query: string
          is_new?: boolean
          is_read?: boolean
          is_favorited?: boolean
          is_applied?: boolean
          applied_at?: string | null
          matched_assessment_types?: string[] | null
          matching_score?: number | null
          category?: string | null
          source?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          job_id?: string
          title?: string
          company?: string
          location?: string
          salary?: string | null
          job_type?: string | null
          experience_level?: string | null
          description?: string | null
          snippet?: string | null
          job_url?: string
          posted_date?: string
          scraped_at?: string
          search_query?: string
          is_new?: boolean
          is_read?: boolean
          is_favorited?: boolean
          is_applied?: boolean
          applied_at?: string | null
          matched_assessment_types?: string[] | null
          matching_score?: number | null
          category?: string | null
          source?: string | null
          metadata?: Json | null
        }
      }
      search_queries: {
        Row: {
          id: string
          keywords: string
          location: string | null
          experience_level: string[] | null
          is_active: boolean
          rss_url: string
          created_at: string
          last_run: string | null
          jobs_found_count: number
          last_job_date: string | null
        }
        Insert: {
          id?: string
          keywords: string
          location?: string | null
          experience_level?: string[] | null
          is_active?: boolean
          rss_url: string
          created_at?: string
          last_run?: string | null
          jobs_found_count?: number
          last_job_date?: string | null
        }
        Update: {
          id?: string
          keywords?: string
          location?: string | null
          experience_level?: string[] | null
          is_active?: boolean
          rss_url?: string
          created_at?: string
          last_run?: string | null
          jobs_found_count?: number
          last_job_date?: string | null
        }
      }
      user_job_interactions: {
        Row: {
          id: string
          user_id: string
          job_id: string
          is_favorited: boolean
          is_applied: boolean
          notes: string | null
          application_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          job_id: string
          is_favorited?: boolean
          is_applied?: boolean
          notes?: string | null
          application_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          job_id?: string
          is_favorited?: boolean
          is_applied?: boolean
          notes?: string | null
          application_status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      recent_jobs: {
        Row: {
          id: string | null
          job_id: string | null
          title: string | null
          company: string | null
          location: string | null
          experience_level: string | null
          posted_date: string | null
          job_url: string | null
          is_new: boolean | null
          matched_assessment_types: string[] | null
          matching_score: number | null
        }
      }
      top_matched_jobs: {
        Row: {
          id: string | null
          job_id: string | null
          title: string | null
          company: string | null
          location: string | null
          experience_level: string | null
          matched_assessment_types: string[] | null
          matching_score: number | null
          job_url: string | null
        }
      }
    }
    Functions: {
      mark_old_jobs_as_read: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      cleanup_old_jobs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_job_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_jobs: number
          new_jobs: number
          favorited_jobs: number
          applied_jobs: number
          medior_jobs: number
          senior_jobs: number
          jobs_last_24h: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
