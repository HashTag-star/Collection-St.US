import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Plus, Minus, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Mock data - replace with actual data fetching
const getProductDetails = async (id: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  const products = [
    { id: '1', name: 'Elegant Evening Gown', price: 'GH₵ 250.00', imageUrls: ['https://placehold.co/800x1200.png', 'https://placehold.co/800x1200.png', 'https://placehold.co/800x1200.png'], description: 'A stunning full-length gown perfect for formal events. Made with high-quality silk and intricate lace details. Features a flattering A-line silhouette.', category: 'Dresses', rating: 4.5, reviews: 25, stock: 'In Stock', dataAiHint: 'evening gown details' },
    { id: '2', name: 'Casual Summer Dress', price: 'GH₵ 120.00', imageUrls: ['https://placehold.co/800x1200.png'], description: 'Light and airy summer dress, ideal for warm weather. Crafted from breathable cotton with a vibrant floral print.', category: 'Dresses', rating: 4.2, reviews: 18, stock: 'In Stock', dataAiHint: 'summer dress details' },
    { id: '3', name: 'Chic Office Blouse', price: 'GH₵ 90.00', imageUrls: ['https://placehold.co/800x1200.png'], description: 'A stylish and professional blouse for the modern working woman. Made from a comfortable, wrinkle-resistant fabric.', category: 'Tops', rating: 4.8, reviews: 30, stock: 'Low Stock', dataAiHint: 'office blouse details' },
  ];
  return products.find(p => p.id === id) || products[0]; // Fallback to first product if not found
};

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductDetails(params.id);

  return (
    <div className="space-y-8">
      <Button variant="outline" size="sm" asChild className="mb-4">
        <Link href="/products">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Product Images */}
        <div>
          <Image
            src={product.imageUrls[0]}
            alt={product.name}
            width={800}
            height={1200}
            className="w-full rounded-lg shadow-lg object-cover aspect-[2/3]"
            data-ai-hint={product.dataAiHint}
          />
          {/* Thumbnails (optional) */}
          {product.imageUrls.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.imageUrls.slice(0,4).map((url, index) => (
                <button key={index} className="border rounded-md overflow-hidden focus:ring-2 focus:ring-primary">
                  <Image
                    src={url}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    width={150}
                    height={225}
                    className="object-cover w-full h-full"
                    data-ai-hint={`${product.dataAiHint} thumbnail`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <Badge variant={product.stock === 'In Stock' ? 'default' : 'destructive'} className="capitalize bg-primary/10 text-primary border-primary/20">
            {product.stock}
          </Badge>
          <h1 className="font-headline text-4xl font-bold">{product.name}</h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
              ))}
            </div>
            <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
          </div>
          <p className="text-3xl font-semibold text-primary">{product.price}</p>
          
          <Separator />

          <p className="text-foreground/80 leading-relaxed">{product.description}</p>
          
          <Separator />
          
          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                defaultValue={1}
                min={1}
                className="h-9 w-12 text-center border-0 focus-visible:ring-0"
              />
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
          </Button>

          <Card className="bg-muted/30">
            <CardContent className="p-4 text-sm space-y-2">
              <p><span className="font-semibold">Category:</span> {product.category}</p>
              <p><span className="font-semibold">Availability:</span> {product.stock}</p>
              {/* Add more details like SKU, materials etc. */}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Products / Reviews Section (Placeholder) */}
      <Separator className="my-12"/>
      <div>
        <h2 className="font-headline text-2xl font-semibold mb-4">You Might Also Like</h2>
        {/* Placeholder for related products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <Image src="https://placehold.co/300x450.png" alt="Related Product" width={300} height={450} className="rounded-t-lg object-cover" data-ai-hint="fashion clothing" />
              <CardContent className="p-3">
                <h3 className="font-medium text-sm">Related Item {i+1}</h3>
                <p className="text-primary text-sm">GH₵ XX.XX</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper component, not used currently but can be for detailed styling
function Label({ children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { children: React.ReactNode }) {
  return (
    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>
      {children}
    </label>
  );
}
