import { getCategoryById, getProductsByCategoryId } from "@/lib/actions/productActions";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categoryId = parseInt(resolvedParams.categoryId);
  const category = await getCategoryById(categoryId);

  if (!category) {
    return {
      title: "Category Not Found | Smart Cart",
      description: "The requested category could not be found.",
    };
  }

  return {
    title: `${category.name} | Smart Cart`,
    description: category.description || `Browse our ${category.name} products at Smart Cart`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const categoryId = parseInt(resolvedParams.categoryId);
  const category = await getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const products = await getProductsByCategoryId(categoryId);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-6">
        <nav className="flex mb-4" aria-label="Breadcrumb">
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
            <li className="flex items-center">
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-foreground">
                {category.name}
              </span>
            </li>
          </ol>
        </nav>

        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground mb-6">
            {category.description}
          </p>
        )}
      </div>

      <ProductGrid products={products} />
    </div>
  );
} 