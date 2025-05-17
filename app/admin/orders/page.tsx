import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const metadata = {
  title: 'Manage Orders | Admin Dashboard',
  description: 'Manage customer orders and update their status',
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    status?: string;
    search?: string;
  };
}) {
  const supabase = await createClient();
  
  // Parse query parameters
  const currentPage = searchParams?.page ? parseInt(searchParams.page) : 1;
  const filter = searchParams?.status || '';
  const searchQuery = searchParams?.search || '';
  const itemsPerPage = 10;
  
  // Base query
  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' });
  
  // Apply filters
  if (filter) {
    query = query.eq('status', filter);
  }
  
  // Apply search if provided
  if (searchQuery) {
    // If search is a number, search by ID
    if (!isNaN(parseInt(searchQuery))) {
      query = query.eq('id', parseInt(searchQuery));
    }
  }
  
  // Add pagination
  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  
  // Execute query
  const { data: orders, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);
  
  // Get user emails for these orders
  let userEmails: Record<string, string> = {};
  if (orders && orders.length > 0) {
    const userIds = orders.map(order => order.user_id);
    const { data: users } = await supabase.auth.admin.listUsers();
    
    if (users) {
      users.users.forEach(user => {
        if (userIds.includes(user.id)) {
          userEmails[user.id] = user.email || 'No email';
        }
      });
    }
  }
  
  // Calculate pagination details
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Get available statuses for filtering
  const { data: statusOptions } = await supabase
    .from('orders')
    .select('status')
    .limit(100);
  
  // Create a unique list of statuses
  const uniqueStatuses = Array.from(new Set(statusOptions?.map(o => o.status) || []));

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Manage Orders</h1>
        <div className="flex space-x-2">
          <Link href="/admin" className="text-primary hover:underline text-sm">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <form>
              <Input
                type="search"
                name="search"
                placeholder="Search by order ID..."
                defaultValue={searchQuery}
                className="w-full pl-9 pr-4"
              />
              <button type="submit" hidden>Search</button>
            </form>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/admin/orders" 
            className={`px-3 py-1 text-sm rounded-md border ${!filter ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
          >
            All
          </Link>
          
          {uniqueStatuses.map(status => (
            <Link
              key={status}
              href={`/admin/orders?status=${encodeURIComponent(status)}`}
              className={`px-3 py-1 text-sm rounded-md border ${filter === status ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              {status}
            </Link>
          ))}
        </div>
      </div>
      
      {/* Orders table */}
      <div className="bg-card border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-border">
            <thead className="bg-muted">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {orders?.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {userEmails[order.user_id] || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'Order Received' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'Shipped' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    ${order.total_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link 
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:text-primary/80"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
              
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-muted-foreground">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {from + 1} to {Math.min(to + 1, totalItems)} of {totalItems} orders
          </p>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!hasPrevPage}
              asChild={hasPrevPage}
            >
              {hasPrevPage ? (
                <Link
                  href={`/admin/orders?page=${currentPage - 1}${filter ? `&status=${encodeURIComponent(filter)}` : ''}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
                >
                  Previous
                </Link>
              ) : (
                <span>Previous</span>
              )}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              disabled={!hasNextPage}
              asChild={hasNextPage}
            >
              {hasNextPage ? (
                <Link 
                  href={`/admin/orders?page=${currentPage + 1}${filter ? `&status=${encodeURIComponent(filter)}` : ''}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`}
                >
                  Next
                </Link>
              ) : (
                <span>Next</span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 