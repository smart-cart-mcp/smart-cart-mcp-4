'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShippingAddressForm } from '@/components/checkout/ShippingAddressForm';
import { OrderReviewFinal } from '@/components/checkout/OrderReviewFinal';
import { StripePaymentWrapper } from '@/components/checkout/StripePaymentWrapper';
import { createPaymentIntent, finalizeOrderAndClearCart } from '@/lib/actions/orderActions';
import { ShippingAddress, CartItemWithProduct } from '@/lib/types/checkout';

interface CheckoutClientPageProps {
  userId: string;
  initialCartItems: CartItemWithProduct[];
  initialSubtotal: number;
  initialShippingHandlingFee: number;
  initialTotalAmount: number;
}

export function CheckoutClientPage({
  userId,
  initialCartItems,
  initialSubtotal,
  initialShippingHandlingFee,
  initialTotalAmount
}: CheckoutClientPageProps) {
  const router = useRouter();
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle shipping address submission
  const handleAddressSubmit = async (address: ShippingAddress) => {
    setShippingAddress(address);
    setProcessingError(null);
    setIsProcessing(true);
    
    // Calculate amount in cents for Stripe
    const amountInCents = Math.round(initialTotalAmount * 100);
    
    try {
      const result = await createPaymentIntent(amountInCents, 'usd', { userId });
      
      if (result.clientSecret) {
        setClientSecret(result.clientSecret);
      } else {
        setProcessingError(result.error || 'Failed to initialize payment');
      }
    } catch (error: any) {
      setProcessingError(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!shippingAddress) {
      setProcessingError('Shipping address is missing');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const orderResult = await finalizeOrderAndClearCart(
        paymentIntentId,
        shippingAddress,
        initialCartItems,
        userId,
        initialSubtotal,
        initialShippingHandlingFee,
        initialTotalAmount
      );

      if (orderResult.orderId) {
        router.push(`/order-confirmation/${orderResult.orderId}`);
      } else {
        setProcessingError(orderResult.error || 'Failed to create order after payment');
      }
    } catch (error: any) {
      setProcessingError(error.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment error
  const handlePaymentError = (errorMessage: string) => {
    setProcessingError(`Payment failed: ${errorMessage}`);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Secure Checkout</h1>
      
      {processingError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {processingError}
        </div>
      )}

      {/* Display order review before address/payment forms */}
      <OrderReviewFinal
        cartItems={initialCartItems}
        subtotal={initialSubtotal}
        shippingHandlingFee={initialShippingHandlingFee}
        totalAmount={initialTotalAmount}
        shippingAddress={shippingAddress}
      />

      {/* Show shipping form if no address yet, otherwise show payment form */}
      {!shippingAddress || !clientSecret ? (
        <ShippingAddressForm 
          onSubmitAddress={handleAddressSubmit} 
          isSubmitting={isProcessing} 
        />
      ) : (
        <StripePaymentWrapper
          clientSecret={clientSecret}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentError={handlePaymentError}
          orderAmount={Math.round(initialTotalAmount * 100)}
        />
      )}
    </div>
  );
} 