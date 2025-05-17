import { OrderDetail } from '@/lib/actions/orderActions';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { ShippingAddress } from '@/components/checkout/ShippingAddressForm';

interface OrderDetailViewProps {
  order: OrderDetail;
}

export default function OrderDetailView({ order }: OrderDetailViewProps) {
  // Format date for readable display
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format currency values
  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Get appropriate badge style based on order status
  const getStatusBadgeVariant = (status: string | null): "default" | "secondary" | "destructive" | "outline" => {
    if (!status) return 'outline';
    
    switch (status.toLowerCase()) {
      case 'order received':
      case 'processing':
        return 'default'; // Primary color
      case 'shipped':
        return 'secondary'; // Secondary color
      case 'delivered':
        return 'outline'; // Outline style for completed orders
      case 'cancelled':
      case 'refunded':
        return 'destructive'; // Red for cancelled or refunded
      default:
        return 'outline'; // Default outline for other statuses
    }
  };

  // Parse shipping address if available
  const shippingAddr: ShippingAddress | undefined = order.parsed_shipping_address;

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      {/* Order header */}
      <div className="px-4 py-5 sm:px-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-lg leading-6 font-medium">Order #{order.id}</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>
        {order.status && (
          <Badge variant={getStatusBadgeVariant(order.status)} className="text-sm px-3 py-1">
            {order.status}
          </Badge>
        )}
      </div>

      {/* Order details */}
      <div className="border-t border-border">
        <dl>
          {/* Order Items Section */}
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-muted-foreground">Items</dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              {order.order_items.length > 0 ? (
                <ul className="divide-y divide-border border rounded-md">
                  {order.order_items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between p-3">
                      <div className="flex items-center">
                        {item.products?.image_url && (
                          <div className="relative h-12 w-12 rounded-md overflow-hidden mr-4">
                            <Image
                              src={item.products.image_url}
                              alt={item.products?.name || 'Product Image'}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <span>{item.products?.name || 'Unknown Product'}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">
                          {item.quantity} × {formatCurrency(item.price)}
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.quantity * item.price)}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No items found for this order.</p>
              )}
            </dd>
          </div>

          {/* Financial Summary */}
          <div className="bg-muted/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-muted-foreground">Subtotal</dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2 text-right">
              {formatCurrency(order.subtotal)}
            </dd>
          </div>
          
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-muted-foreground">Shipping & Handling</dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2 text-right">
              {formatCurrency(order.shipping_handling_fee)}
            </dd>
          </div>
          
          <div className="bg-muted/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-bold">Total</dt>
            <dd className="mt-1 text-sm font-bold sm:mt-0 sm:col-span-2 text-right">
              {formatCurrency(order.total_amount)}
            </dd>
          </div>

          {/* Shipping Information */}
          {shippingAddr && (
            <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-muted-foreground">Shipping Address</dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <p>{shippingAddr.fullName}</p>
                <p>{shippingAddr.addressLine1}</p>
                {shippingAddr.addressLine2 && <p>{shippingAddr.addressLine2}</p>}
                <p>
                  {shippingAddr.city}, {shippingAddr.stateOrProvince} {shippingAddr.postalCode}
                </p>
                <p>{shippingAddr.country}</p>
                {shippingAddr.phoneNumber && (
                  <p className="mt-1">Phone: {shippingAddr.phoneNumber}</p>
                )}
              </dd>
            </div>
          )}

          {/* Payment Information */}
          <div className="bg-muted/40 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-muted-foreground">Payment Method</dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              {order.payment_method === 'stripe_checkout' 
                ? 'Credit Card (Stripe)' 
                : order.payment_method || 'N/A'}
            </dd>
          </div>
          
          <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-muted-foreground">Payment Status</dt>
            <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
              {order.payment_status || 'N/A'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
} 