import Link from 'next/link';
import { UserOrderSummary } from '@/lib/actions/orderActions';
import { Badge } from '@/components/ui/badge';

interface OrderHistoryItemProps {
  order: UserOrderSummary;
}

export default function OrderHistoryItem({ order }: OrderHistoryItemProps) {
  // Format date nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  // Determine badge color based on order status
  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case 'order received':
      case 'processing':
        return 'default'; // Primary color (blue/indigo)
      case 'shipped':
        return 'secondary'; // Secondary color
      case 'delivered':
        return 'outline'; // Outline style
      case 'cancelled':
      case 'refunded':
        return 'destructive'; // Red/destructive color
      default:
        return 'outline'; // Default to outline for unknown statuses
    }
  };

  return (
    <Link 
      href={`/dashboard/orders/${order.id}`} 
      className="block p-4 bg-card border rounded-lg hover:shadow-md transition-shadow duration-150 ease-in-out"
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <p className="text-sm text-muted-foreground">
            Order ID: <span className="font-medium text-foreground">#{order.id}</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Date: <span className="font-medium text-foreground">{formatDate(order.created_at)}</span>
          </p>
          {order.item_count !== undefined && (
            <p className="text-sm text-muted-foreground">
              Items: <span className="font-medium text-foreground">{order.item_count}</span>
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold">{formatCurrency(order.total_amount)}</p>
          <Badge variant={getStatusBadgeVariant(order.status)} className="mt-1">
            {order.status}
          </Badge>
        </div>
      </div>
    </Link>
  );
} 