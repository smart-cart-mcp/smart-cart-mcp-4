import { getFeaturedProducts } from "@/lib/actions/productActions";
import ProductCard from "./ProductCard";
import { Product } from "@/lib/database.types";

export default async function FeaturedProductsGrid() {
  const products = await getFeaturedProducts(6);
  // Type assertion to handle the categoryName property
  const productsWithCategory = products as (Product & { categoryName?: string | null })[];

  if (productsWithCategory.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No featured products available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {productsWithCategory.map((product) => (
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