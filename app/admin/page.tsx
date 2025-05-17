import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { CreditCard, Package, ShoppingBag, Users } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  
  // Get order stats
  const { count: totalOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true });
    
  const { count: newOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Order Received');
    
  const { count: processingOrders } = await supabase
    .from('orders')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Processing');
    
  // Get other stats
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
    
  // For customer count, we can use a different approach
  const { data: customersData, error: customersError } = await supabase.auth.admin.listUsers();
  const totalCustomers = customersData?.users?.length || 0;

  // Stats cards to display
  const stats = [
    { name: 'Total Orders', value: totalOrders || 0, icon: ShoppingBag, href: '/admin/orders' },
    { name: 'New Orders', value: newOrders || 0, icon: CreditCard, href: '/admin/orders?status=Order%20Received' },
    { name: 'Processing', value: processingOrders || 0, icon: Package, href: '/admin/orders?status=Processing' },
    { name: 'Total Products', value: totalProducts || 0, icon: Package, href: '/admin/products' },
    { name: 'Total Customers', value: totalCustomers, icon: Users, href: '/admin/customers' },
  ];

  // Get the 5 most recent orders
  const { data: recentOrders } = await supabase
    .from('orders')
    .select(`
      id,
      user_id,
      status,
      total_amount,
      created_at
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-8">
        {stats.map((stat) => (
          <Link 
            href={stat.href} 
            key={stat.name}
            className="bg-card border rounded-lg p-5 hover:shadow-md transition-shadow flex items-center"
          >
            <div className="rounded-md bg-primary/10 p-3 flex-shrink-0">
              <stat.icon className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.name}</h3>
              <p className="text-3xl font-semibold">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Recent Orders Preview */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-primary hover:text-primary/80 text-sm">
            View All
          </Link>
        </div>
        
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
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {recentOrders?.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/admin/orders/${order.id}`} className="text-primary hover:underline">
                        #{order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                  </tr>
                ))}
                {(!recentOrders || recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-muted-foreground">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 