import Image from "next/image";
import Link from "next/link";
import { CartItemWithProduct } from "@/lib/actions/cartActions";

interface OrderReviewFinalProps {
  cartItems: CartItemWithProduct[];
  subtotal: number;
  shippingHandlingFee: number;
  totalAmount: number;
}

export function OrderReviewFinal({ 
  cartItems, 
  subtotal, 
  shippingHandlingFee, 
  totalAmount 
}: OrderReviewFinalProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="mt-8 space-y-6">
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Order Review</h2>
        
        <div className="divide-y">
          {cartItems.map((item) => (
            <div key={item.id} className="py-4 flex items-center gap-4">
              <div className="relative h-16 w-16 bg-secondary rounded overflow-hidden flex-shrink-0">
                {item.products.image_url ? (
                  <Image
                    src={item.products.image_url}
                    alt={item.products.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <p className="font-medium">
                  {item.products.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Quantity: {item.quantity} × {formatCurrency(item.products.price)}
                </p>
              </div>
              
              <div className="text-right">
                {formatCurrency(item.quantity * item.products.price)}
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-4 mt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          <div className="flex justify-between">
            <span>Shipping & Handling Fee (20%)</span>
            <span>{formatCurrency(shippingHandlingFee)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-muted-foreground">
        <p>
          By proceeding to checkout, you agree to our{" "}
          <Link href="#" className="text-primary hover:underline">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <p className="mt-2">
          Please review your order carefully before proceeding to payment.
        </p>
      </div>
    </div>
  );
} 