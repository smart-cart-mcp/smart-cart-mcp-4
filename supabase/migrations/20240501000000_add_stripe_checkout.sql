-- Add Stripe checkout session ID to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_checkout_session_id TEXT UNIQUE;

-- Add subtotal and shipping_handling_fee columns
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_handling_fee DECIMAL(10, 2);

-- Create index for Stripe checkout session ID
CREATE INDEX IF NOT EXISTS idx_orders_stripe_checkout_session_id ON public.orders(stripe_checkout_session_id); 