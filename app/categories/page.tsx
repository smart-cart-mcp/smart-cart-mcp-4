import { getCategories } from "@/lib/actions/productActions";
import Link from "next/link";

export const metadata = {
  title: "Categories | Smart Cart",
  description: "Browse all product categories at Smart Cart",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Product Categories</h1>
        <p className="text-muted-foreground">
          Browse our products by category to find exactly what you're looking for.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center p-12 border rounded-lg">
          <p className="text-muted-foreground">No categories available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group block p-6 border rounded-lg transition-all hover:shadow-md hover:border-primary"
            >
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 