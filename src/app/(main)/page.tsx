
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/product-service';
import type { Product } from '@/lib/types';
import { subscribeToNewsletter } from '@/lib/newsletter-service';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input'; // Added Input for newsletter

const categories = [
  { id: '1', name: 'Dresses', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'dress collection' },
  { id: '2', name: 'Tops', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'top clothing' },
  { id: '3', name: 'Accessories', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'fashion accessories' },
];

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      const allProducts = await getProducts();
      // Select first 3 active products as featured, or implement more complex logic
      setFeaturedProducts(allProducts.filter(p => p.status === 'Active').slice(0, 3));
      setIsLoading(false);
    };
    fetchFeaturedProducts();
  }, []);

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newsletterEmail) {
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    setIsSubscribing(true);
    const result = await subscribeToNewsletter(newsletterEmail);
    if (result.success) {
      toast({ title: "Subscribed!", description: result.message });
      setNewsletterEmail('');
    } else {
      toast({ title: "Subscription Failed", description: result.message, variant: "destructive" });
    }
    setIsSubscribing(false);
  };

  return (
    <div className="space-y-12">
      <section className="bg-gradient-to-r from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 rounded-lg p-8 md:p-16 text-center shadow-lg">
        <h1 className="font-headline text-4xl md:text-6xl font-bold text-primary mb-4">
          Discover Your Style
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 mb-8 max-w-2xl mx-auto">
          Explore the latest trends and timeless classics at St.Us Collections. Quality fashion for every occasion.
        </p>
        <Button size="lg" asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
          <Link href="/products">
            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>

      <section>
        <h2 className="font-headline text-3xl font-semibold mb-6 text-center">Featured Products</h2>
        {isLoading ? (
          <p className="text-center">Loading featured products...</p>
        ) : featuredProducts.length === 0 ? (
          <p className="text-center text-muted-foreground">No featured products available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <Link href={`/products/${product.id}`}>
                    <Image
                      src={product.imageUrls[0] || 'https://placehold.co/600x800.png'}
                      alt={product.name}
                      width={600}
                      height={800}
                      className="object-cover w-full h-96"
                      data-ai-hint={product.dataAiHint}
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg font-medium mb-1 font-body">
                    <Link href={`/products/${product.id}`}>{product.name}</Link>
                  </CardTitle>
                  <p className="text-primary font-semibold">GH₵ {product.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href={`/products/${product.id}`}>View Product</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="font-headline text-3xl font-semibold mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.name.toLowerCase()}`}>
              <Card className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={400}
                  height={300}
                  className="object-cover w-full h-64 transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={category.dataAiHint}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <h3 className="font-headline text-2xl font-semibold text-white">{category.name}</h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-lg p-8 text-center shadow-sm">
        <h2 className="font-headline text-2xl font-semibold mb-3">Join Our Community</h2>
        <p className="text-foreground/70 mb-6">
          Sign up for our newsletter to get the latest updates on new arrivals and exclusive offers.
        </p>
        <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            className="flex-grow p-3 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none bg-background"
            aria-label="Email for newsletter"
            disabled={isSubscribing}
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubscribing}>
            {isSubscribing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Subscribe
          </Button>
        </form>
      </section>
    </div>
  );
}
