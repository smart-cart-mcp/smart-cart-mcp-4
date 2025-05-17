// Shipping address type definition
export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

// Cart item with product details for checkout
export type CartItemWithProduct = {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  added_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string | null;
    categoryName?: string | null;
  };
}; 