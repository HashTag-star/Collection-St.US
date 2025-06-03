import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

// Mock data - replace with actual data fetching
const featuredProducts = [
  { id: '1', name: 'Elegant Evening Gown', price: 'GH₵ 250.00', imageUrl: 'https://placehold.co/600x800.png', dataAiHint: 'evening gown' },
  { id: '2', name: 'Casual Summer Dress', price: 'GH₵ 120.00', imageUrl: 'https://placehold.co/600x800.png', dataAiHint: 'summer dress' },
  { id: '3', name: 'Chic Office Blouse', price: 'GH₵ 90.00', imageUrl: 'https://placehold.co/600x800.png', dataAiHint: 'office blouse' },
];

const categories = [
  { id: '1', name: 'Dresses', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'dress collection' },
  { id: '2', name: 'Tops', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'top clothing' },
  { id: '3', name: 'Accessories', imageUrl: 'https://placehold.co/400x300.png', dataAiHint: 'fashion accessories' },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
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

      {/* Featured Products Section */}
      <section>
        <h2 className="font-headline text-3xl font-semibold mb-6 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.imageUrl}
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
                <p className="text-primary font-semibold">{product.price}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href={`/products/${product.id}`}>View Product</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Section */}
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

      {/* Call to Action Section */}
      <section className="bg-card border border-border rounded-lg p-8 text-center shadow-sm">
        <h2 className="font-headline text-2xl font-semibold mb-3">Join Our Community</h2>
        <p className="text-foreground/70 mb-6">
          Sign up for our newsletter to get the latest updates on new arrivals and exclusive offers.
        </p>
        <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow p-3 border border-input rounded-md focus:ring-2 focus:ring-primary outline-none"
            aria-label="Email for newsletter"
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">Subscribe</Button>
        </form>
      </section>
    </div>
  );
}
