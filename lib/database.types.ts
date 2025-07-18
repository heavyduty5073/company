export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      customer_inquiries: {
        Row: {
          contact: string
          created_at: string
          customer_name: string
          equipment: string | null
          id: number
          inquiry_type: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          contact: string
          created_at?: string
          customer_name: string
          equipment?: string | null
          id?: number
          inquiry_type: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          contact?: string
          created_at?: string
          customer_name?: string
          equipment?: string | null
          id?: number
          inquiry_type?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      inquiry: {
        Row: {
          admin_id: string | null
          answer: string | null
          created_at: string
          id: string
          question: string | null
          title: string
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          answer?: string | null
          created_at?: string
          id?: string
          question?: string | null
          title: string
          user_id?: string
        }
        Update: {
          admin_id?: string | null
          answer?: string | null
          created_at?: string
          id?: string
          question?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      naver_ads_stats: {
        Row: {
          clicks: number
          cost: number
          created_at: string | null
          date: string
          id: string
          impressions: number
          updated_at: string | null
        }
        Insert: {
          clicks?: number
          cost?: number
          created_at?: string | null
          date: string
          id?: string
          impressions?: number
          updated_at?: string | null
        }
        Update: {
          clicks?: number
          cost?: number
          created_at?: string | null
          date?: string
          id?: string
          impressions?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      parts: {
        Row: {
          boforePrice: number | null
          brand: string
          comazCode: string
          connectCode: string | null
          created_at: string | null
          dsCode: string
          hdCode: string
          id: number
          isReturn: boolean | null
          model: string | null
          name: string
          tearDevide: string | null
          updated_at: string | null
        }
        Insert: {
          boforePrice?: number | null
          brand: string
          comazCode: string
          connectCode?: string | null
          created_at?: string | null
          dsCode: string
          hdCode: string
          id?: number
          isReturn?: boolean | null
          model?: string | null
          name: string
          tearDevide?: string | null
          updated_at?: string | null
        }
        Update: {
          boforePrice?: number | null
          brand?: string
          comazCode?: string
          connectCode?: string | null
          created_at?: string | null
          dsCode?: string
          hdCode?: string
          id?: number
          isReturn?: boolean | null
          model?: string | null
          name?: string
          tearDevide?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parts_?명솚?덈쾲_fkey"
            columns: ["connectCode"]
            isOneToOne: false
            referencedRelation: "parts"
            referencedColumns: ["dsCode"]
          },
        ]
      }
      posts: {
        Row: {
          attachments: Json | null
          category: string
          company: string | null
          contents: string | null
          created_at: string
          id: string
          tag: string
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: Json | null
          category: string
          company?: string | null
          contents?: string | null
          created_at?: string
          id?: string
          tag: string
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: Json | null
          category?: string
          company?: string | null
          contents?: string | null
          created_at?: string
          id?: string
          tag?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          created_at: string | null
          driver_name: string
          id: string
          is_open: boolean
          notes: string | null
          region: string
          schedule_date: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_name: string
          id?: string
          is_open?: boolean
          notes?: string | null
          region: string
          schedule_date: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_name?: string
          id?: string
          is_open?: boolean
          notes?: string | null
          region?: string
          schedule_date?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_admin_inquiries: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          user_id: string
          created_at: string
          question: string
          answer: string
          admin_id: string
          title: string
          user_email: string
          user_created_at: string
        }[]
      }
      search_admin_inquiries: {
        Args: { search_term: string }
        Returns: {
          id: string
          user_id: string
          created_at: string
          question: string
          answer: string
          admin_id: string
          title: string
          user_email: string
          user_created_at: string
        }[]
      }
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
