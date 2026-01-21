export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      brand_voices: {
        Row: {
          complexity: number | null
          confidence: number | null
          created_at: string
          formality: number | null
          id: string
          is_active: boolean | null
          name: string
          sample_phrases: string[] | null
          updated_at: string
          user_id: string
          warmth: number | null
        }
        Insert: {
          complexity?: number | null
          confidence?: number | null
          created_at?: string
          formality?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          sample_phrases?: string[] | null
          updated_at?: string
          user_id: string
          warmth?: number | null
        }
        Update: {
          complexity?: number | null
          confidence?: number | null
          created_at?: string
          formality?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          sample_phrases?: string[] | null
          updated_at?: string
          user_id?: string
          warmth?: number | null
        }
        Relationships: []
      }
      content_briefs: {
        Row: {
          additional_notes: string | null
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string
          id: string
          keywords: string[] | null
          status: Database["public"]["Enums"]["content_status"] | null
          target_audience: string | null
          title: string
          tone: string | null
          topic: string | null
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          additional_notes?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          keywords?: string[] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          target_audience?: string | null
          title: string
          tone?: string | null
          topic?: string | null
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          additional_notes?: string | null
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string
          id?: string
          keywords?: string[] | null
          status?: Database["public"]["Enums"]["content_status"] | null
          target_audience?: string | null
          title?: string
          tone?: string | null
          topic?: string | null
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
      content_pieces: {
        Row: {
          brief_id: string | null
          compliance_flags: Json | null
          content: string | null
          created_at: string
          id: string
          published_at: string | null
          readability_score: number | null
          scheduled_at: string | null
          seo_score: number | null
          status: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          brief_id?: string | null
          compliance_flags?: Json | null
          content?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          readability_score?: number | null
          scheduled_at?: string | null
          seo_score?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title: string
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          brief_id?: string | null
          compliance_flags?: Json | null
          content?: string | null
          created_at?: string
          id?: string
          published_at?: string | null
          readability_score?: number | null
          scheduled_at?: string | null
          seo_score?: number | null
          status?: Database["public"]["Enums"]["content_status"] | null
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_pieces_brief_id_fkey"
            columns: ["brief_id"]
            isOneToOne: false
            referencedRelation: "content_briefs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          display_name: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string
          user_id: string
          vertical: Database["public"]["Enums"]["vertical_type"] | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id: string
          vertical?: Database["public"]["Enums"]["vertical_type"] | null
        }
        Update: {
          company_name?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string
          user_id?: string
          vertical?: Database["public"]["Enums"]["vertical_type"] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_status: "draft" | "scheduled" | "published" | "archived"
      content_type:
        | "blog"
        | "article"
        | "case_study"
        | "product_description"
        | "email"
        | "landing_page"
      vertical_type:
        | "legal"
        | "healthcare"
        | "ecommerce"
        | "tech"
        | "accounting"
        | "finance"
        | "real_estate"
        | "custom"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      content_status: ["draft", "scheduled", "published", "archived"],
      content_type: [
        "blog",
        "article",
        "case_study",
        "product_description",
        "email",
        "landing_page",
      ],
      vertical_type: [
        "legal",
        "healthcare",
        "ecommerce",
        "tech",
        "accounting",
        "finance",
        "real_estate",
        "custom",
      ],
    },
  },
} as const
