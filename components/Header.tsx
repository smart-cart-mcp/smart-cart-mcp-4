import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import HeaderAuth from "./header-auth";
import { ShoppingCart } from "lucide-react";
import { Badge } from "./ui/badge";

export default function Header() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5">
        <div className="flex gap-5 items-center">
          <Link href="/" className="text-xl font-bold">Smart Cart</Link>
          <div className="hidden md:flex gap-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <Link href="/categories" className="hover:text-primary">Categories</Link>
          </div>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <Input 
            type="search" 
            placeholder="Search products..." 
            className="w-full"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="h-6 w-6" />
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0">
              0
            </Badge>
          </Link>
          <HeaderAuth />
        </div>
      </div>
    </nav>
  );
} 