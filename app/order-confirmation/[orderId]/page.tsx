import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getOrderWithItems } from '@/lib/actions/orderActions';
import { OrderReviewFinal } from '@/components/checkout/OrderReviewFinal';
import { ShippingAddress, CartItemWithProduct } from '@/lib/types/checkout';

export const metadata = {
  title: 'Order Confirmation | Smart Cart',
  description: 'Your order has been confirmed',
};

export default async function OrderConfirmationPage({ params }: { params: { orderId: string } }) {
  // Get the current user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?message=Please sign in to view your order');
  }

  // Get order details
  const { data: order, error } = await getOrderWithItems(parseInt(params.orderId), user.id);

  if (error || !order) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h1>
        <p className="mb-6">
          We could not find details for this order, or you may not have permission to view it.
        </p>
        <Link 
          href="/"
          className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  // Parse shipping address if it's a string
  let shippingAddress: ShippingAddress | undefined;
  if (typeof order.shipping_address === 'string') {
    try {
      shippingAddress = JSON.parse(order.shipping_address);
    } catch (e) {
      console.error('Failed to parse shipping address', e);
    }
  } else if (order.shipping_address) {
    shippingAddress = order.shipping_address as unknown as ShippingAddress;
  }

  // Convert order items to cart items format for the review component
  const cartItems: CartItemWithProduct[] = order.order_items.map(item => ({
    id: item.id,
    user_id: user.id,
    product_id: item.product_id,
    quantity: item.quantity,
    added_at: new Date().toISOString(), // Not important for display
    updated_at: new Date().toISOString(), // Not important for display
    product: {
      id: item.product_id,
      name: item.products?.name || 'Unknown Product',
      price: item.price || 0,
      image_url: item.products?.image_url || null,
    }
  }));

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-green-600">Thank You! Your Order is Confirmed</h1>
        <p className="text-lg">
          Order ID: <span className="font-semibold">#{order.id}</span>
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Placed on {new Date(order.created_at).toLocaleDateString()}
        </p>
      </div>

      <OrderReviewFinal
        cartItems={cartItems}
        shippingAddress={shippingAddress}
        subtotal={order.subtotal || 0}
        shippingHandlingFee={order.shipping_handling_fee || 0}
        totalAmount={order.total_amount}
      />

      <div className="mt-8 text-center">
        <p className="mb-6">
          You will receive an email confirmation shortly.
          <br />
          Your order status is currently: <strong>{order.status}</strong>
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Continue Shopping
          </Link>
          <Link
            href="/cart"
            className="px-6 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
          >
            Return to Cart
          </Link>
        </div>
      </div>
    </div>
  );
} 