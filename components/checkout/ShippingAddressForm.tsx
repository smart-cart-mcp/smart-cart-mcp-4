"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/form-message";
import { ShippingAddress } from "@/lib/types/checkout";

// Form validation schema
const addressSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }),
  addressLine1: z.string().min(5, { message: "Address line 1 is required." }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City is required." }),
  stateOrProvince: z.string().min(2, { message: "State/Province is required." }),
  postalCode: z.string().min(3, { message: "Postal code is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  phoneNumber: z.string().optional(),
});

interface ShippingAddressFormProps {
  onSubmitAddress: (data: ShippingAddress) => void;
  isSubmitting: boolean;
}

export function ShippingAddressForm({ onSubmitAddress, isSubmitting }: ShippingAddressFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ShippingAddress>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "USA",
    }
  });

  const [formError, setFormError] = useState<string | null>(null);

  const processSubmit = (data: ShippingAddress) => {
    setFormError(null);
    onSubmitAddress(data);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 mt-6 p-6 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
      
      {formError && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">
          {formError}
        </div>
      )}
      
      {/* Full Name */}
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" {...register("fullName")} />
        {errors.fullName && (
          <FormMessage message={{ error: errors.fullName.message! }} />
        )}
      </div>
      
      {/* Address Line 1 */}
      <div>
        <Label htmlFor="addressLine1">Address Line 1</Label>
        <Input id="addressLine1" {...register("addressLine1")} />
        {errors.addressLine1 && (
          <FormMessage message={{ error: errors.addressLine1.message! }} />
        )}
      </div>
      
      {/* Address Line 2 */}
      <div>
        <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
        <Input id="addressLine2" {...register("addressLine2")} />
      </div>
      
      {/* City */}
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register("city")} />
        {errors.city && (
          <FormMessage message={{ error: errors.city.message! }} />
        )}
      </div>
      
      {/* State/Province */}
      <div>
        <Label htmlFor="stateOrProvince">State / Province</Label>
        <Input id="stateOrProvince" {...register("stateOrProvince")} />
        {errors.stateOrProvince && (
          <FormMessage message={{ error: errors.stateOrProvince.message! }} />
        )}
      </div>
      
      {/* Postal Code */}
      <div>
        <Label htmlFor="postalCode">Postal Code</Label>
        <Input id="postalCode" {...register("postalCode")} />
        {errors.postalCode && (
          <FormMessage type="error" message={errors.postalCode.message!} />
        )}
      </div>
      
      {/* Country */}
      <div>
        <Label htmlFor="country">Country</Label>
        <Input id="country" {...register("country")} defaultValue="USA" />
        {errors.country && (
          <FormMessage type="error" message={errors.country.message!} />
        )}
      </div>
      
      {/* Phone Number */}
      <div>
        <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
        <Input id="phoneNumber" type="tel" {...register("phoneNumber")} />
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Continue to Payment"}
      </Button>
    </form>
  );
} 