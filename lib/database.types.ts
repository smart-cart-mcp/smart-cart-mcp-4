import { Database } from '../supabase/types/supabase';

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

// Convenience types for common tables
export type ActivityLog = Tables<'activity_logs'>;
export type Category = Tables<'categories'>;
export type Product = Tables<'products'>;
export type Review = Tables<'reviews'>;
export type CartItem = Tables<'cart_items'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;

// Insert types
export type InsertActivityLog = InsertTables<'activity_logs'>;
export type InsertCategory = InsertTables<'categories'>;
export type InsertProduct = InsertTables<'products'>;
export type InsertReview = InsertTables<'reviews'>;
export type InsertCartItem = InsertTables<'cart_items'>;
export type InsertOrder = InsertTables<'orders'>;
export type InsertOrderItem = InsertTables<'order_items'>;

// Update types
export type UpdateActivityLog = UpdateTables<'activity_logs'>;
export type UpdateCategory = UpdateTables<'categories'>;
export type UpdateProduct = UpdateTables<'products'>;
export type UpdateReview = UpdateTables<'reviews'>;
export type UpdateCartItem = UpdateTables<'cart_items'>;
export type UpdateOrder = UpdateTables<'orders'>;
export type UpdateOrderItem = UpdateTables<'order_items'>; 