import { getUserOrders } from '@/lib/actions/orderActions';
import OrderHistoryList from '@/components/dashboard/OrderHistoryList';
import PaginationControls from '@/components/ui/PaginationControls';

const ORDERS_PER_PAGE = 10;

export const metadata = {
  title: 'My Orders | Smart Cart',
  description: 'View your order history',
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Resolve the searchParams Promise
  const resolvedSearchParams = await searchParams;
  
  // Get the current page from the URL query parameters
  const currentPage = resolvedSearchParams?.page 
    ? parseInt(resolvedSearchParams.page, 10)
    : 1;
  
  // Fetch orders for the current page
  const { orders, error, totalCount } = await getUserOrders(
    currentPage,
    ORDERS_PER_PAGE
  );

  // Show error if the fetch failed
  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  // Show empty state if no orders
  if (!orders || orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
        <div className="text-center p-12 bg-card border rounded-lg">
          <h2 className="text-xl font-medium mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't placed any orders yet. Start shopping to create your first order!
          </p>
          <a 
            href="/" 
            className="inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Browse Products
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">My Orders</h1>
      
      <OrderHistoryList orders={orders} />
      
      <PaginationControls
        currentPage={currentPage}
        totalItems={totalCount}
        itemsPerPage={ORDERS_PER_PAGE}
        basePath="/dashboard/orders"
      />
    </div>
  );
} 