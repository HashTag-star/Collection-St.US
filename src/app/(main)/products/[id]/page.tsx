
'use client'; 

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card'; 
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Plus, Minus, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getProductById } from '@/lib/product-service';
import type { Product } from '@/lib/types';
import { Label } from '@/components/ui/label'; 
import { Input } from '@/components/ui/input';


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);


  useEffect(() => {
    const fetchProductData = async () => {
      if (params.id) {
        setIsLoading(true);
        const fetchedProduct = await getProductById(params.id);
        if (fetchedProduct && fetchedProduct.status === 'Active') {
          setProduct(fetchedProduct);
          setSelectedImage(fetchedProduct.imageUrls[0] || 'https://placehold.co/800x1200.png');
        } else {
          setProduct(null); // Product not found or not active
        }
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [params.id]);

  const handleThumbnailClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };


  if (isLoading) {
    return (
      <div className="space-y-8">
        <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-8 text-center py-10">
         <Button variant="outline" size="sm" asChild className="mb-4 inline-flex">
          <Link href="/products">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
        <h1 className="font-headline text-2xl">Product Not Found</h1>
        <p className="text-muted-foreground">The product you are looking for does not exist or is no longer available.</p>
      </div>
    );
  }
  
  const stockStatusText = product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock';
  const stockBadgeVariant = product.stock > 0 ? 'default' : 'destructive';


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
            src={selectedImage || product.imageUrls[0] || 'https://placehold.co/800x1200.png'}
            alt={product.name}
            width={800}
            height={1200}
            className="w-full rounded-lg shadow-lg object-cover aspect-[2/3]"
            data-ai-hint={product.dataAiHint}
            priority // Prioritize loading of the main product image
          />
          {product.imageUrls.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.imageUrls.slice(0,4).map((url, index) => (
                <button 
                  key={index} 
                  className={`border rounded-md overflow-hidden focus:ring-2 focus:ring-primary ${selectedImage === url ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => handleThumbnailClick(url)}
                >
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
          <Badge variant={stockBadgeVariant} className="capitalize bg-primary/10 text-primary border-primary/20">
            {stockStatusText} {product.stock > 0 ? `(${product.stock} left)`: ''}
          </Badge>
          <h1 className="font-headline text-4xl font-bold">{product.name}</h1>
          
          {product.rating && product.reviews && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating!) ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`} />
                ))}
              </div>
              <span className="text-muted-foreground text-sm">({product.reviews} reviews)</span>
            </div>
          )}

          <p className="text-3xl font-semibold text-primary">GH₵ {product.price.toFixed(2)}</p>
          
          <Separator />

          <p className="text-foreground/80 leading-relaxed">{product.description}</p>
          
          <Separator />
          
          <div className="flex items-center space-x-4">
            <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
            <div className="flex items-center border rounded-md">
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(-1)} disabled={quantity <=1}>
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                readOnly
                className="h-9 w-12 text-center border-0 focus-visible:ring-0"
              />
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={product.stock === 0}>
            <ShoppingCart className="mr-2 h-5 w-5" /> {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          <Card className="bg-muted/30">
            <CardContent className="p-4 text-sm space-y-2">
              <p><span className="font-semibold">Category:</span> {product.category}</p>
              <p><span className="font-semibold">Availability:</span> {stockStatusText}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-12"/>
      <div>
        <h2 className="font-headline text-2xl font-semibold mb-4">You Might Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => ( // Placeholder, replace with actual related products logic
            <Card key={i}>
              <Image src={`https://placehold.co/300x450.png?id=${i}`} alt="Related Product" width={300} height={450} className="rounded-t-lg object-cover" data-ai-hint="fashion clothing" />
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
