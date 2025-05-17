"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToCart } from "@/lib/actions/cartActions";
import { Minus, Plus, ShoppingCart, CheckCircle2 } from "lucide-react";

interface AddToCartFormProps {
  productId: number;
  inStock: boolean;
}

export default function AddToCartForm({ productId, inStock }: AddToCartFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(false);

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity(0);
    }
  };

  const handleAddToCart = () => {
    if (quantity <= 0 || !inStock) return;

    startTransition(async () => {
      const result = await addToCart(productId, quantity);
      if (result.success) {
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 2000);
      }
    });
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center border rounded-md">
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            onClick={decrementQuantity}
            disabled={quantity <= 1 || isPending}
          >
            <Minus className="h-4 w-4" />
            <span className="sr-only">Decrease quantity</span>
          </Button>
          
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-16 h-10 text-center border-0"
            disabled={isPending}
          />
          
          <Button 
            type="button"
            variant="ghost" 
            size="icon" 
            onClick={incrementQuantity}
            disabled={isPending}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Increase quantity</span>
          </Button>
        </div>
        
        <Button 
          onClick={handleAddToCart}
          disabled={isPending || isAdded || !inStock}
          size="lg" 
          className={isAdded ? "bg-green-600 hover:bg-green-700 w-full md:w-auto" : "w-full md:w-auto"}
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              Adding to Cart...
            </span>
          ) : isAdded ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Added to Cart
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </span>
          )}
        </Button>
      </div>
      
      {!inStock && (
        <p className="text-red-500 text-sm">
          This product is currently out of stock.
        </p>
      )}
    </div>
  );
} 