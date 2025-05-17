import { CartItemDetail } from "@/lib/actions/cartActions";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface OrderSummaryProps {
  cartItems: CartItemDetail[];
  cartTotal: number;
}

export default function OrderSummary({ cartItems, cartTotal }: OrderSummaryProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate shipping fee
  const shippingHandlingFee = cartTotal * 0.2; // 20% of subtotal

  // Total items count (sum of quantities)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Grand total
  const grandTotal = cartTotal + shippingHandlingFee;

  return (
    <div className="bg-card rounded-lg shadow-sm border p-6 sticky top-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Items ({totalItems}):</span>
          <span>{formatCurrency(cartTotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Shipping & Handling (20%):</span>
          <span>{formatCurrency(shippingHandlingFee)}</span>
        </div>
        
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
        
        <Link href="/checkout" className="w-full block mt-6">
          <Button className="w-full" size="lg">
            Proceed to Checkout
          </Button>
        </Link>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Need help? <Link href="#" className="text-primary hover:underline">Contact us</Link></p>
        </div>
      </div>
    </div>
  );
} 