import { StripeErrorDisplay } from '@/components/checkout/StripeErrorDisplay';

export const metadata = {
  title: 'Checkout Cancelled | Smart Cart',
  description: 'Your checkout process was cancelled',
};

export default async function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  // Resolve the searchParams Promise
  const resolvedSearchParams = await searchParams;
  
  return (
    <StripeErrorDisplay
      title="Checkout Cancelled"
      message="Your checkout process was cancelled. Your cart has been saved, and you can continue shopping or try checking out again."
      supportContext={resolvedSearchParams?.session_id ? `Session ID (Cancelled): ${resolvedSearchParams.session_id}` : undefined}
    />
  );
} 