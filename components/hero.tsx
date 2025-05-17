import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="relative py-16 md:py-24 bg-gradient-to-br from-background via-background to-background/80">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Shopping, Simplified.
            <span className="block text-primary">Your Personal Cart Concierge.</span>
          </h1>
          
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Tell us what you want, from anywhere online. We'll handle the rest – one cart, one checkout, zero hassle.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/categories">
              <Button size="lg" className="px-8">
                Explore Products
              </Button>
            </Link>
            
            <Link href="/sign-up">
              <Button size="lg" variant="outline" className="px-8">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-16" />
    </div>
  );
}
