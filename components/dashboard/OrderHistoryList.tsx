import { UserOrderSummary } from '@/lib/actions/orderActions';
import OrderHistoryItem from './OrderHistoryItem';

interface OrderHistoryListProps {
  orders: UserOrderSummary[];
}

export default function OrderHistoryList({ orders }: OrderHistoryListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderHistoryItem key={order.id} order={order} />
      ))}
    </div>
  );
} 