"use client";

import { CartItemDetail, updateCartItemQuantity, removeCartItem } from "@/lib/actions/cartActions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Trash2, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useTransition } from "react";

interface CartItemProps {
  item: CartItemDetail;
}

export default function CartItem({ item }: CartItemProps) {
  const [isPending, startTransition] = useTransition();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isRemoving, setIsRemoving] = useState(false);

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(item.product.price);

  // Calculate subtotal
  const subtotal = item.product.price * quantity;
  const formattedSubtotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(subtotal);

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    startTransition(async () => {
      await updateCartItemQuantity(item.id, newQuantity);
    });
  };

  // Handle item removal
  const handleRemove = () => {
    setIsRemoving(true);
    startTransition(async () => {
      await removeCartItem(item.id);
    });
  };

  if (isRemoving) {
    return (
      <div className="py-6 animate-pulse bg-muted/20">
        <p className="text-center text-muted-foreground">Removing item...</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
        {/* Product Image */}
        <div className="relative h-20 w-20 bg-secondary rounded overflow-hidden flex-shrink-0">
          {item.product.image_url ? (
            <Image
              src={item.product.image_url}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
              No image
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-grow">
          <Link 
            href={`/products/${item.product_id}`}
            className="text-lg font-medium hover:underline"
          >
            {item.product.name}
          </Link>
          
          {item.product.categoryName && (
            <p className="text-sm text-muted-foreground">
              {item.product.categoryName}
            </p>
          )}
          
          <p className="text-sm mt-1">{formattedPrice}</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4 mt-2 sm:mt-0">
          <div className="flex items-center border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isPending}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="px-2 min-w-[40px] text-center">
              {isPending ? "..." : quantity}
            </span>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={isPending}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="w-20 text-right">
            {formattedSubtotal}
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
            onClick={handleRemove}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 