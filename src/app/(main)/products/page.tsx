import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, ArrowUpDown } from 'lucide-react';

// Mock data - replace with actual data fetching
const products = [
  { id: '1', name: 'Elegant Evening Gown', price: 'GH₵ 250.00', imageUrl: 'https://placehold.co/600x800.png', category: 'Dresses', dataAiHint: 'evening gown' },
  { id: '2', name: 'Casual Summer Dress', price: 'GH₵ 120.00', imageUrl: 'https://placehold.co/600x800.png', category: 'Dresses', dataAiHint: 'summer dress' },
  { id: '3', name: 'Chic Office Blouse', price: 'GH₵ 90.00', imageUrl: 'https://placehold.co/600x800.png', category: 'Tops', dataAiHint: 'office blouse' },
  { id: '4', name: 'Silk Scarf Collection', price: 'GH₵ 75.00', imageUrl: 'https://placehold.co/600x800.png', category: 'Accessories', dataAiHint: 'silk scarf' },
  { id: '5', name: 'Denim Jeans', price: 'GH₵ 180.00', imageUrl: 'https://placehold.co/600x800.png', category: 'Bottoms', dataAiHint: 'denim jeans' },
  { id: '6', name: 'Leather Handbag', price: 'GH₵ 350.00', imageUrl: 'https://placehold.co/600x800.png', category: 'Accessories', dataAiHint: 'leather handbag' },
];

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-4xl font-semibold mb-2">Our Collection</h1>
        <p className="text-muted-foreground">Browse through our curated selection of fine clothing and accessories.</p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4 items-center p-4 border rounded-lg bg-card shadow">
        <div className="flex-grow w-full md:w-auto">
          <Input type="search" placeholder="Search products..." className="w-full" />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="dresses">Dresses</SelectItem>
              <SelectItem value="tops">Tops</SelectItem>
              <SelectItem value="bottoms">Bottoms</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
          <Select>
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <CardHeader className="p-0">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.imageUrl}
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
              <p className="text-primary font-semibold text-lg">{product.price}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href={`/products/${product.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination (Placeholder) */}
      <div className="flex justify-center mt-8">
        <Button variant="outline" className="mr-2">Previous</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
}
