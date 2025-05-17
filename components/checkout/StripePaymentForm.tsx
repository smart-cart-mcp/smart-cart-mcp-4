'use client';

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { FormMessage } from '@/components/form-message';

interface StripePaymentFormProps {
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (errorMessage: string) => void;
  orderAmount: number; // In cents
}

export function StripePaymentForm({ 
  onPaymentSuccess, 
  onPaymentError, 
  orderAmount 
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return; // Stripe.js has not yet loaded
    }

    setIsLoading(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL for redirect-based payments (3DS, etc.)
        return_url: `${window.location.origin}/order-confirmation/processing`,
      },
      redirect: 'if_required', // Only redirect if required for authentication
    });

    // If we get here, the payment either succeeded without redirect or had an error
    if (error) {
      const message = error.message || 'An unexpected error occurred during payment';
      setErrorMessage(message);
      onPaymentError(message);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment succeeded without redirect
      onPaymentSuccess(paymentIntent.id);
    } else if (paymentIntent) {
      // Payment is in another state like 'processing'
      setErrorMessage(`Payment status: ${paymentIntent.status}. Waiting for confirmation.`);
    }
    
    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      
      {errorMessage && (
        <div className="mt-4">
          <FormMessage message={{ error: errorMessage }} />
        </div>
      )}
      
      <Button 
        disabled={isLoading || !stripe || !elements} 
        className="w-full mt-6"
        type="submit"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            Processing...
          </span>
        ) : (
          <span>
            Pay {new Intl.NumberFormat('en-US', { 
              style: 'currency', 
              currency: 'USD' 
            }).format(orderAmount / 100)}
          </span>
        )}
      </Button>
    </form>
  );
} 