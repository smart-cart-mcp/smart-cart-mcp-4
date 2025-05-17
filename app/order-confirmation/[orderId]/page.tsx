import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Order Confirmation | Smart Cart',
  description: 'Your order has been confirmed',
};

async function getOrderDetails(orderId: number, userId: string) {
  const supabase = await createClient();
  
  // Fetch order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();
  
  if (orderError || !order) {
    console.error('Error fetching order:', orderError);
    return { error: 'Order not found or access denied' };
  }
  
  // Fetch order items with product details
  const { data: orderItems, error: itemsError } = await supabase
    .from('order_items')
    .select(`
      *,
      products:products (*)
    `)
    .eq('order_id', orderId);
  
  if (itemsError) {
    console.error('Error fetching order items:', itemsError);
    return { error: 'Failed to load order items' };
  }
  
  return { order, orderItems };
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?message=Please sign in to view your order.');
  }

  const orderId = parseInt(params.orderId);
  if (isNaN(orderId)) {
    redirect('/'); // Invalid order ID
  }

  const { order, orderItems, error } = await getOrderDetails(orderId, user.id);
  
  if (error || !order) {
    redirect(`/?message=${encodeURIComponent(error || 'Order not found')}`);
  }

  // Parse shipping address from JSON string
  const shippingAddress = JSON.parse(order.shipping_address || '{}');
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 text-green-700 dark:text-green-400">Order Confirmed!</h1>
        <p className="text-green-600 dark:text-green-500">
          Thank you for your order. We've received your payment and are processing your order.
        </p>
      </div>
      
      <div className="bg-card border rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Order #{orderId}</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {order.status}
          </span>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-medium mb-2">Order Information</h3>
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-medium">Date: </span> 
              {new Date(order.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-medium">Payment Method: </span> 
              {order.payment_method === 'stripe_checkout' ? 'Credit Card (Stripe)' : order.payment_method}
            </p>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Payment Status: </span> 
              <span className="text-green-600 dark:text-green-500">{order.payment_status}</span>
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Shipping Information</h3>
            <p className="text-sm text-muted-foreground mb-1">
              {shippingAddress.fullName}
            </p>
            <p className="text-sm text-muted-foreground mb-1">
              {shippingAddress.addressLine1}
            </p>
            {shippingAddress.addressLine2 && (
              <p className="text-sm text-muted-foreground mb-1">
                {shippingAddress.addressLine2}
              </p>
            )}
            <p className="text-sm text-muted-foreground mb-1">
              {shippingAddress.city}, {shippingAddress.stateOrProvince} {shippingAddress.postalCode}
            </p>
            <p className="text-sm text-muted-foreground">
              {shippingAddress.country}
            </p>
          </div>
        </div>
        
        {/* Order Items */}
        <h3 className="font-medium mb-3 border-t pt-4">Order Items</h3>
        <div className="divide-y">
          {orderItems.map((item) => (
            <div key={item.id} className="py-4 flex items-center gap-4">
              <div className="relative h-16 w-16 bg-secondary rounded overflow-hidden flex-shrink-0">
                {item.products?.image_url ? (
                  <Image
                    src={item.products.image_url}
                    alt={item.products.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <p className="font-medium">
                  {item.products?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity} × {formatCurrency(item.price)}
                </p>
              </div>
              
              <div className="text-right">
                {formatCurrency(item.quantity * item.price)}
              </div>
            </div>
          ))}
        </div>
        
        {/* Order Totals */}
        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(order.subtotal || 0)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Shipping & Handling Fee</span>
            <span>{formatCurrency(order.shipping_handling_fee || 0)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(order.total_amount || 0)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Link href="/">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <Link href="#">
          <Button>View Order Status</Button>
        </Link>
      </div>
    </div>
  );
} 