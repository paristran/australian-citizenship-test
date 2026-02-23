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
          full_name: string | null
          australian_council: string | null
          citizenship_application_date: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          australian_council?: string | null
          citizenship_application_date?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          australian_council?: string | null
          citizenship_application_date?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      test_attempts: {
        Row: {
          id: string
          user_id: string
          score: number
          total_questions: number
          percentage: number
          status: 'in_progress' | 'completed' | 'abandoned'
          started_at: string
          completed_at: string | null
          time_spent_seconds: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          score: number
          total_questions: number
          percentage: number
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          time_spent_seconds?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          score?: number
          total_questions?: number
          percentage?: number
          status?: 'in_progress' | 'completed' | 'abandoned'
          started_at?: string
          completed_at?: string | null
          time_spent_seconds?: number | null
          created_at?: string
        }
      }
      test_answers: {
        Row: {
          id: string
          attempt_id: string
          question_id: number
          selected_answer: number | null
          is_correct: boolean | null
          answered_at: string
        }
        Insert: {
          id?: string
          attempt_id: string
          question_id: number
          selected_answer?: number | null
          is_correct?: boolean | null
          answered_at?: string
        }
        Update: {
          id?: string
          attempt_id?: string
          question_id?: number
          selected_answer?: number | null
          is_correct?: boolean | null
          answered_at?: string
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
