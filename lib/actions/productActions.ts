import { createClient } from "@/utils/supabase/server";
import { Category, Product } from "@/lib/database.types";
import { notFound } from "next/navigation";

// Get all categories
export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data;
}

// Get featured products for homepage
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }

  // Transform the data to include categoryName at the top level
  return data.map((product) => ({
    ...product,
    categoryName: product.categories?.name,
  }));
}

// Get products by category ID
export async function getProductsByCategoryId(categoryId: number): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }

  return data.map((product) => ({
    ...product,
    categoryName: product.categories?.name,
  }));
}

// Get category by ID
export async function getCategoryById(categoryId: number): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", categoryId)
    .single();

  if (error) {
    console.error("Error fetching category by ID:", error);
    return null;
  }

  return data;
}

// Get product by ID
export async function getProductById(productId: number): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("id", productId)
    .single();

  if (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }

  // Type assertion to include the categoryName property
  return {
    ...data,
    categoryName: data.categories?.name,
  } as Product;
} 