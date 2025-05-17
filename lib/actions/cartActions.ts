"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Product } from "@/lib/database.types";

// Define cart item type with product details
export type CartItemDetail = {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  added_at: string;
  updated_at: string;
  product: Product & { categoryName?: string | null };
};

// Define cart item type with full product details for Stripe
export type CartItemWithProduct = {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  added_at: string;
  updated_at: string;
  products: Product & { categoryName?: string | null };
};

// Add a product to cart
export async function addToCart(
  productId: number,
  quantity: number = 1
): Promise<{ success: boolean; message: string; cartItemCount?: number }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    // Check if product is in stock
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("in_stock")
      .eq("id", productId)
      .single();

    if (productError || !product) {
      return { success: false, message: "Product not found" };
    }

    if (product.in_stock === false) {
      return { success: false, message: "Product is out of stock" };
    }

    // Check if the product is already in the cart
    const { data: existingItem, error: existingItemError } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (existingItemError && existingItemError.code !== "PGRST116") {
      console.error("Error checking existing cart item:", existingItemError);
      return { success: false, message: "Failed to check cart" };
    }

    // If item exists, update quantity
    if (existingItem) {
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingItem.id);

      if (updateError) {
        console.error("Error updating cart item:", updateError);
        return { success: false, message: "Failed to update cart" };
      }
    } else {
      // If item doesn't exist, insert new item
      const { error: insertError } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
          quantity: quantity,
        });

      if (insertError) {
        console.error("Error adding to cart:", insertError);
        return { success: false, message: "Failed to add to cart" };
      }
    }

    // Get updated cart count
    const cartItemCount = await getCartItemCount();
    
    // Revalidate the cart page and layout to update UI
    revalidatePath("/cart");
    revalidatePath("/");

    return { 
      success: true, 
      message: "Product added to cart", 
      cartItemCount 
    };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

// Get cart items with product details
export async function getCartItems(): Promise<CartItemDetail[]> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/sign-in");
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        product: products (
          *,
          categories (name)
        )
      `)
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart items:", error);
      return [];
    }

    // Transform the data to include categoryName at the product level
    return data.map((item: any) => ({
      ...item,
      product: {
        ...item.product,
        categoryName: item.product.categories?.name
      }
    }));
  } catch (error) {
    console.error("Get cart items error:", error);
    return [];
  }
}

// Get cart items with product details for a specific user
export async function getCartItemsWithProductDetails(userId: string): Promise<{ 
  data?: CartItemWithProduct[]; 
  error?: string 
}> {
  try {
    const supabase = await createClient();
    
    if (!userId) {
      return { error: "User ID is required" };
    }

    const { data, error } = await supabase
      .from("cart_items")
      .select(`
        *,
        products:products (
          *,
          categories (name)
        )
      `)
      .eq("user_id", userId)
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Error fetching cart items with products:", error);
      return { error: "Failed to fetch cart items" };
    }

    if (!data || data.length === 0) {
      return { data: [] };
    }

    // Transform the data to include categoryName at the product level
    const transformedData = data.map((item: any) => ({
      ...item,
      products: {
        ...item.products,
        categoryName: item.products.categories?.name
      }
    }));

    return { data: transformedData };
  } catch (error) {
    console.error("Get cart items with products error:", error);
    return { error: "An unexpected error occurred" };
  }
}

// Get cart item count
export async function getCartItemCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return 0;
    }

    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error getting cart count:", error);
      return 0;
    }

    return count || 0;
  } catch (error) {
    console.error("Get cart count error:", error);
    return 0;
  }
}

// Update cart item quantity
export async function updateCartItemQuantity(
  cartItemId: number,
  newQuantity: number
): Promise<{ success: boolean; message: string }> {
  try {
    if (newQuantity < 1) {
      return removeCartItem(cartItemId);
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    // Verify the cart item belongs to the user
    const { data: cartItem, error: checkError } = await supabase
      .from("cart_items")
      .select("user_id")
      .eq("id", cartItemId)
      .single();

    if (checkError || !cartItem) {
      return { success: false, message: "Cart item not found" };
    }

    if (cartItem.user_id !== user.id) {
      return { success: false, message: "Unauthorized" };
    }

    // Update quantity
    const { error: updateError } = await supabase
      .from("cart_items")
      .update({ 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq("id", cartItemId);

    if (updateError) {
      console.error("Error updating cart item:", updateError);
      return { success: false, message: "Failed to update cart" };
    }

    // Revalidate cart page to update UI
    revalidatePath("/cart");
    revalidatePath("/");

    return { success: true, message: "Cart updated" };
  } catch (error) {
    console.error("Update cart error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

// Remove item from cart
export async function removeCartItem(
  cartItemId: number
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "User not authenticated" };
    }

    // Verify the cart item belongs to the user
    const { data: cartItem, error: checkError } = await supabase
      .from("cart_items")
      .select("user_id")
      .eq("id", cartItemId)
      .single();

    if (checkError || !cartItem) {
      return { success: false, message: "Cart item not found" };
    }

    if (cartItem.user_id !== user.id) {
      return { success: false, message: "Unauthorized" };
    }

    // Delete the cart item
    const { error: deleteError } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);

    if (deleteError) {
      console.error("Error removing cart item:", deleteError);
      return { success: false, message: "Failed to remove from cart" };
    }

    // Revalidate cart page to update UI
    revalidatePath("/cart");
    revalidatePath("/");

    return { success: true, message: "Item removed from cart" };
  } catch (error) {
    console.error("Remove cart item error:", error);
    return { success: false, message: "An unexpected error occurred" };
  }
}

// Get cart total
export async function getCartTotal(): Promise<number> {
  try {
    const cartItems = await getCartItems();
    return cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
  } catch (error) {
    console.error("Get cart total error:", error);
    return 0;
  }
} 