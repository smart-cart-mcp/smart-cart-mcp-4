import { getCartItems, getCartTotal } from "@/lib/actions/cartActions";
import CartItemsList from "@/components/cart/CartItemsList";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import OrderSummary from "@/components/cart/OrderSummary";

export const metadata = {
  title: "Your Cart | Smart Cart",
  description: "View and manage your cart items",
};

export default async function CartPage() {
  const cartItems = await getCartItems();
  const cartTotal = await getCartTotal();

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Your Smart Cart</h1>
        
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Looks like you haven't added any products to your cart yet.
            Start shopping to find amazing products!
          </p>
          <Link href="/categories">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Smart Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <CartItemsList cartItems={cartItems} />
        </div>
        
        <div className="lg:col-span-1">
          <OrderSummary cartItems={cartItems} cartTotal={cartTotal} />
        </div>
      </div>
    </div>
  );
} 