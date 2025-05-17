'use client';

import Image from 'next/image';
import { CartItemWithProduct } from '@/lib/types/checkout';
import { ShippingAddress } from '@/lib/types/checkout';

interface OrderReviewFinalProps {
  cartItems: CartItemWithProduct[];
  shippingAddress?: ShippingAddress | null;
  subtotal: number;
  shippingHandlingFee: number;
  totalAmount: number;
}

export function OrderReviewFinal({
  cartItems,
  shippingAddress,
  subtotal,
  shippingHandlingFee,
  totalAmount,
}: OrderReviewFinalProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="p-6 border rounded-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      {cartItems.map(item => (
        <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
          <div className="flex items-center">
            {item.product.image_url && (
              <Image 
                src={item.product.image_url} 
                alt={item.product.name || 'Product image'} 
                width={40} 
                height={40} 
                className="rounded mr-3" 
              />
            )}
            <div>
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
            </div>
          </div>
          <p>{formatCurrency((item.product.price || 0) * (item.quantity || 0))}</p>
        </div>
      ))}
      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between">
          <p>Subtotal:</p>
          <p>{formatCurrency(subtotal)}</p>
        </div>
        <div className="flex justify-between">
          <p>Shipping & Handling (20%):</p>
          <p>{formatCurrency(shippingHandlingFee)}</p>
        </div>
        <div className="flex justify-between font-bold text-lg mt-2">
          <p>Total:</p>
          <p>{formatCurrency(totalAmount)}</p>
        </div>
      </div>

      {shippingAddress && (
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-lg font-semibold mb-2">Shipping To:</h3>
          <p>{shippingAddress.fullName}</p>
          <p>{shippingAddress.addressLine1}</p>
          {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
          <p>{shippingAddress.city}, {shippingAddress.stateOrProvince} {shippingAddress.postalCode}</p>
          <p>{shippingAddress.country}</p>
          {shippingAddress.phoneNumber && <p>Phone: {shippingAddress.phoneNumber}</p>}
        </div>
      )}
    </div>
  );
} 