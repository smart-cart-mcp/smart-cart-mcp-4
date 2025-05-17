import { getProductById } from "@/lib/actions/productActions";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Product } from "@/lib/database.types";
import AddToCartForm from "@/components/cart/AddToCartForm";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.productId);
  const product = await getProductById(productId);

  if (!product) {
    return {
      title: "Product Not Found | Smart Cart",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Smart Cart`,
    description: product.description || `${product.name} available at Smart Cart`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const productId = parseInt(resolvedParams.productId);
  const product = await getProductById(productId);

  if (!product) {
    notFound();
  }
  
  // Add type assertion to include categoryName property
  const productWithCategory = product as Product & { categoryName?: string | null };

  // Format price as currency
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(productWithCategory.price);

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <span className="mx-2 text-muted-foreground">/</span>
            <Link href="/categories" className="text-muted-foreground hover:text-foreground">
              Categories
            </Link>
          </li>
          {productWithCategory.category_id && (
            <li className="flex items-center">
              <span className="mx-2 text-muted-foreground">/</span>
              <Link 
                href={`/categories/${productWithCategory.category_id}`}
                className="text-muted-foreground hover:text-foreground"
              >
                {productWithCategory.categoryName}
              </Link>
            </li>
          )}
          <li className="flex items-center">
            <span className="mx-2 text-muted-foreground">/</span>
            <span className="text-foreground line-clamp-1">
              {productWithCategory.name}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative h-96 md:h-[500px] bg-secondary rounded-lg overflow-hidden">
          {productWithCategory.image_url ? (
            <Image
              src={productWithCategory.image_url}
              fill
              alt={productWithCategory.name}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No image available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{productWithCategory.name}</h1>
          {productWithCategory.categoryName && (
            <div className="mb-4">
              <Link 
                href={`/categories/${productWithCategory.category_id}`}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {productWithCategory.categoryName}
              </Link>
            </div>
          )}
          
          <div className="text-2xl font-bold mb-6">{formattedPrice}</div>
          
          {productWithCategory.description && (
            <div className="prose mb-8 max-w-none">
              <p>{productWithCategory.description}</p>
            </div>
          )}
          
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <span className="font-medium mr-2">Availability:</span>
              <span className={productWithCategory.in_stock ? "text-green-600" : "text-red-600"}>
                {productWithCategory.in_stock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            
            {productWithCategory.external_link && (
              <div className="flex items-center mb-2">
                <span className="font-medium mr-2">External Link:</span>
                <a 
                  href={productWithCategory.external_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Original
                </a>
              </div>
            )}
          </div>
          
          <AddToCartForm 
            productId={productWithCategory.id} 
            inStock={productWithCategory.in_stock || false} 
          />
        </div>
      </div>
    </div>
  );
} 