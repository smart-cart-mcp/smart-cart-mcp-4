"use server";

import Stripe from 'stripe';
import { createClient } from '@/utils/supabase/server';
import { CartItemWithProduct } from './cartActions';
import { revalidatePath } from 'next/cache';

// Define shipping address type
export type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
};

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15', // Use an apiVersion that's compatible with the installed Stripe package
  typescript: true,
});

const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Create a Stripe checkout session
export async function createStripeCheckoutSession(
  cartItems: CartItemWithProduct[],
  shippingHandlingFee: number,
  userId: string,
  customerEmail: string,
  shippingAddress: ShippingAddress
): Promise<{ sessionId?: string; sessionUrl?: string; error?: string }> {
  if (!cartItems || cartItems.length === 0) {
    return { error: 'Cart is empty.' };
  }

  try {
    // Create line items for Stripe checkout
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = cartItems.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.products.name || 'Unnamed Product',
          images: item.products.image_url ? [item.products.image_url] : [],
          metadata: { smartCartProductId: item.products.id.toString() }
        },
        unit_amount: Math.round((item.products.price || 0) * 100), // Price in cents
      },
      quantity: item.quantity,
    }));

    // Add shipping & handling fee as a separate line item
    if (shippingHandlingFee > 0) {
      line_items.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping & Handling Fee',
          },
          unit_amount: Math.round(shippingHandlingFee * 100), // Fee in cents
        },
        quantity: 1,
      });
    }

    // Format shipping address for Stripe
    const stripeShippingAddress: Stripe.AddressParam = {
      line1: shippingAddress.addressLine1,
      line2: shippingAddress.addressLine2 || undefined,
      city: shippingAddress.city,
      state: shippingAddress.stateOrProvince,
      postal_code: shippingAddress.postalCode,
      country: shippingAddress.country, // Must be a 2-letter ISO country code
    };

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${NEXT_PUBLIC_BASE_URL}/checkout/cancel?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: customerEmail,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'], // Specify countries you ship to
      },
      shipping_details: {
        name: shippingAddress.fullName,
        address: stripeShippingAddress
      },
      metadata: {
        userId: userId,
        app_shipping_address_line1: shippingAddress.addressLine1,
        app_shipping_city: shippingAddress.city,
        app_shipping_state: shippingAddress.stateOrProvince,
        app_shipping_postal_code: shippingAddress.postalCode,
        app_shipping_country: shippingAddress.country,
      },
    });

    return { sessionId: session.id, sessionUrl: session.url, error: undefined };
  } catch (e: any) {
    console.error('Error creating Stripe Checkout Session:', e.message);
    return { error: `Stripe session creation failed: ${e.message}` };
  }
}

