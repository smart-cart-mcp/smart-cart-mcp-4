import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { handleSuccessfulCheckoutSession } from '@/lib/actions/orderActions';
import { StripeErrorDisplay } from '@/components/checkout/StripeErrorDisplay';

export const metadata = {
  title: 'Order Processing | Smart Cart',
  description: 'Processing your order',
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  // Resolve the searchParams Promise
  const resolvedSearchParams = await searchParams;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?message=Please sign in.');
  }

  const sessionId = resolvedSearchParams?.session_id;
  if (!sessionId) {
    return (
      <StripeErrorDisplay 
        title="Checkout Error" 
        message="Missing checkout session ID. Unable to confirm your order." 
      />
    );
  }

  const result = await handleSuccessfulCheckoutSession(sessionId, user.id);

  if (result.error || !result.orderId) {
    console.error("Error handling successful checkout:", result.internalError || result.error);
    return (
      <StripeErrorDisplay 
        title="Order Processing Error" 
        message={result.error || 'There was an issue finalizing your order. Please contact support.'} 
        supportContext={`Session ID: ${sessionId}`} 
      />
    );
  }

  // Order successfully created, redirect to order confirmation page
  redirect(`/order-confirmation/${result.orderId}`);
} 