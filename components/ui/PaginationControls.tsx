'use client';

import Link from 'next/link';
import { Button } from './button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationControlsProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  basePath: string;
}

export default function PaginationControls({
  currentPage,
  totalItems,
  itemsPerPage,
  basePath,
}: PaginationControlsProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // No pagination needed if only one page
  if (totalPages <= 1) return null;
  
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < totalPages;

  return (
    <div className="flex items-center justify-between border-t border-border bg-background px-4 py-3 sm:px-6 mt-8">
      <div className="flex flex-1 justify-between sm:hidden">
        {/* Mobile view - simplified prev/next buttons */}
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage}
          asChild={hasPreviousPage}
        >
          {hasPreviousPage ? (
            <Link href={`${basePath}?page=${currentPage - 1}`}>Previous</Link>
          ) : (
            <span>Previous</span>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          asChild={hasNextPage}
        >
          {hasNextPage ? (
            <Link href={`${basePath}?page=${currentPage + 1}`}>Next</Link>
          ) : (
            <span>Next</span>
          )}
        </Button>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* Desktop view - page indicators and navigation */}
        <div>
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
            <span className="font-medium">{totalItems}</span> results
          </p>
        </div>
        
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            {/* Previous page */}
            {hasPreviousPage ? (
              <Link
                href={`${basePath}?page=${currentPage - 1}`}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-accent"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border opacity-50 cursor-not-allowed"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
            
            {/* Current page indicator */}
            <span
              aria-current="page"
              className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {currentPage}
            </span>
            
            {/* Next page */}
            {hasNextPage ? (
              <Link
                href={`${basePath}?page=${currentPage + 1}`}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-accent"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border opacity-50 cursor-not-allowed"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
} 