
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, ArrowUpDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/product-service';
import type { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOption, setSortOption] = useState('featured');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts.filter(p => p.status === 'Active')); // Only show active products
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const filteredAndSortedProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || product.category.toLowerCase() === categoryFilter.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest': // Requires a date field, for now sort by ID desc as a proxy
          return parseInt(b.id) - parseInt(a.id);
        case 'featured':
        default:
          return 0; // No specific featured sort logic for now, could use rating or manual flag
      }
    });
  
  const uniqueCategories = ['all', ...new Set(products.map(p => p.category))];


  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="font-headline text-4xl font-semibold mb-2">Our Collection</h1>
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-4xl font-semibold mb-2">Our Collection</h1>
        <p className="text-muted-foreground">Browse through our curated selection of fine clothing and accessories.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center p-4 border rounded-lg bg-card shadow">
        <div className="flex-grow w-full md:w-auto">
          <Input 
            type="search" 
            placeholder="Search products..." 
            className="w-full" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {uniqueCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="w-full md:w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedProducts.length === 0 && !isLoading && (
        <div className="text-center py-10">
          <p className="text-lg text-muted-foreground">No products match your criteria.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAndSortedProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="p-0">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.imageUrls[0] || `https://placehold.co/600x800.png`}
                  alt={product.name}
                  width={600}
                  height={800}
                  className="object-cover w-full h-80"
                  data-ai-hint={product.dataAiHint}
                />
              </Link>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
              <span className="text-xs text-muted-foreground uppercase">{product.category}</span>
              <CardTitle className="text-md font-medium mt-1 mb-1 font-body">
                <Link href={`/products/${product.id}`}>{product.name}</Link>
              </CardTitle>
              <p className="text-primary font-semibold text-lg">GH₵ {product.price.toFixed(2)}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={`/products/${product.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Basic Pagination (Placeholder - non-functional for now) */}
      {/* <div className="flex justify-center mt-8">
        <Button variant="outline" className="mr-2" disabled>Previous</Button>
        <Button variant="outline" disabled>Next</Button>
      </div> */}
    </div>
  );
}
