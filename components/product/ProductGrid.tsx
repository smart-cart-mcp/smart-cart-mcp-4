import { Product } from "@/lib/database.types";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: (Product & { categoryName?: string | null })[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No products found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          imageUrl={product.image_url}
          categoryName={product.categoryName}
        />
      ))}
    </div>
  );
} 