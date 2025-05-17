import { redirect } from 'next/navigation';

// This page will simply redirect to the orders page
export default function DashboardPage() {
  redirect('/dashboard/orders');
} 