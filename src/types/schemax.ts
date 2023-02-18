export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      ingredients: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
          recipe_id: number | null
          unit: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
          recipe_id?: number | null
          unit?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
          recipe_id?: number | null
          unit?: string | null
        }
      }
      recipes: {
        Row: {
          description: string | null
          id: number
          instructions: string | null
          name: string
          serving: number | null
        }
        Insert: {
          description?: string | null
          id?: number
          instructions?: string | null
          name: string
          serving?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          instructions?: string | null
          name?: string
          serving?: number | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

