// All table names are prefixed with "ruff_" so this project can safely share
// a Supabase instance with other projects without table name collisions.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      ruff_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      ruff_projects: {
        Row: {
          id: string
          slug: string
          title: string
          client: string
          description: string | null
          bg_color: string
          image_url: string | null
          href: string | null
          categories: string[]
          is_featured: boolean
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          client: string
          description?: string | null
          bg_color?: string
          image_url?: string | null
          href?: string | null
          categories?: string[]
          is_featured?: boolean
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          client?: string
          description?: string | null
          bg_color?: string
          image_url?: string | null
          href?: string | null
          categories?: string[]
          is_featured?: boolean
          sort_order?: number
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      ruff_testimonials: {
        Row: {
          id: string
          quote: string
          credit: string
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          quote: string
          credit: string
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          quote?: string
          credit?: string
          sort_order?: number
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      ruff_client_logos: {
        Row: {
          id: string
          title: string
          image_url: string
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          image_url: string
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          image_url?: string
          sort_order?: number
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      ruff_scoops: {
        Row: {
          id: string
          title: string
          type: 'job' | 'news'
          category: string | null
          description: string | null
          href: string | null
          sort_order: number
          published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          type: 'job' | 'news'
          category?: string | null
          description?: string | null
          href?: string | null
          sort_order?: number
          published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          type?: 'job' | 'news'
          category?: string | null
          description?: string | null
          href?: string | null
          sort_order?: number
          published?: boolean
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
