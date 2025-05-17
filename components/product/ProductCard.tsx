import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl?: string | null;
  categoryName?: string | null;
}

export default function ProductCard({ id, name, price, imageUrl, categoryName }: ProductCardProps) {
  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);

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
          <Link href={`/products/${id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 