// Handle a successful checkout session
export async function handleSuccessfulCheckoutSession(
  stripeSessionId: string,
  userId: string
): Promise<{ orderId?: number; error?: string; internalError?: string }> {
  const supabase = createClient();

  // Check if an order with this Stripe Session ID already exists
  const { data: existingOrder, error: checkError } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_checkout_session_id', stripeSessionId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116: row not found (good)
    console.error('DB error checking existing order for session:', stripeSessionId, checkError);
    return { error: 'A database error occurred while processing your order. Please contact support.', internalError: checkError.message };
  }
  
  if (existingOrder) {
    console.log(`Order for Stripe session ${stripeSessionId} already processed: Order ID ${existingOrder.id}.`);
    return { orderId: existingOrder.id }; // Successfully processed previously
  }

  // Retrieve the session from Stripe
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(stripeSessionId, {
      expand: ['line_items.data.price.product', 'customer'], // Expand to get details
    });
  } catch (e: any) {
    console.error(`Error retrieving Stripe session ${stripeSessionId}:`, e.message);
    return { error: 'Could not verify your payment session with Stripe. Please contact support.', internalError: e.message };
  }

  // Check payment status
  if (session.payment_status !== 'paid') {
    console.warn(`Stripe session ${stripeSessionId} payment_status is not 'paid': ${session.payment_status}`);
    return { error: `Payment was not successful (Status: ${session.payment_status}). Please try again or contact support.` };
  }

  // Verify user consistency
  if (session.metadata?.userId !== userId) {
    console.error(`User ID mismatch for session ${stripeSessionId}. Session User: ${session.metadata?.userId}, Current User: ${userId}`);
    return { error: 'User authentication mismatch during order processing. Please contact support.' };
  }

  // Extract shipping details from Stripe session
  const stripeShippingDetails = session.shipping_details;
  if (!stripeShippingDetails || !stripeShippingDetails.address || !stripeShippingDetails.name) {
    return { error: 'Shipping details are missing from the completed Stripe session. Please contact support.' };
  }
  
  // Format shipping address from Stripe
  const finalShippingAddress: ShippingAddress = {
    fullName: stripeShippingDetails.name,
    addressLine1: stripeShippingDetails.address.line1 || '',
    addressLine2: stripeShippingDetails.address.line2 || undefined,
    city: stripeShippingDetails.address.city || '',
    stateOrProvince: stripeShippingDetails.address.state || '',
    postalCode: stripeShippingDetails.address.postal_code || '',
    country: stripeShippingDetails.address.country || '',
  };

  // Calculate totals and shipping fee
  const subtotalFromStripe = (session.amount_subtotal || 0) / 100;
  const totalFromStripe = (session.amount_total || 0) / 100;
  
  // Find shipping fee line item
  let appShippingFee = 0;
  const feeLineItem = session.line_items?.data.find(item => 
    ((item.price?.product as Stripe.Product)?.name === 'Shipping & Handling Fee')
  );
  
  if (feeLineItem && feeLineItem.amount_total) {
    appShippingFee = feeLineItem.amount_total / 100;
  } else {
    console.warn(`Could not find 'Shipping & Handling Fee' line item in Stripe session ${stripeSessionId}. Fee may be incorrect.`);
  }
  
  const actualProductSubtotal = totalFromStripe - appShippingFee;

  // Create order in Supabase
  let orderId: number | null = null;
  try {
    // Insert order record
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        status: 'Order Received',
        subtotal: actualProductSubtotal,
        shipping_address: JSON.stringify(finalShippingAddress),
        total_amount: totalFromStripe,
        payment_method: 'stripe_checkout',
        payment_status: 'succeeded',
        stripe_checkout_session_id: stripeSessionId,
      })
      .select('id')
      .single();

    if (orderError || !orderData) {
      console.error('DB error creating order for session:', stripeSessionId, orderError);
      return { error: 'A database error occurred creating your order record. Please contact support.', internalError: orderError?.message };
    }
    
    orderId = orderData.id;

    // Create order items
    const orderItemsToInsert = [];
    for (const item of session.line_items?.data || []) {
      const product = item.price?.product as Stripe.Product;
      if (product && product.name !== 'Shipping & Handling Fee') {
        const smartCartProductId = product.metadata?.smartCartProductId;
        if (!smartCartProductId) {
          console.warn(`Stripe line item for product "${product.name}" in session ${stripeSessionId} is missing smartCartProductId metadata.`);
          continue;
        }
        
        orderItemsToInsert.push({
          order_id: orderId,
          product_id: parseInt(smartCartProductId, 10),
          quantity: item.quantity || 1,
          price: (item.price?.unit_amount || 0) / 100,
        });
      }
    }

    if (orderItemsToInsert.length === 0 && session.line_items?.data.some(li => (li.price?.product as Stripe.Product)?.name !== 'Shipping & Handling Fee')) {
      console.error(`No valid product items to insert for order ${orderId} from session ${stripeSessionId}.`);
      await supabase.from('orders').update({ status: 'Error - Items Missing (Mapping)' }).eq('id', orderId);
      return { orderId: orderId, error: 'Order placed, but product details could not be fully recorded. We will review your order.', internalError: 'No product items mapped from Stripe session.' };
    }

    // Insert order items
    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (orderItemsError) {
      console.error('DB error creating order items for order:', orderId, orderItemsError);
      await supabase.from('orders').update({ status: 'Error - Items Missing' }).eq('id', orderId);
      return { orderId: orderId, error: 'Order placed, but item details incomplete. We will review your order.', internalError: orderItemsError.message };
    }

    // Clear cart
    const { error: clearCartError } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (clearCartError) {
      console.warn(`Order ${orderId} processed, but failed to clear cart for user ${userId}:`, clearCartError);
    }

    // Log activity
    await supabase.from('activity_logs').insert({ 
      user_id: userId, 
      action: `Order ${orderId} placed via Stripe Checkout Session ${stripeSessionId}.` 
    });

    // Revalidate relevant paths
    revalidatePath('/cart');
    revalidatePath('/');

    return { orderId: orderId };
  } catch (e: any) {
    console.error('Unexpected error finalizing order from session:', stripeSessionId, e);
    if (orderId) {
      await supabase.from('orders').update({ status: 'Error - Processing Failed' }).eq('id', orderId);
    }
    return { error: 'An unexpected server error occurred while finalizing your order. Please contact support.', internalError: e.message };
  }
} 