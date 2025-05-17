'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { Package, ShoppingBag, Users, LayoutDashboard, LogOut } from 'lucide-react';

// Navigation links for the admin dashboard
const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Customers', href: '/admin/customers', icon: Users },
];

// Helper to combine conditional classes
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <aside className="w-full md:w-64 bg-background p-6 rounded-lg shadow md:sticky md:top-24 self-start">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        <p className="text-sm text-muted-foreground">Manage your store</p>
      </div>
      
      <nav className="space-y-1 mb-8">
        {/* Nav items from the array */}
        {navigation.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={classNames(
              pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-accent hover:text-accent-foreground',
              'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
            )}
          >
            <item.icon
              className={classNames(
                pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground group-hover:text-foreground',
                'mr-3 flex-shrink-0 h-5 w-5'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        ))}
      </nav>
      
      {/* Sign out button */}
      <div className="pt-4 border-t border-border">
        <button
          onClick={handleSignOut}
          className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-foreground hover:bg-accent hover:text-accent-foreground w-full"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground group-hover:text-foreground" aria-hidden="true" />
          Sign Out
        </button>
      </div>
    </aside>
  );
} 