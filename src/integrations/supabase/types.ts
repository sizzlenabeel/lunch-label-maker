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
      allocations: {
        Row: {
          created_at: string
          delivery_date: string
          id: string
          location_id: string
          product_id: string
          quantity_allocated: number
          quantity_returned: number
          returned_at: string | null
          week_number: number | null
          year: number | null
        }
        Insert: {
          created_at?: string
          delivery_date: string
          id?: string
          location_id: string
          product_id: string
          quantity_allocated?: number
          quantity_returned?: number
          returned_at?: string | null
          week_number?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string
          delivery_date?: string
          id?: string
          location_id?: string
          product_id?: string
          quantity_allocated?: number
          quantity_returned?: number
          returned_at?: string | null
          week_number?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "allocations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "allocations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_product_deals"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "allocations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      banner_messages: {
        Row: {
          created_at: string
          deal_id: string | null
          ends_at: string | null
          id: string
          link_label: string | null
          link_url: string | null
          location_ids: string[]
          message: string
          starts_at: string
        }
        Insert: {
          created_at?: string
          deal_id?: string | null
          ends_at?: string | null
          id?: string
          link_label?: string | null
          link_url?: string | null
          location_ids?: string[]
          message: string
          starts_at?: string
        }
        Update: {
          created_at?: string
          deal_id?: string | null
          ends_at?: string | null
          id?: string
          link_label?: string | null
          link_url?: string | null
          location_ids?: string[]
          message?: string
          starts_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "banner_messages_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "active_product_deals"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "banner_messages_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          categories: string[]
          created_at: string
          discount_type: string
          discount_value: number
          display_label: string | null
          due_date_rule: string | null
          ends_at: string | null
          id: string
          location_ids: string[]
          name: string
          priority: number
          starts_at: string
          target_product_id: string | null
        }
        Insert: {
          categories?: string[]
          created_at?: string
          discount_type: string
          discount_value: number
          display_label?: string | null
          due_date_rule?: string | null
          ends_at?: string | null
          id?: string
          location_ids?: string[]
          name: string
          priority?: number
          starts_at?: string
          target_product_id?: string | null
        }
        Update: {
          categories?: string[]
          created_at?: string
          discount_type?: string
          discount_value?: number
          display_label?: string | null
          due_date_rule?: string | null
          ends_at?: string | null
          id?: string
          location_ids?: string[]
          name?: string
          priority?: number
          starts_at?: string
          target_product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deals_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "active_product_deals"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "deals_target_product_id_fkey"
            columns: ["target_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string
          created_at: string
          email: string
          id: string
          message: string | null
          office_size: string | null
        }
        Insert: {
          company: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          office_size?: string | null
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          office_size?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string
          created_at: string
          delivery_days: string[]
          dynamo_id: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          vegan_target: number
        }
        Insert: {
          address: string
          created_at?: string
          delivery_days?: string[]
          dynamo_id?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          vegan_target?: number
        }
        Update: {
          address?: string
          created_at?: string
          delivery_days?: string[]
          dynamo_id?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          vegan_target?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_id: string | null
          quantity: number
          raw_product_numeric_id: number
          unit_amount: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_id?: string | null
          quantity?: number
          raw_product_numeric_id: number
          unit_amount?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_id?: string | null
          quantity?: number
          raw_product_numeric_id?: number
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_product_deals"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          external_reference: string | null
          id: string
          import_key: string
          imported_at: string
          location_id: string | null
          mapping_status: string
          message: string
          ordered_at: string
          payment_method: string
          source_order_id: string | null
          source_status: string | null
          transaction_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          external_reference?: string | null
          id?: string
          import_key: string
          imported_at?: string
          location_id?: string | null
          mapping_status?: string
          message: string
          ordered_at: string
          payment_method: string
          source_order_id?: string | null
          source_status?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          external_reference?: string | null
          id?: string
          import_key?: string
          imported_at?: string
          location_id?: string | null
          mapping_status?: string
          message?: string
          ordered_at?: string
          payment_method?: string
          source_order_id?: string | null
          source_status?: string | null
          transaction_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      production: {
        Row: {
          created_at: string
          id: string
          product_id: string
          production_date: string
          quantity_produced: number
          week_number: number | null
          year: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          production_date: string
          quantity_produced?: number
          week_number?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          production_date?: string
          quantity_produced?: number
          week_number?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "production_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_product_deals"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "production_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          allergens: string | null
          consumption_guidelines: string | null
          created_at: string | null
          delivery_day: string | null
          description: string | null
          due_date: string | null
          font_size: string | null
          id: string
          image_url: string | null
          ingredients: string | null
          is_for_storytel: boolean | null
          is_only_for_storytel: boolean | null
          is_snack: boolean | null
          is_vegan: boolean | null
          is_vegetarian: boolean
          name: string | null
          numeric_id: number
          price: number | null
          show_duedate: boolean | null
          sizzle_deliveryday: string | null
          stocked_by_sizzle: boolean | null
          storytel_delivery_days: string[]
          translated_allergens: string | null
          translated_consumption_guidelines: string | null
          translated_description: string | null
          translated_ingredients: Json | null
          translated_name: string | null
          types: Database["public"]["Enums"]["product_type"][] | null
          user_id: string | null
          week_number: number | null
        }
        Insert: {
          allergens?: string | null
          consumption_guidelines?: string | null
          created_at?: string | null
          delivery_day?: string | null
          description?: string | null
          due_date?: string | null
          font_size?: string | null
          id: string
          image_url?: string | null
          ingredients?: string | null
          is_for_storytel?: boolean | null
          is_only_for_storytel?: boolean | null
          is_snack?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean
          name?: string | null
          numeric_id?: number
          price?: number | null
          show_duedate?: boolean | null
          sizzle_deliveryday?: string | null
          stocked_by_sizzle?: boolean | null
          storytel_delivery_days?: string[]
          translated_allergens?: string | null
          translated_consumption_guidelines?: string | null
          translated_description?: string | null
          translated_ingredients?: Json | null
          translated_name?: string | null
          types?: Database["public"]["Enums"]["product_type"][] | null
          user_id?: string | null
          week_number?: number | null
        }
        Update: {
          allergens?: string | null
          consumption_guidelines?: string | null
          created_at?: string | null
          delivery_day?: string | null
          description?: string | null
          due_date?: string | null
          font_size?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string | null
          is_for_storytel?: boolean | null
          is_only_for_storytel?: boolean | null
          is_snack?: boolean | null
          is_vegan?: boolean | null
          is_vegetarian?: boolean
          name?: string | null
          numeric_id?: number
          price?: number | null
          show_duedate?: boolean | null
          sizzle_deliveryday?: string | null
          stocked_by_sizzle?: boolean | null
          storytel_delivery_days?: string[]
          translated_allergens?: string | null
          translated_consumption_guidelines?: string | null
          translated_description?: string | null
          translated_ingredients?: Json | null
          translated_name?: string | null
          types?: Database["public"]["Enums"]["product_type"][] | null
          user_id?: string | null
          week_number?: number | null
        }
        Relationships: []
      }
      requirements: {
        Row: {
          created_at: string
          delivery_date: string
          id: string
          is_snack: boolean | null
          location_id: string
          total_required: number
          week_number: number | null
          year: number | null
        }
        Insert: {
          created_at?: string
          delivery_date: string
          id?: string
          is_snack?: boolean | null
          location_id: string
          total_required?: number
          week_number?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string
          delivery_date?: string
          id?: string
          is_snack?: boolean | null
          location_id?: string
          total_required?: number
          week_number?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "requirements_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      snack_adjustments: {
        Row: {
          batch_id: string | null
          created_at: string
          id: string
          location_id: string
          note: string | null
          occurred_on: string
          product_id: string
          quantity_delta: number
          reason: string
        }
        Insert: {
          batch_id?: string | null
          created_at?: string
          id?: string
          location_id: string
          note?: string | null
          occurred_on?: string
          product_id: string
          quantity_delta: number
          reason?: string
        }
        Update: {
          batch_id?: string | null
          created_at?: string
          id?: string
          location_id?: string
          note?: string | null
          occurred_on?: string
          product_id?: string
          quantity_delta?: number
          reason?: string
        }
        Relationships: [
          {
            foreignKeyName: "snack_adjustments_batch_id_fkey"
            columns: ["batch_id"]
            isOneToOne: false
            referencedRelation: "snack_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snack_adjustments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snack_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_product_deals"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "snack_adjustments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      snack_batches: {
        Row: {
          best_before: string | null
          close_reason: string | null
          closed_on: string | null
          closed_quantity: number | null
          created_at: string
          delivered_on: string
          id: string
          location_id: string
          note: string | null
          product_id: string
          quantity: number
          unit_cost: number | null
        }
        Insert: {
          best_before?: string | null
          close_reason?: string | null
          closed_on?: string | null
          closed_quantity?: number | null
          created_at?: string
          delivered_on?: string
          id?: string
          location_id: string
          note?: string | null
          product_id: string
          quantity: number
          unit_cost?: number | null
        }
        Update: {
          best_before?: string | null
          close_reason?: string | null
          closed_on?: string | null
          closed_quantity?: number | null
          created_at?: string
          delivered_on?: string
          id?: string
          location_id?: string
          note?: string | null
          product_id?: string
          quantity?: number
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "snack_batches_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "snack_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_product_deals"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "snack_batches_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      active_banner_messages: {
        Row: {
          created_at: string | null
          deal_id: string | null
          ends_at: string | null
          id: string | null
          link_label: string | null
          link_url: string | null
          location_ids: string[] | null
          message: string | null
          product_id: string | null
          starts_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "banner_messages_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "active_product_deals"
            referencedColumns: ["deal_id"]
          },
          {
            foreignKeyName: "banner_messages_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_target_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "active_product_deals"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "deals_target_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      active_product_deals: {
        Row: {
          deal_id: string | null
          deal_label: string | null
          deal_name: string | null
          discount_type: string | null
          discount_value: number | null
          final_price: number | null
          original_price: number | null
          product_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      active_product_deals_for_location: {
        Args: { p_location_id: string }
        Returns: {
          deal_id: string
          deal_label: string
          deal_name: string
          discount_type: string
          discount_value: number
          final_price: number
          original_price: number
          product_id: string
        }[]
      }
      upsert_orders: { Args: { p_orders: Json }; Returns: Json }
    }
    Enums: {
      product_type: "FOOD" | "DRINK" | "BREAKFAST" | "SNACK"
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
      product_type: ["FOOD", "DRINK", "BREAKFAST", "SNACK"],
    },
  },
} as const
