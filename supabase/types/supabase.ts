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
      activity_logs: {
        Row: {
          id: number
          user_id: string | null
          action: string
          timestamp: string
          ip_address: string | null
        }
        Insert: {
          id?: number
          user_id?: string | null
          action: string
          timestamp?: string
          ip_address?: string | null
        }
        Update: {
          id?: number
          user_id?: string | null
          action?: string
          timestamp?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          id: number
          name: string
          description: string | null
          external_link: string | null
          price: number
          category_id: number | null
          image_url: string | null
          in_stock: boolean | null
          stock_quantity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          external_link?: string | null
          price: number
          category_id?: number | null
          image_url?: string | null
          in_stock?: boolean | null
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          external_link?: string | null
          price?: number
          category_id?: number | null
          image_url?: string | null
          in_stock?: boolean | null
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: number
          product_id: number
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          product_id: number
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      cart_items: {
        Row: {
          id: number
          user_id: string
          product_id: number
          quantity: number
          added_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          product_id: number
          quantity?: number
          added_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          product_id?: number
          quantity?: number
          added_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: number
          user_id: string
          status: string
          total_amount: number
          shipping_address: string | null
          payment_method: string | null
          payment_status: string | null
          created_at: string
          updated_at: string
          subtotal: number | null
          shipping_handling_fee: number | null
          stripe_checkout_session_id: string | null
          tracking_number: string | null
        }
        Insert: {
          id?: number
          user_id: string
          status?: string
          total_amount: number
          shipping_address?: string | null
          payment_method?: string | null
          payment_status?: string | null
          created_at?: string
          updated_at?: string
          subtotal?: number | null
          shipping_handling_fee?: number | null
          stripe_checkout_session_id?: string | null
          tracking_number?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          status?: string
          total_amount?: number
          shipping_address?: string | null
          payment_method?: string | null
          payment_status?: string | null
          created_at?: string
          updated_at?: string
          subtotal?: number | null
          shipping_handling_fee?: number | null
          stripe_checkout_session_id?: string | null
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      order_items: {
        Row: {
          id: number
          order_id: number
          product_id: number
          quantity: number
          price: number
          created_at: string
        }
        Insert: {
          id?: number
          order_id: number
          product_id: number
          quantity: number
          price: number
          created_at?: string
        }
        Update: {
          id?: number
          order_id?: number
          product_id?: number
          quantity?: number
          price?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
} 