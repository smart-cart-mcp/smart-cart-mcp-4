import { getOrderDetailsForUser } from '@/lib/actions/orderActions';
import OrderDetailView from '@/components/dashboard/OrderDetailView';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Order Details | Smart Cart',
  description: 'View details of your order',
};

export default async function OrderDetailPage({ 
  params 
}: { 
  params: { orderId: string } 
}) {
  // Parse the order ID from the URL
  const orderId = parseInt(params.orderId, 10);
  
  // Handle invalid order ID
  if (isNaN(orderId)) {
    return (
      <div>
        <div className="mb-6">
          <Link href="/dashboard/orders" className="inline-flex items-center text-primary hover:underline text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Invalid order ID format
        </div>
      </div>
    );
  }

  // Fetch the order details
  const { order, error } = await getOrderDetailsForUser(orderId);

  // Handle errors or not found
  if (error || !order) {
    return (
      <div>
        <div className="mb-6">
          <Link href="/dashboard/orders" className="inline-flex items-center text-primary hover:underline text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Orders
          </Link>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link 
          href="/dashboard/orders" 
          className="inline-flex items-center text-primary hover:underline text-sm"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Order #{order.id}</h1>
      </div>
      
      <OrderDetailView order={order} />
      
      <div className="mt-8 flex justify-end">
        <Button asChild variant="outline">
          <Link href="/dashboard/orders">Return to Order History</Link>
        </Button>
      </div>
    </div>
  );
} 