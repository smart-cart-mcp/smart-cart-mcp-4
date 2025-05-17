"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addToCart } from "@/lib/actions/cartActions";
import { useState, useTransition } from "react";
import { ShoppingCart, CheckCircle2 } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  categoryName?: string | null;
  inStock?: boolean | null;
}

export default function ProductCard({ id, name, price, imageUrl, categoryName, inStock = true }: ProductCardProps) {
  const [isPending, startTransition] = useTransition();
  const [isAdded, setIsAdded] = useState(false);

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

  // Handle add to cart
  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addToCart(id, 1);
      if (result.success) {
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 2000);
      }
    });
  };

  return (
    <div className="group rounded-lg border border-border overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full bg-secondary">
        {imageUrl ? (
          <Image
            src={imageUrl}
            fill
            alt={name}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No image available
          </div>
        )}
      </div>
      
      <div className="p-4">
        {categoryName && (
          <Badge variant="secondary" className="mb-2">
            {categoryName}
          </Badge>
        )}
        
        <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
        
        <div className="mt-2 flex items-center justify-between">
          <p className="font-bold text-lg">{formattedPrice}</p>
          <div className="flex gap-2">
            <Link href={`/products/${id}`}>
              <Button size="sm" variant="outline">View Details</Button>
            </Link>
            
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              disabled={isPending || isAdded || !inStock}
              className={isAdded ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {isPending ? (
                <span className="flex items-center gap-1">
                  Adding...
                </span>
              ) : isAdded ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  Added
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  Add
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 