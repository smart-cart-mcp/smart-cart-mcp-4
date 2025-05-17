import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About Us | Smart Cart",
  description: "Learn about Smart Cart's mission to revolutionize online shopping",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Hero Section */}
      <div className="relative w-full h-72 mb-8 rounded-lg overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/30 z-10 flex items-center">
          <div className="px-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Shopping, Reimagined.
            </h1>
            <p className="text-white text-xl max-w-md">
              Your personal shopping concierge in a world of endless choices.
            </p>
          </div>
        </div>
        <Image 
          src="/images/about-hero.jpg" 
          alt="Smart Cart shopping experience" 
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Main Content */}
      <div className="space-y-10">
        <section>
          <h2 className="text-3xl font-bold mb-4">Tired of the Tab Chaos? So Were We.</h2>
          <p className="text-lg text-muted-foreground mb-4">
            In a world brimming with endless choices and a million digital storefronts, online shopping had somehow become… a chore. We've all been there: countless browser tabs open, forgotten wishlists scattered across the web, the mental gymnastics of comparing prices and features, and the repetitive slog of multiple checkouts. It was a digital maze that left us feeling more overwhelmed than overjoyed.
          </p>
          <p className="text-lg font-medium">
            We asked ourselves: <span className="text-primary">What if shopping online could be as intelligent, intuitive, and integrated as the best parts of our digital lives?</span>
          </p>
          <p className="text-lg mt-2">
            That question was the spark for Smart Cart.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Our Mission: To Give You Back Your Time and Joy in Shopping.</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Smart Cart was born from a simple belief: technology should simplify, not complicate. We envisioned a world where finding what you need, discovering new favorites, and making purchases is seamless, personalized, and even a little bit magical.
          </p>
          <p className="text-lg text-muted-foreground">
            We're a team of innovators, technologists, and, at our core, shoppers just like you. We're passionate about leveraging the power of artificial intelligence and thoughtful design to cut through the noise. Our goal isn't just to build another shopping app; it's to create your <span className="font-semibold">personal shopping concierge</span> – an intelligent assistant that understands your needs, anticipates your desires, and handles the heavy lifting so you can focus on the delight of discovery and the satisfaction of a smart purchase.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">How We're Different: Intelligence Meets Simplicity.</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Smart Cart is more than just a universal basket. It's a predictive purchasing companion. By integrating with leading AI models like ChatGPT, Gemini, Claude, and others, we're building an experience that learns your preferences, understands context, and proactively suggests relevant products from across the web.
          </p>
          
          <div className="pl-6 border-l-4 border-primary space-y-4 mb-6">
            <p className="text-lg">
              <span className="font-semibold">Imagine:</span> Describing what you're looking for in natural language, and Smart Cart not only finds it but also suggests complementary items or better alternatives you hadn't considered.
            </p>
            <p className="text-lg">
              <span className="font-semibold">Picture:</span> Your recurring purchases anticipated and queued up before you even think about them.
            </p>
            <p className="text-lg">
              <span className="font-semibold">Envision:</span> A single, unified cart where items from various vendors live harmoniously, ready for a single, effortless checkout.
            </p>
          </div>
          
          <p className="text-lg text-muted-foreground">
            While the AI provides the predictive power, the foundation is built on a rock-solid, user-friendly platform that makes traditional e-commerce tasks – browsing, adding to cart, and checking out – smoother and faster than ever before.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">The Smart Cart Promise:</h2>
          <ul className="grid gap-4 md:grid-cols-2">
            <li className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">Effortless Discovery</h3>
              <p>Say goodbye to endless scrolling. We bring the right products to you.</p>
            </li>
            <li className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">Unified Control</h3>
              <p>Manage all your shopping intentions in one intuitive space.</p>
            </li>
            <li className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">Intelligent Assistance</h3>
              <p>Let AI take the guesswork out of finding what you truly want and need.</p>
            </li>
            <li className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-1">Time Reclaimed</h3>
              <p>Spend less time managing purchases and more time on what matters to you.</p>
            </li>
            <li className="bg-muted p-4 rounded-lg md:col-span-2">
              <h3 className="font-semibold text-lg mb-1">Constant Evolution</h3>
              <p>We are committed to continuous innovation, always seeking new ways to make your shopping experience smarter, faster, and more enjoyable.</p>
            </li>
          </ul>
        </section>

        <section className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4">Join Us on the Journey.</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            We're just at the beginning of revolutionizing how the world shops online. Smart Cart is more than a tool; it's a new paradigm. We invite you to experience the future of predictive purchasing and reclaim the joy and efficiency that smart technology can bring to your everyday life.
          </p>
          <p className="text-xl font-semibold mb-8">Welcome to smarter shopping. Welcome to Smart Cart.</p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg">Experience Smart Cart Today</Button>
            </Link>
            <Link href="/categories">
              <Button variant="outline" size="lg">Explore Our Products</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
} 