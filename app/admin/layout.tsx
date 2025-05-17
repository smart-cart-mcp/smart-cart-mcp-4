import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Dashboard | Smart Cart',
  description: 'Admin dashboard for managing orders and products',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?message=Please sign in to access the admin dashboard.');
  }

  // Fetch user session to check admin role
  const { data: { session } } = await supabase.auth.getSession();
  const isAdmin = session?.user?.app_metadata?.role === 'admin';

  if (!isAdmin) {
    redirect('/dashboard?message=You do not have permission to access the admin area.');
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6 min-h-[calc(100vh-150px)]">
      <AdminSidebar />
      <main className="flex-1 bg-card p-6 rounded-lg shadow">
        {children}
      </main>
    </div>
  );
} 