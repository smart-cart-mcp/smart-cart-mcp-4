'use client';

import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { StripePaymentForm } from './StripePaymentForm';

// Load Stripe outside of component render to avoid recreating on each render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface StripePaymentWrapperProps {
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (errorMessage: string) => void;
  orderAmount: number; // In cents
}

export function StripePaymentWrapper({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  orderAmount
}: StripePaymentWrapperProps) {
  // Configure Stripe Elements appearance
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0366d6',
        borderRadius: '4px',
      },
    },
  };

  return (
    <div className="mt-6 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
      {clientSecret && stripePromise ? (
        <Elements stripe={stripePromise} options={options}>
          <StripePaymentForm
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            orderAmount={orderAmount}
          />
        </Elements>
      ) : (
        <div className="text-center p-4">
          <p className="text-muted-foreground">Loading payment system...</p>
        </div>
      )}
    </div>
  );
} 