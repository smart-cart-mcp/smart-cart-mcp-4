import { CartItemDetail } from "@/lib/actions/cartActions";
import CartItem from "./CartItem";

interface CartItemsListProps {
  cartItems: CartItemDetail[];
}

export default function CartItemsList({ cartItems }: CartItemsListProps) {
  return (
    <div className="bg-card rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">Cart Items</h2>
      
      <div className="divide-y">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
} 