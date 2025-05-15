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
      customers: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          email: string | null
          birthdate: string | null
          points: number
          visits: number
          last_visit: string | null
          registered_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          email?: string | null
          birthdate?: string | null
          points?: number
          visits?: number
          last_visit?: string | null
          registered_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          email?: string | null
          birthdate?: string | null
          points?: number
          visits?: number
          last_visit?: string | null
          registered_at?: string
          created_at?: string
          updated_at?: string
        }
      }
      rewards: {
        Row: {
          id: string
          name: string
          description: string
          points_required: number
          category: 'food' | 'drink' | 'dessert' | 'other'
          image_url: string | null
          is_active: boolean
          is_birthday_reward: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          points_required: number
          category: 'food' | 'drink' | 'dessert' | 'other'
          image_url?: string | null
          is_active?: boolean
          is_birthday_reward?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          points_required?: number
          category?: 'food' | 'drink' | 'dessert' | 'other'
          image_url?: string | null
          is_active?: boolean
          is_birthday_reward?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          customer_id: string
          receipt_number: string
          amount: number
          points: number
          type: 'earn' | 'redeem' | 'birthday'
          reward_id: string | null
          reward_name: string | null
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          receipt_number: string
          amount: number
          points: number
          type: 'earn' | 'redeem' | 'birthday'
          reward_id?: string | null
          reward_name?: string | null
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          receipt_number?: string
          amount?: number
          points?: number
          type?: 'earn' | 'redeem' | 'birthday'
          reward_id?: string | null
          reward_name?: string | null
          date?: string
          created_at?: string
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
      transaction_type: 'earn' | 'redeem' | 'birthday'
      reward_category: 'food' | 'drink' | 'dessert' | 'other'
    }
  }
}