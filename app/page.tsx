import Hero from "@/components/hero";
import FeaturedProductsGrid from "@/components/product/FeaturedProductsGrid";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";

export default async function Home() {
  return (
    <>
      <Hero />
      
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Featured Finds</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our curated selection of top products picked just for you.
          </p>
        </div>
        
        <FeaturedProductsGrid />
        
        <div className="mt-12 text-center">
          <a href="/categories" className="text-primary hover:underline font-medium">
            View all products →
          </a>
        </div>
      </section>
      
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-primary text-4xl font-bold mb-4">1.</div>
              <h3 className="text-xl font-semibold mb-2">Browse Products</h3>
              <p className="text-muted-foreground">Explore our curated collection of quality products.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-primary text-4xl font-bold mb-4">2.</div>
              <h3 className="text-xl font-semibold mb-2">Add to Cart</h3>
              <p className="text-muted-foreground">Select your favorites from any online store.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-primary text-4xl font-bold mb-4">3.</div>
              <h3 className="text-xl font-semibold mb-2">We Deliver</h3>
              <p className="text-muted-foreground">Checkout once and we'll handle the rest.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
