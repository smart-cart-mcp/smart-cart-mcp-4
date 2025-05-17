-- Add Stripe-related fields to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT UNIQUE;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2);
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_handling_fee DECIMAL(10, 2);

-- Create indices if they don't exist
CREATE INDEX IF NOT EXISTS idx_orders_stripe_payment_intent_id ON public.orders(stripe_payment_intent_id); 