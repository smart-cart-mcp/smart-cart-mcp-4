import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?message=Please sign in to access your dashboard.');
  }

  return (
    <div className="container mx-auto p-4 flex flex-col md:flex-row gap-6 min-h-[calc(100vh-150px)]">
      <DashboardSidebar />
      <main className="flex-1 bg-card p-6 rounded-lg shadow">
        {children}
      </main>
    </div>
  );
} 