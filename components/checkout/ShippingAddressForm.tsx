import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ShippingAddress = {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
};

export function ShippingAddressFormFields() {
  return (
    <div className="space-y-4 mt-6 p-6 border rounded-lg bg-card">
      <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="fullName" className="block text-sm font-medium">Full Name</Label>
          <Input 
            type="text" 
            name="fullName" 
            id="fullName" 
            required 
            className="mt-1 block w-full" 
          />
        </div>
        
        <div>
          <Label htmlFor="addressLine1" className="block text-sm font-medium">Address Line 1</Label>
          <Input 
            type="text" 
            name="addressLine1" 
            id="addressLine1" 
            required 
            className="mt-1 block w-full" 
            placeholder="Street address, P.O. box" 
          />
        </div>
        
        <div>
          <Label htmlFor="addressLine2" className="block text-sm font-medium">Address Line 2 (Optional)</Label>
          <Input 
            type="text" 
            name="addressLine2" 
            id="addressLine2" 
            className="mt-1 block w-full" 
            placeholder="Apartment, suite, unit, building, floor, etc." 
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city" className="block text-sm font-medium">City</Label>
            <Input 
              type="text" 
              name="city" 
              id="city" 
              required 
              className="mt-1 block w-full" 
            />
          </div>
          
          <div>
            <Label htmlFor="stateOrProvince" className="block text-sm font-medium">State / Province</Label>
            <Input 
              type="text" 
              name="stateOrProvince" 
              id="stateOrProvince" 
              required 
              className="mt-1 block w-full" 
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode" className="block text-sm font-medium">Postal Code</Label>
            <Input 
              type="text" 
              name="postalCode" 
              id="postalCode" 
              required 
              className="mt-1 block w-full" 
            />
          </div>
          
          <div>
            <Label htmlFor="country" className="block text-sm font-medium">Country</Label>
            <Input 
              type="text" 
              name="country" 
              id="country" 
              required 
              className="mt-1 block w-full" 
              defaultValue="US" 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="phoneNumber" className="block text-sm font-medium">Phone Number (Optional)</Label>
          <Input 
            type="tel" 
            name="phoneNumber" 
            id="phoneNumber" 
            className="mt-1 block w-full" 
            placeholder="For delivery questions" 
          />
        </div>
      </div>
    </div>
  );
} 