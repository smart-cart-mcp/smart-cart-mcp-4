import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { getCartItems, getCartTotal } from '@/lib/actions/cartActions';
import { CheckoutClientPage } from './checkout-client-page';

export const metadata = {
  title: 'Checkout | Smart Cart',
  description: 'Complete your purchase securely',
};

export default async function CheckoutPage() {
  // Get the current user
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in?message=Please sign in to proceed to checkout');
  }

  // Get cart items
  const cartItems = await getCartItems();
  
  // Check if cart is empty
  if (cartItems.length === 0) {
    redirect('/cart?message=Your cart is empty');
  }

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
  
  // Apply 20% upcharge for shipping & handling
  const shippingHandlingFee = subtotal * 0.2;
  const totalAmount = subtotal + shippingHandlingFee;

  return (
    <CheckoutClientPage
      userId={user.id}
      initialCartItems={cartItems}
      initialSubtotal={subtotal}
      initialShippingHandlingFee={shippingHandlingFee}
      initialTotalAmount={totalAmount}
    />
  );
} 