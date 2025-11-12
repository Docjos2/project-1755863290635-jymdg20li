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
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          total_questions_attempted: number
          total_correct_answers: number
          total_time_spent: number
          average_score: number
          last_active_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          total_questions_attempted?: number
          total_correct_answers?: number
          total_time_spent?: number
          average_score?: number
          last_active_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_questions_attempted?: number
          total_correct_answers?: number
          total_time_spent?: number
          average_score?: number
          last_active_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      assessment_results: {
        Row: {
          id: string
          user_id: string
          category: string
          score: number
          total_questions: number
          correct_answers: number
          time_taken: number
          answers: Json
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          score: number
          total_questions: number
          correct_answers: number
          time_taken: number
          answers: Json
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          score?: number
          total_questions?: number
          correct_answers?: number
          time_taken?: number
          answers?: Json
          completed_at?: string
          created_at?: string
        }
      }
      bookmarked_questions: {
        Row: {
          id: string
          user_id: string
          question_id: string
          category: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          category: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          category?: string
          notes?: string | null
          created_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: string
          sound_enabled: boolean
          notifications_enabled: boolean
          default_timer_duration: number
          preferred_language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: string
          sound_enabled?: boolean
          notifications_enabled?: boolean
          default_timer_duration?: number
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: string
          sound_enabled?: boolean
          notifications_enabled?: boolean
          default_timer_duration?: number
          preferred_language?: string
          created_at?: string
          updated_at?: string
        }
      }
      category_statistics: {
        Row: {
          id: string
          user_id: string
          category: string
          attempts_count: number
          total_questions_answered: number
          total_correct_answers: number
          best_score: number
          average_score: number
          total_time_spent: number
          last_attempt_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          attempts_count?: number
          total_questions_answered?: number
          total_correct_answers?: number
          best_score?: number
          average_score?: number
          total_time_spent?: number
          last_attempt_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          attempts_count?: number
          total_questions_answered?: number
          total_correct_answers?: number
          best_score?: number
          average_score?: number
          total_time_spent?: number
          last_attempt_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
