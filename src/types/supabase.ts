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
      product_translations: {
        Row: {
          id: string
          product_id: string
          name: string
          ingredients: string
          allergens: string
          consumption_guidelines: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          name: string
          ingredients: string
          allergens: string
          consumption_guidelines: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          name?: string
          ingredients?: string
          allergens?: string
          consumption_guidelines?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          due_date: string
          ingredients: string
          allergens: string
          consumption_guidelines: string
          description: string
          font_size: 'normal' | 'small' | 'smaller'
          week_number: number
          is_vegan: boolean
          translated_name: string | null
          translated_ingredients: string | null
          translated_allergens: string | null
          translated_consumption_guidelines: string | null
          translated_description: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          due_date: string
          ingredients: string
          allergens: string
          consumption_guidelines: string
          description: string
          font_size?: 'normal' | 'small' | 'smaller'
          week_number: number
          is_vegan?: boolean
          translated_name?: string | null
          translated_ingredients?: string | null
          translated_allergens?: string | null
          translated_consumption_guidelines?: string | null
          translated_description?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          due_date?: string
          ingredients?: string
          allergens?: string
          consumption_guidelines?: string
          description?: string
          font_size?: 'normal' | 'small' | 'smaller'
          week_number?: number
          is_vegan?: boolean
          translated_name?: string | null
          translated_ingredients?: string | null
          translated_allergens?: string | null
          translated_consumption_guidelines?: string | null
          translated_description?: string | null
          created_at?: string
          user_id?: string
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