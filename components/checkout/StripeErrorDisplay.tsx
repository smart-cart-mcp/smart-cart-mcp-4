'use client';

import Link from 'next/link';

interface StripeErrorDisplayProps {
  title: string;
  message: string;
  supportContext?: string;
}

export function StripeErrorDisplay({ title, message, supportContext }: StripeErrorDisplayProps) {
  return (
    <div className="container mx-auto p-8 text-center max-w-md">
      <h1 className="text-2xl font-bold text-red-600 mb-4">{title}</h1>
      <p className="text-gray-700 mb-4">{message}</p>
      
      {supportContext && (
        <p className="text-sm text-gray-500 mb-6">Context: {supportContext}</p>
      )}
      
      <div className="flex justify-center gap-4 mt-8">
        <Link 
          href="/cart" 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Return to Cart
        </Link>
        
        <Link 
          href="/" 
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
} 