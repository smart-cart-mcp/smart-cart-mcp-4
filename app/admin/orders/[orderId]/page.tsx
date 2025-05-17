'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Define extended order type including tracking_number
type OrderWithTracking = {
  id: number;
  user_id: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  payment_method: string | null;
  payment_status: string | null;
  created_at: string;
  updated_at: string;
  stripe_checkout_session_id?: string | null;
  tracking_number?: string | null;
  subtotal?: number | null;
  shipping_handling_fee?: number | null;
};

// Order status options
const STATUS_OPTIONS = [
  'Order Received',
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
  'Refunded'
];

export default function AdminOrderDetailPage({ 
  params 
}: { 
  params: { orderId: string } 
}) {
  const router = useRouter();
  const supabase = createClient();
  const orderId = parseInt(params.orderId, 10);
  
  const [order, setOrder] = useState<OrderWithTracking | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerEmail, setCustomerEmail] = useState<string>('');
  
  // Form state
  const [status, setStatus] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Load order details
  useEffect(() => {
    async function loadOrderDetails() {
      if (isNaN(orderId)) {
        setError('Invalid order ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
          
        if (orderError) throw orderError;
        if (!orderData) throw new Error('Order not found');
        
        // Cast to our type with tracking_number
        const typedOrder = orderData as OrderWithTracking;
        setOrder(typedOrder);
        setStatus(typedOrder.status);
        setTrackingNumber(typedOrder.tracking_number || '');
        
        // Fetch order items with product details
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select(`
            *,
            products (*)
          `)
          .eq('order_id', orderId);
          
        if (itemsError) throw itemsError;
        setOrderItems(itemsData || []);
        
        // Get customer email
        if (typedOrder.user_id) {
          const { data: userData } = await supabase.auth.admin.getUserById(typedOrder.user_id);
          if (userData?.user?.email) {
            setCustomerEmail(userData.user.email);
          }
        }
        
      } catch (err: any) {
        console.error('Error loading order:', err);
        setError(err.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    }
    
    loadOrderDetails();
  }, [orderId, supabase]);

  // Handle form submission to update order status
  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status, 
          tracking_number: trackingNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);
        
      if (error) throw error;
      
      toast.success('Order updated successfully');
      router.refresh();
    } catch (err: any) {
      console.error('Error updating order:', err);
      toast.error('Failed to update order: ' + (err.message || 'Unknown error'));
    } finally {
      setSubmitting(false);
    }
  };

  // Format data for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };
  
  // Handle loading and error states
  if (loading) {
    return <div className="p-6 text-center">Loading order details...</div>;
  }
  
  if (error || !order) {
    return (
      <div>
        <div className="mb-6">
          <Link href="/admin/orders" className="inline-flex items-center text-primary hover:underline text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </div>
        <div className="bg-destructive/10 text-destructive p-6 rounded-lg">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }
  
  // Parse shipping address
  let shippingAddress = null;
  try {
    if (order.shipping_address) {
      shippingAddress = JSON.parse(order.shipping_address);
    }
  } catch (e) {
    console.error('Error parsing shipping address', e);
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/admin/orders" 
          className="inline-flex items-center text-primary hover:underline text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold mt-2">Order #{order.id}</h1>
          <div className="text-sm text-muted-foreground">
            {formatDate(order.created_at)}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Order Information */}
        <div className="col-span-2">
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-muted">
              <h2 className="font-semibold">Order Details</h2>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Order Status Section */}
                <div>
                  <h3 className="font-medium mb-2">Order Status</h3>
                  <div className="px-3 py-1.5 rounded-md bg-muted inline-block text-sm mb-4">
                    {order.status}
                  </div>
                  
                  <h3 className="font-medium mb-2">Customer</h3>
                  <p className="text-sm mb-4">{customerEmail || 'No email available'}</p>
                  
                  <h3 className="font-medium mb-2">Payment</h3>
                  <p className="text-sm">Method: {order.payment_method || 'Unknown'}</p>
                  <p className="text-sm">Status: {order.payment_status || 'Unknown'}</p>
                  {order.stripe_checkout_session_id && (
                    <p className="text-sm text-muted-foreground break-all mt-1">
                      Session ID: {order.stripe_checkout_session_id}
                    </p>
                  )}
                </div>
                
                {/* Shipping Address Section */}
                {shippingAddress && (
                  <div>
                    <h3 className="font-medium mb-2">Shipping Address</h3>
                    <div className="text-sm">
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.addressLine1}</p>
                      {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                      <p>
                        {shippingAddress.city}, {shippingAddress.stateOrProvince} {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                      {shippingAddress.phoneNumber && (
                        <p className="mt-1">Phone: {shippingAddress.phoneNumber}</p>
                      )}
                    </div>
                    
                    {order.tracking_number && (
                      <div className="mt-4">
                        <h3 className="font-medium mb-1">Tracking Number</h3>
                        <p className="text-sm">{order.tracking_number}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Order Items */}
          <div className="bg-card border rounded-lg overflow-hidden mt-6">
            <div className="px-6 py-4 bg-muted">
              <h2 className="font-semibold">Order Items</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-border">
                <thead className="bg-background">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Product
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {orderItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.products?.image_url && (
                            <div className="h-10 w-10 flex-shrink-0 relative rounded overflow-hidden mr-3">
                              <Image
                                src={item.products.image_url}
                                alt={item.products.name}
                                fill
                                className="object-cover"
                                sizes="40px"
                              />
                            </div>
                          )}
                          <div className="text-sm">
                            {item.products?.name || 'Unknown Product'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))}
                  
                  {(!orderItems || orderItems.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm text-right font-medium">
                      Subtotal
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(order.subtotal || 0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm text-right font-medium">
                      Shipping & Handling
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatCurrency(order.shipping_handling_fee || 0)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-sm text-right font-medium">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                      {formatCurrency(order.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Update Order Form */}
        <div className="col-span-1">
          <div className="bg-card border rounded-lg overflow-hidden sticky top-6">
            <div className="px-6 py-4 bg-muted">
              <h2 className="font-semibold">Update Order</h2>
            </div>
            
            <form onSubmit={handleUpdateOrder} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select 
                  value={status} 
                  onValueChange={setStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tracking">Tracking Number</Label>
                <Input
                  id="tracking"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                />
                <p className="text-xs text-muted-foreground">
                  Enter shipping tracking number (optional)
                </p>
              </div>
              
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Order'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 