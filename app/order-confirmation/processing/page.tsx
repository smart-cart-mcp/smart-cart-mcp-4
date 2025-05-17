'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormMessage } from '@/components/form-message';

export default function PaymentProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Processing your payment...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent');
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret');
    const redirectStatus = searchParams.get('redirect_status');

    if (!paymentIntent || !paymentIntentClientSecret) {
      setError('Payment information is missing. Please contact support.');
      return;
    }

    // In a production environment, you should call a server action here
    // to verify the payment status with Stripe and then finalize the order
    async function processPayment() {
      try {
        // For now, we'll assume payment was successful if we have payment_intent
        // and handle the order creation server-side in a more complete implementation
        
        // Simulate server processing time
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        // Ideally, this would be the orderId returned from a server action
        if (redirectStatus === 'succeeded') {
          setStatus('Payment successful! Redirecting to your order confirmation...');
          setTimeout(() => {
            // In a complete implementation, you would redirect to the specific order
            router.push('/'); 
          }, 1500);
        } else {
          setError('Payment was not completed successfully. Please try again or contact support.');
        }
      } catch (err: any) {
        setError(`Error processing payment: ${err.message}`);
      }
    }

    processPayment();
  }, [searchParams, router]);

  return (
    <div className="container mx-auto py-16 px-4 max-w-md">
      <div className="bg-card rounded-lg shadow-sm border p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Processing</h1>
        
        {error ? (
          <div className="mt-4">
            <FormMessage message={{ error }} />
            <div className="mt-6">
              <button 
                onClick={() => router.push('/checkout')}
                className="text-primary hover:underline"
              >
                Return to checkout
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="animate-pulse h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-primary/30"></div>
              </div>
            </div>
            <p className="text-lg mb-2">{status}</p>
            <p className="text-sm text-muted-foreground">
              Please do not close this window or navigate away from this page.
            </p>
          </>
        )}
      </div>
    </div>
  );
} 