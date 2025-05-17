import { StripeErrorDisplay } from '@/components/checkout/StripeErrorDisplay';

export const metadata = {
  title: 'Checkout Cancelled | Smart Cart',
  description: 'Your checkout process was cancelled',
};

export default function CheckoutCancelPage({
  searchParams,
}: {
  searchParams?: { session_id?: string };
}) {
  return (
    <StripeErrorDisplay
      title="Checkout Cancelled"
      message="Your checkout process was cancelled. Your cart has been saved, and you can continue shopping or try checking out again."
      supportContext={searchParams?.session_id ? `Session ID (Cancelled): ${searchParams.session_id}` : undefined}
    />
  );
} 