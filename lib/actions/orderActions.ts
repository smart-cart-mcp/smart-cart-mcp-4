"use server";

import Stripe from 'stripe';
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ShippingAddress, CartItemWithProduct } from "@/lib/types/checkout";
import { CartItemDetail } from "./cartActions";

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15' as any, // Using any to bypass TypeScript version issues
});

// Create a payment intent
export async function createPaymentIntent(
  amountInCents: number,
  currency: string = 'usd',
  metadata: { userId: string; [key: string]: string }
): Promise<{ clientSecret: string | null; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== metadata.userId) {
      return { clientSecret: null, error: 'User authentication mismatch.' };
    }

    // Stripe requires at least $0.50 for a charge
    if (amountInCents < 50) {
      return { clientSecret: null, error: 'Amount is too low for payment processing.' };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        ...metadata,
        userId: user.id
      },
    });

    return { clientSecret: paymentIntent.client_secret };
  } catch (error: any) {
    console.error('Stripe PaymentIntent Creation Error:', error.message);
    return { 
      clientSecret: null, 
      error: 'Failed to initialize payment. Please try again.' 
    };
  }
}

// Convert cart items to order items format
export function mapCartItemsToOrderItems(cartItems: CartItemWithProduct[], orderId: number) {
  return cartItems.map(item => ({
    order_id: orderId,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.product.price,
  }));
}

// Finalize order and clear cart after successful payment
export async function finalizeOrderAndClearCart(
  paymentIntentId: string,
  shippingAddress: ShippingAddress,
  cartItems: CartItemWithProduct[],
  userId: string,
  subtotal: number,
  shippingHandlingFee: number,
  totalAmount: number
): Promise<{ orderId: number | null; error?: string }> {
  const supabase = createClient();

  // Check if an order with this payment intent already exists (idempotency)
  const { data: existingOrder, error: existingOrderError } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single();

  if (existingOrderError && existingOrderError.code !== 'PGRST116') { // Not found is okay
    console.error('Error checking for existing order:', existingOrderError);
    return { 
      orderId: null, 
      error: 'Error processing order. Please contact support (Ref: ECE).' 
    };
  }

  if (existingOrder) {
    console.log(`Order for PaymentIntent ${paymentIntentId} already exists: ${existingOrder.id}.`);
    return { orderId: existingOrder.id }; // Already processed
  }

  // Verify PaymentIntent status with Stripe
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      console.warn(`PaymentIntent ${paymentIntentId} status is not 'succeeded': ${paymentIntent.status}`);
      return { 
        orderId: null, 
        error: `Payment not fully confirmed by Stripe (Status: ${paymentIntent.status}). Please contact support.` 
      };
    }

    // Verify amount matches
    if (paymentIntent.amount !== Math.round(totalAmount * 100)) {
      console.error(`CRITICAL: Stripe PI amount ${paymentIntent.amount} does not match order total ${Math.round(totalAmount * 100)} for PI ${paymentIntentId}`);
      return { 
        orderId: null, 
        error: 'Payment amount mismatch. Please contact support immediately (Ref: PAM).' 
      };
    }
  } catch (stripeError: any) {
    console.error(`Error verifying Stripe PaymentIntent ${paymentIntentId}:`, stripeError);
    return { 
      orderId: null, 
      error: 'Failed to verify payment with Stripe. Please contact support (Ref: ESPV).' 
    };
  }

  // Create order in database
  let orderId: number | null = null;
  try {
    // Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: 'Order Received',
        total_amount: totalAmount,
        subtotal: subtotal,
        shipping_handling_fee: shippingHandlingFee,
        shipping_address: JSON.stringify(shippingAddress),
        payment_method: 'stripe',
        payment_status: 'succeeded',
        stripe_payment_intent_id: paymentIntentId,
      })
      .select('id')
      .single();

    if (orderError || !orderData) {
      console.error('Error creating order:', orderError);
      return { 
        orderId: null, 
        error: `Database error creating order (Ref: ${orderError?.code || 'DBO'}). Please contact support.` 
      };
    }

    orderId = orderData.id;

    // Insert order items
    const orderItems = mapCartItemsToOrderItems(cartItems, orderId);
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError);
      // Order created but items failed - mark for review
      await supabase
        .from('orders')
        .update({ status: 'Error - Items Missing' })
        .eq('id', orderId);
      
      return { 
        orderId: orderId, 
        error: `Order placed, but item details incomplete (Ref: ${orderItemsError.code || 'DBI'}). We will review.` 
      };
    }

    // Clear user's cart
    const { error: clearCartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (clearCartError) {
      console.warn('Order placed, but failed to clear cart for user:', userId, clearCartError);
    }

    // Log activity
    await supabase
      .from('activity_logs')
      .insert({ 
        user_id: userId, 
        action: `Order ${orderId} placed.` 
      });

    return { orderId };
  } catch (error: any) {
    console.error('Unexpected error during order creation:', error);
    
    if (orderId) {
      // If order was created but processing failed, mark for review
      await supabase
        .from('orders')
        .update({ status: 'Error - Processing Failed' })
        .eq('id', orderId);
    }
    
    return { 
      orderId: null, 
      error: 'An unexpected server error occurred (Ref: UEFO). Please contact support.' 
    };
  }
}

// Get order details with items for order confirmation
export async function getOrderWithItems(orderId: number, userId: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        *,
        products:product_id (
          id, name, price, image_url
        )
      )
    `)
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    console.error(`Error fetching order ${orderId}:`, error);
    return { data: null, error };
  }

  // Parse shipping address from JSON
  try {
    if (typeof data.shipping_address === 'string') {
      data.shipping_address = JSON.parse(data.shipping_address);
    }
  } catch (e) {
    console.error('Failed to parse shipping address for order', orderId, e);
  }

  return { data, error: null };
} 