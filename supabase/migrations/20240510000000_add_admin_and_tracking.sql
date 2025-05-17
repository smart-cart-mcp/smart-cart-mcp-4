-- Add tracking_number column to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- Create admin access with RLS policies 
-- Create policy to allow users with admin role to read all orders
CREATE POLICY admin_read_all_orders ON public.orders
  FOR SELECT USING ((auth.jwt() ->> 'role')::text = 'admin');

-- Create policy to allow users with admin role to update all orders
CREATE POLICY admin_update_all_orders ON public.orders
  FOR UPDATE USING ((auth.jwt() ->> 'role')::text = 'admin');

-- Create policy to allow users with admin role to read all order items
CREATE POLICY admin_read_all_order_items ON public.order_items
  FOR SELECT USING ((auth.jwt() ->> 'role')::text = 'admin');

-- Create policy to allow users with admin role to read user data (for order management)
CREATE POLICY admin_read_all_users ON auth.users
  FOR SELECT USING ((auth.jwt() ->> 'role')::text = 'admin'); 