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
      user_profiles: {
        Row: {
          id: string
          target_role: 'Marketing Manager' | 'Communications Manager' | 'Brand Manager' | 'Digital Marketing Manager'
          industry: 'Retail' | 'FMCG' | 'B2B Services' | 'Tech' | 'Healthcare' | 'E-commerce' | 'General'
          experience_years: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          target_role: 'Marketing Manager' | 'Communications Manager' | 'Brand Manager' | 'Digital Marketing Manager'
          industry: 'Retail' | 'FMCG' | 'B2B Services' | 'Tech' | 'Healthcare' | 'E-commerce' | 'General'
          experience_years: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          target_role?: 'Marketing Manager' | 'Communications Manager' | 'Brand Manager' | 'Digital Marketing Manager'
          industry?: 'Retail' | 'FMCG' | 'B2B Services' | 'Tech' | 'Healthcare' | 'E-commerce' | 'General'
          experience_years?: number
          created_at?: string
          updated_at?: string
        }
      }
      assessment_sessions: {
        Row: {
          id: string
          user_id: string
          assessment_id: string
          start_time: string
          end_time: string | null
          score: number
          total_questions: number
          difficulty: 'entry' | 'mid' | 'senior'
          type: 'numerical' | 'verbal' | 'logical' | 'abstract' | 'situational' | 'case-study' | 'personality' | 'technical' | 'behavioral'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assessment_id: string
          start_time: string
          end_time?: string | null
          score?: number
          total_questions: number
          difficulty: 'entry' | 'mid' | 'senior'
          type: 'numerical' | 'verbal' | 'logical' | 'abstract' | 'situational' | 'case-study' | 'personality' | 'technical' | 'behavioral'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assessment_id?: string
          start_time?: string
          end_time?: string | null
          score?: number
          total_questions?: number
          difficulty?: 'entry' | 'mid' | 'senior'
          type?: 'numerical' | 'verbal' | 'logical' | 'abstract' | 'situational' | 'case-study' | 'personality' | 'technical' | 'behavioral'
          created_at?: string
        }
      }
      assessment_results: {
        Row: {
          id: string
          session_id: string
          user_id: string
          assessment_id: string
          question_id: string
          user_answer: string
          correct_answer: string
          is_correct: boolean
          time_spent: number
          timestamp: string
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          assessment_id: string
          question_id: string
          user_answer: string
          correct_answer: string
          is_correct: boolean
          time_spent: number
          timestamp: string
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          user_id?: string
          assessment_id?: string
          question_id?: string
          user_answer?: string
          correct_answer?: string
          is_correct?: boolean
          time_spent?: number
          timestamp?: string
          created_at?: string
        }
      }
      bookmarked_questions: {
        Row: {
          id: string
          user_id: string
          question_id: string
          bookmarked_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question_id: string
          bookmarked_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question_id?: string
          bookmarked_at?: string
        }
      }
    }
    Views: {
      user_progress_summary: {
        Row: {
          user_id: string
          target_role: string
          industry: string
          experience_years: number
          total_assessments: number
          completed_assessments: number
          average_score: number
          overall_accuracy: number
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
