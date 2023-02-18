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
      course: {
        Row: {
          created_at: string | null
          detail: string | null
          id: number
          image: string | null
          live: boolean | null
          main_key: number | null
          name: string | null
          owner: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          detail?: string | null
          id?: number
          image?: string | null
          live?: boolean | null
          main_key?: number | null
          name?: string | null
          owner?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          detail?: string | null
          id?: number
          image?: string | null
          live?: boolean | null
          main_key?: number | null
          name?: string | null
          owner?: number | null
          updated_at?: string | null
        }
      }
      creator: {
        Row: {
          created_at: string | null
          id: number
          person: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          person?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          person?: string | null
          updated_at?: string | null
        }
      }
      enrollment: {
        Row: {
          course: number | null
          created_at: string | null
          id: number
          student: number | null
          updated_at: string | null
        }
        Insert: {
          course?: number | null
          created_at?: string | null
          id?: number
          student?: number | null
          updated_at?: string | null
        }
        Update: {
          course?: number | null
          created_at?: string | null
          id?: number
          student?: number | null
          updated_at?: string | null
        }
      }
      lesson: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          main_key: number | null
          name: string | null
          unit: number | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          main_key?: number | null
          name?: string | null
          unit?: number | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          main_key?: number | null
          name?: string | null
          unit?: number | null
          updated_at?: string | null
        }
      }
      owner: {
        Row: {
          created_at: string | null
          id: number
          person: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          person?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          person?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      student: {
        Row: {
          created_at: string | null
          id: number
          person: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          person?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          person?: string | null
          updated_at?: string | null
        }
      }
      unit: {
        Row: {
          content: string | null
          course: number | null
          created_at: string | null
          id: number
          image: string | null
          live: boolean | null
          main_key: number | null
          name: string | null
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          course?: number | null
          created_at?: string | null
          id?: number
          image?: string | null
          live?: boolean | null
          main_key?: number | null
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          course?: number | null
          created_at?: string | null
          id?: number
          image?: string | null
          live?: boolean | null
          main_key?: number | null
          name?: string | null
          updated_at?: string | null
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

