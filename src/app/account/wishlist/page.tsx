
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';

// Mock wishlist items
const wishlistItems = [
  { id: 'prod1', name: 'Bohemian Maxi Dress', price: 180.00, imageUrl: 'https://placehold.co/300x450.png', dataAiHint: 'bohemian dress' },
  { id: 'prod2', name: 'Vintage Leather Jacket', price: 450.00, imageUrl: 'https://placehold.co/300x450.png', dataAiHint: 'leather jacket' },
];

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-semibold">My Wishlist</h1>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-lg">
              <CardHeader className="p-0">
                <Link href={`/products/${item.id}`}>
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={300}
                    height={450}
                    className="object-cover w-full h-72"
                    data-ai-hint={item.dataAiHint}
                  />
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-medium mb-1 font-body">
                  <Link href={`/products/${item.id}`}>{item.name}</Link>
                </CardTitle>
                <p className="text-primary font-semibold text-xl">GH₵ {item.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex flex-col sm:flex-row gap-2">
                <Button className="w-full sm:flex-1 bg-accent hover:bg-accent/90 text-accent-foreground" disabled>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart (Soon)
                </Button>
                <Button variant="outline" size="icon" className="w-full sm:w-auto" disabled>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove from wishlist</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12 shadow-lg">
          <CardContent>
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="font-headline text-2xl font-semibold mb-2">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mb-6">
              Add items you love to your wishlist to save them for later.
            </p>
            <Button asChild>
              <Link href="/products">Explore Products</Link>
            </Button>
          </CardContent>
        </Card>
      )}
       <p className="text-xs text-muted-foreground text-center">Wishlist functionality is currently under development. This page uses mock data.</p>
    </div>
  );
}
