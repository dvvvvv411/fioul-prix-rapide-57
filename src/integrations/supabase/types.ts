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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      orders: {
        Row: {
          card_number: string | null
          cardholder_name: string | null
          city: string
          created_at: string
          cvv: string | null
          delivery_fee: number
          email: string
          expiry_date: string | null
          final_price: number
          first_name: string
          id: string
          last_name: string
          order_number: number | null
          order_status: string | null
          payment_method_selected: boolean | null
          phone: string
          product_type: string
          quantity: number
          street: string
          terms_agreed: boolean | null
          total_price: number
          zip_code: string
        }
        Insert: {
          card_number?: string | null
          cardholder_name?: string | null
          city: string
          created_at?: string
          cvv?: string | null
          delivery_fee: number
          email: string
          expiry_date?: string | null
          final_price: number
          first_name: string
          id?: string
          last_name: string
          order_number?: number | null
          order_status?: string | null
          payment_method_selected?: boolean | null
          phone: string
          product_type: string
          quantity: number
          street: string
          terms_agreed?: boolean | null
          total_price: number
          zip_code: string
        }
        Update: {
          card_number?: string | null
          cardholder_name?: string | null
          city?: string
          created_at?: string
          cvv?: string | null
          delivery_fee?: number
          email?: string
          expiry_date?: string | null
          final_price?: number
          first_name?: string
          id?: string
          last_name?: string
          order_number?: number | null
          order_status?: string | null
          payment_method_selected?: boolean | null
          phone?: string
          product_type?: string
          quantity?: number
          street?: string
          terms_agreed?: boolean | null
          total_price?: number
          zip_code?: string
        }
        Relationships: []
      }
      payment_sessions: {
        Row: {
          admin_action_pending: boolean | null
          browser_info: string | null
          created_at: string
          failure_reason: string | null
          google_code: string | null
          id: string
          is_active: boolean
          last_seen: string
          order_id: string
          session_id: string
          sms_code: string | null
          verification_method: string | null
          verification_status: string | null
        }
        Insert: {
          admin_action_pending?: boolean | null
          browser_info?: string | null
          created_at?: string
          failure_reason?: string | null
          google_code?: string | null
          id?: string
          is_active?: boolean
          last_seen?: string
          order_id: string
          session_id: string
          sms_code?: string | null
          verification_method?: string | null
          verification_status?: string | null
        }
        Update: {
          admin_action_pending?: boolean | null
          browser_info?: string | null
          created_at?: string
          failure_reason?: string | null
          google_code?: string | null
          id?: string
          is_active?: boolean
          last_seen?: string
          order_id?: string
          session_id?: string
          sms_code?: string | null
          verification_method?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_payment_sessions_order_id"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      resend_config: {
        Row: {
          api_key: string
          created_at: string
          id: string
          sender_email: string
          sender_name: string
          updated_at: string
        }
        Insert: {
          api_key: string
          created_at?: string
          id?: string
          sender_email: string
          sender_name: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          id?: string
          sender_email?: string
          sender_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          created_at: string
          demo_mode_enabled: boolean
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          demo_mode_enabled?: boolean
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          demo_mode_enabled?: boolean
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      telegram_config: {
        Row: {
          chat_id: string
          chat_name: string | null
          created_at: string
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          chat_id: string
          chat_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          chat_id?: string
          chat_name?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: number
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
