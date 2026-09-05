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
      audit_logs: {
        Row: {
          action: string
          details: Json
          entity_id: string | null
          entity_type: string
          id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action: string
          details?: Json
          entity_id?: string | null
          entity_type: string
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: Json
          entity_id?: string | null
          entity_type?: string
          id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      case_bank: {
        Row: {
          created_at: string
          id: string
          interventions: string | null
          outcomes: string | null
          primary_category: string
          recommendations: string | null
          report_id: string | null
          similar_case_count: number
          subcategories: string[]
          symptoms: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          interventions?: string | null
          outcomes?: string | null
          primary_category: string
          recommendations?: string | null
          report_id?: string | null
          similar_case_count?: number
          subcategories?: string[]
          symptoms?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          interventions?: string | null
          outcomes?: string | null
          primary_category?: string
          recommendations?: string | null
          report_id?: string | null
          similar_case_count?: number
          subcategories?: string[]
          symptoms?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_bank_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "reports"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          coordinates: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          address?: string | null
          coordinates?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          address?: string | null
          coordinates?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string
          id: string
          unit_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          unit_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      qr_codes: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          location_id: string | null
          token: string
          unit_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          location_id?: string | null
          token: string
          unit_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          location_id?: string | null
          token?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qr_codes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qr_codes_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          attachments: Json
          created_at: string
          draft_content: string | null
          final_content: string | null
          goal: string | null
          id: string
          psychologist_id: string | null
          recommendations: string | null
          request_id: string | null
          results: string | null
          status: Database["public"]["Enums"]["report_status"]
          tags: string[]
          work_description: string | null
        }
        Insert: {
          attachments?: Json
          created_at?: string
          draft_content?: string | null
          final_content?: string | null
          goal?: string | null
          id?: string
          psychologist_id?: string | null
          recommendations?: string | null
          request_id?: string | null
          results?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          tags?: string[]
          work_description?: string | null
        }
        Update: {
          attachments?: Json
          created_at?: string
          draft_content?: string | null
          final_content?: string | null
          goal?: string | null
          id?: string
          psychologist_id?: string | null
          recommendations?: string | null
          request_id?: string | null
          results?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          tags?: string[]
          work_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          applicant_id: string | null
          category: string | null
          created_at: string
          id: string
          location_id: string | null
          raw_text: string
          request_type: string
          status: Database["public"]["Enums"]["request_status"]
          structured_text: string | null
          unit_id: string | null
          urgency: Database["public"]["Enums"]["urgency_level"]
        }
        Insert: {
          applicant_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          raw_text?: string
          request_type?: string
          status?: Database["public"]["Enums"]["request_status"]
          structured_text?: string | null
          unit_id?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Update: {
          applicant_id?: string | null
          category?: string | null
          created_at?: string
          id?: string
          location_id?: string | null
          raw_text?: string
          request_type?: string
          status?: Database["public"]["Enums"]["request_status"]
          structured_text?: string | null
          unit_id?: string | null
          urgency?: Database["public"]["Enums"]["urgency_level"]
        }
        Relationships: [
          {
            foreignKeyName: "requests_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "requests_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          created_at: string
          end_time: string
          event_title: string
          event_type: Database["public"]["Enums"]["event_type"]
          id: string
          location_id: string | null
          psychologist_id: string | null
          route_details: string | null
          start_time: string
          travel_time_hours: number
        }
        Insert: {
          created_at?: string
          end_time: string
          event_title: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          location_id?: string | null
          psychologist_id?: string | null
          route_details?: string | null
          start_time: string
          travel_time_hours?: number
        }
        Update: {
          created_at?: string
          end_time?: string
          event_title?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: string
          location_id?: string | null
          psychologist_id?: string | null
          route_details?: string | null
          start_time?: string
          travel_time_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "schedules_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          code: string
          created_at: string
          id: string
          location_id: string | null
          name: string
          parent_id: string | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          location_id?: string | null
          name: string
          parent_id?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          location_id?: string | null
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "units_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "SuperAdmin" | "ServiceChief" | "Psychologist" | "Applicant"
      event_type:
        | "consultation"
        | "group_work"
        | "travel"
        | "documentation"
        | "other"
      report_status: "draft" | "submitted" | "approved" | "rejected"
      request_status:
        | "new"
        | "in_processing"
        | "scheduled"
        | "completed"
        | "cancelled"
      urgency_level: "low" | "medium" | "high" | "critical"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["SuperAdmin", "ServiceChief", "Psychologist", "Applicant"],
      event_type: [
        "consultation",
        "group_work",
        "travel",
        "documentation",
        "other",
      ],
      report_status: ["draft", "submitted", "approved", "rejected"],
      request_status: [
        "new",
        "in_processing",
        "scheduled",
        "completed",
        "cancelled",
      ],
      urgency_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
