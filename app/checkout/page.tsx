import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getCartItemsWithProductDetails } from '@/lib/actions/cartActions';
import { ShippingAddressFormFields, ShippingAddress } from '@/components/checkout/ShippingAddressForm';
import { OrderReviewFinal } from '@/components/checkout/OrderReviewFinal';
import { createStripeCheckoutSession } from '@/lib/actions/orderActions';
import { SubmitButton } from '@/components/submit-button';

export const metadata = {
  title: 'Checkout | Smart Cart',
  description: 'Complete your order with Smart Cart',
};

export default async function CheckoutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?message=Please sign in to proceed to checkout.');
  }

  const cartItemsResult = await getCartItemsWithProductDetails(user.id);

  if (cartItemsResult.error || !cartItemsResult.data || cartItemsResult.data.length === 0) {
    redirect('/cart?message=Your cart is empty or there was an error fetching it.');
  }

  const initialCartItems = cartItemsResult.data;
  const subtotal = initialCartItems.reduce((acc, item) => {
    const price = typeof item.products.price === 'number' ? item.products.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return acc + (price * quantity);
  }, 0);

  const shippingHandlingFee = subtotal * 0.20; // 20% upcharge
  const totalAmount = subtotal + shippingHandlingFee;

  return (
    <div className="container mx-auto p-4 max-w-2xl py-12">
      <h1 className="text-3xl font-bold mb-6">Secure Checkout</h1>

      <OrderReviewFinal
        cartItems={initialCartItems}
        subtotal={subtotal}
        shippingHandlingFee={shippingHandlingFee}
        totalAmount={totalAmount}
      />

      <form action={handleSubmitAndProceedToStripe} className="mt-6">
        <ShippingAddressFormFields />
        
        <div className="mt-6">
          <SubmitButton className="w-full" pendingText="Processing...">
            Proceed to Secure Payment with Stripe
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

// Server action to handle form submission (shipping address + proceed to Stripe)
async function handleSubmitAndProceedToStripe(formData: FormData) {
  'use server'; // This entire function is a server action

  const supabaseAction = await createClient(); // Re-init for server action context
  const { data: { user: actionUser } } = await supabaseAction.auth.getUser();

  if (!actionUser) {
    redirect('/sign-in?message=Session expired. Please sign in again.');
  }
  
  // Re-fetch cart items server-side to ensure integrity for checkout session
  const currentCartItemsResult = await getCartItemsWithProductDetails(actionUser.id);
  if (currentCartItemsResult.error || !currentCartItemsResult.data || currentCartItemsResult.data.length === 0) {
    redirect('/cart?message=Cart changed or became empty. Please review your cart.');
  }
  
  const currentCartItems = currentCartItemsResult.data;
  const currentSubtotal = currentCartItems.reduce((acc, item) => {
    const price = typeof item.products.price === 'number' ? item.products.price : 0;
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return acc + (price * quantity);
  }, 0);
  
  const currentShippingFee = currentSubtotal * 0.20;

  const shippingAddress: ShippingAddress = {
    fullName: formData.get('fullName') as string,
    addressLine1: formData.get('addressLine1') as string,
    addressLine2: formData.get('addressLine2') as string || undefined,
    city: formData.get('city') as string,
    stateOrProvince: formData.get('stateOrProvince') as string,
    postalCode: formData.get('postalCode') as string,
    country: formData.get('country') as string,
    phoneNumber: formData.get('phoneNumber') as string || undefined,
  };

  // Here you would typically validate shippingAddress

  const sessionResult = await createStripeCheckoutSession(
    currentCartItems,
    currentShippingFee, // Pass the calculated fee
    actionUser.id,
    actionUser.email || '', // Stripe needs customer email
    shippingAddress // Pass collected shipping address to Stripe
  );

  if (sessionResult.error || !sessionResult.sessionId || !sessionResult.sessionUrl) {
    redirect(`/checkout?error=${encodeURIComponent(sessionResult.error || 'Failed to create checkout session.')}`);
  }
  
  // The redirect to Stripe's URL
  redirect(sessionResult.sessionUrl);
}