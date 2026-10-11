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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          bot_response: string
          created_at: string | null
          id: string
          sources: Json | null
          user_id: string | null
          user_message: string
        }
        Insert: {
          bot_response: string
          created_at?: string | null
          id?: string
          sources?: Json | null
          user_id?: string | null
          user_message: string
        }
        Update: {
          bot_response?: string
          created_at?: string | null
          id?: string
          sources?: Json | null
          user_id?: string | null
          user_message?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          author: string | null
          body: string
          category: string | null
          created_at: string | null
          event_id: string | null
          id: string
          meta_description: string | null
          published_at: string | null
          slug: string | null
          social_drafts: Json | null
          source_links: Json | null
          source_event_id: string | null
          status: string | null
          title: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          body: string
          category?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug?: string | null
          social_drafts?: Json | null
          source_links?: Json | null
          source_event_id?: string | null
          status?: string | null
          title?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          body?: string
          category?: string | null
          created_at?: string | null
          event_id?: string | null
          id?: string
          meta_description?: string | null
          published_at?: string | null
          slug?: string | null
          social_drafts?: Json | null
          source_links?: Json | null
          source_event_id?: string | null
          status?: string | null
          title?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_source_event_id_fkey"
            columns: ["source_event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      email_log: {
        Row: {
          email_type: string
          error_message: string | null
          event_id: string | null
          id: string
          sent_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          email_type: string
          error_message?: string | null
          event_id?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          email_type?: string
          error_message?: string | null
          event_id?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_log_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          autograph_guests: string | null
          city: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          date_end: string | null
          date_start: string
          id: string
          lat: number | null
          lng: number | null
          name: string
          slug: string
          social_links: Json | null
          source: string | null
          sponsors: string[] | null
          state: string
          status: string | null
          submitted_by: string | null
          updated_at: string | null
          vendor_tables: number | null
          venue_address: string | null
          venue_name: string | null
          venue_website: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          autograph_guests?: string | null
          city: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          date_end?: string | null
          date_start: string
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          slug: string
          social_links?: Json | null
          source?: string | null
          sponsors?: string[] | null
          state: string
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          vendor_tables?: number | null
          venue_address?: string | null
          venue_name?: string | null
          venue_website?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          autograph_guests?: string | null
          city?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          date_end?: string | null
          date_start?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          slug?: string
          social_links?: Json | null
          source?: string | null
          sponsors?: string[] | null
          state?: string
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          vendor_tables?: number | null
          venue_address?: string | null
          venue_name?: string | null
          venue_website?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          alert_states: string[] | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          favorite_categories: string[] | null
          grading_preference: string | null
          id: string
          role: string | null
          saved_events: string[] | null
          saved_shops: string[] | null
          state: string | null
          topic_prefs: string[] | null
          updated_at: string | null
          username: string | null
          years_collecting: number | null
        }
        Insert: {
          alert_states?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          favorite_categories?: string[] | null
          grading_preference?: string | null
          id: string
          role?: string | null
          saved_events?: string[] | null
          saved_shops?: string[] | null
          state?: string | null
          topic_prefs?: string[] | null
          updated_at?: string | null
          username?: string | null
          years_collecting?: number | null
        }
        Update: {
          alert_states?: string[] | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          favorite_categories?: string[] | null
          grading_preference?: string | null
          id?: string
          role?: string | null
          saved_events?: string[] | null
          saved_shops?: string[] | null
          state?: string | null
          topic_prefs?: string[] | null
          updated_at?: string | null
          username?: string | null
          years_collecting?: number | null
        }
        Relationships: []
      }
      shops: {
        Row: {
          address: string | null
          city: string
          created_at: string | null
          google_place_id: string | null
          hours: Json | null
          id: string
          lat: number | null
          lng: number | null
          name: string
          phone: string | null
          slug: string
          source: string | null
          specialty: string | null
          state: string
          status: string | null
          submitted_by: string | null
          updated_at: string | null
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city: string
          created_at?: string | null
          google_place_id?: string | null
          hours?: Json | null
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          phone?: string | null
          slug: string
          source?: string | null
          specialty?: string | null
          state: string
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string
          created_at?: string | null
          google_place_id?: string | null
          hours?: Json | null
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          phone?: string | null
          slug?: string
          source?: string | null
          specialty?: string | null
          state?: string
          status?: string | null
          submitted_by?: string | null
          updated_at?: string | null
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      sponsor_applications: {
        Row: {
          category: string
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          notes: string | null
          slug: string
          status: string | null
          submitted_by: string | null
          tier: string
          website: string | null
        }
        Insert: {
          category: string
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          slug: string
          status?: string | null
          submitted_by?: string | null
          tier: string
          website?: string | null
        }
        Update: {
          category?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          slug?: string
          status?: string | null
          submitted_by?: string | null
          tier?: string
          website?: string | null
        }
        Relationships: []
      }
      sponsor_images: {
        Row: {
          alt_text: string | null
          id: string
          image_url: string
          sponsor_id: string
        }
        Insert: {
          alt_text?: string | null
          id?: string
          image_url: string
          sponsor_id: string
        }
        Update: {
          alt_text?: string | null
          id?: string
          image_url?: string
          sponsor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_images_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_shows: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          sponsor_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          sponsor_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          sponsor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_shows_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sponsor_shows_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsor_socials: {
        Row: {
          id: string
          platform: string
          sponsor_id: string
          url: string
        }
        Insert: {
          id?: string
          platform: string
          sponsor_id: string
          url: string
        }
        Update: {
          id?: string
          platform?: string
          sponsor_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "sponsor_socials_sponsor_id_fkey"
            columns: ["sponsor_id"]
            isOneToOne: false
            referencedRelation: "sponsors"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsors: {
        Row: {
          banner_url: string | null
          category: string
          created_at: string | null
          description: string | null
          display_order: number | null
          featured: boolean | null
          founded_year: number | null
          headquarters: string | null
          id: string
          info_source_url: string | null
          info_verified_at: string | null
          logo_url: string | null
          name: string
          offerings: string[]
          profile_views: number | null
          product_categories: string[]
          slug: string
          status: string | null
          service_area: string | null
          tagline: string | null
          target_audience: string[]
          updated_at: string | null
          verified: boolean | null
          website: string | null
          website_clicks: number | null
        }
        Insert: {
          banner_url?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          info_source_url?: string | null
          info_verified_at?: string | null
          logo_url?: string | null
          name: string
          offerings?: string[]
          profile_views?: number | null
          product_categories?: string[]
          slug: string
          status?: string | null
          service_area?: string | null
          tagline?: string | null
          target_audience?: string[]
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
          website_clicks?: number | null
        }
        Update: {
          banner_url?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          featured?: boolean | null
          founded_year?: number | null
          headquarters?: string | null
          id?: string
          info_source_url?: string | null
          info_verified_at?: string | null
          logo_url?: string | null
          name?: string
          offerings?: string[]
          profile_views?: number | null
          product_categories?: string[]
          slug?: string
          status?: string | null
          service_area?: string | null
          tagline?: string | null
          target_audience?: string[]
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
          website_clicks?: number | null
        }
        Relationships: []
      }
      brand_engagements: {
        Row: {
          collecting_categories: string[]
          consented_at: string
          created_at: string
          event_ids: string[]
          id: string
          preferred_channels: string[]
          product_interests: string[]
          purchase_frequency: string | null
          region: string | null
          sponsor_id: string
        }
        Insert: {
          collecting_categories?: string[]
          consented_at: string
          created_at?: string
          event_ids?: string[]
          id?: string
          preferred_channels?: string[]
          product_interests?: string[]
          purchase_frequency?: string | null
          region?: string | null
          sponsor_id: string
        }
        Update: {
          collecting_categories?: string[]
          consented_at?: string
          created_at?: string
          event_ids?: string[]
          id?: string
          preferred_channels?: string[]
          product_interests?: string[]
          purchase_frequency?: string | null
          region?: string | null
          sponsor_id?: string
        }
        Relationships: []
      }
      valuation_usage: {
        Row: {
          brand: string | null
          card_name: string | null
          created_at: string
          grade: string | null
          id: string
          player: string | null
          result_grade: string | null
          result_high: number | null
          result_low: number | null
          result_mid: number | null
          result_recommendation: string | null
          sport: string | null
          user_id: string
          year: string | null
        }
        Insert: {
          brand?: string | null
          card_name?: string | null
          created_at?: string
          grade?: string | null
          id?: string
          player?: string | null
          result_grade?: string | null
          result_high?: number | null
          result_low?: number | null
          result_mid?: number | null
          result_recommendation?: string | null
          sport?: string | null
          user_id: string
          year?: string | null
        }
        Update: {
          brand?: string | null
          card_name?: string | null
          created_at?: string
          grade?: string | null
          id?: string
          player?: string | null
          result_grade?: string | null
          result_high?: number | null
          result_low?: number | null
          result_mid?: number | null
          result_recommendation?: string | null
          sport?: string | null
          user_id?: string
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
