
'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Added CardHeader, CardTitle, CardFooter
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Plus, Minus, ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getProductById, getProducts } from '@/lib/product-service'; // Added getProducts
import type { Product } from '@/lib/types';

// Define the expected type for resolved params
type ResolvedParamsType = { id: string };
// Define the prop type, which could be the resolved type or a Promise of it
type ParamsPropType = ResolvedParamsType | Promise<ResolvedParamsType>;

// Custom hook to resolve params if they are a Promise
function useResolvedParams(paramsProp: ParamsPropType): ResolvedParamsType | null {
  if (typeof (paramsProp as Promise<ResolvedParamsType>)?.then === 'function') {
    return React.use(paramsProp as Promise<ResolvedParamsType>);
  }
  return paramsProp as ResolvedParamsType;
}

export default function ProductDetailPage({ params: paramsPropInput }: { params: ParamsPropType }) {
  const params = useResolvedParams(paramsPropInput);

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductData = async () => {
      if (params && typeof params.id === 'string') {
        setIsLoading(true);
        setIsLoadingRelated(true);
        try {
          const fetchedProduct = await getProductById(params.id);
          if (fetchedProduct && fetchedProduct.status === 'Active') {
            setProduct(fetchedProduct);
            setSelectedImage(fetchedProduct.imageUrls[0] || 'https://placehold.co/800x1200.png');

            // Fetch related products
            const allProducts = await getProducts();
            const related = allProducts
              .filter(
                (p) =>
                  p.category === fetchedProduct.category &&
                  p.id !== fetchedProduct.id &&
                  p.status === 'Active'
              )
              .slice(0, 4); // Get up to 4 related products
            setRelatedProducts(related);

          } else {
            setProduct(null);
            setRelatedProducts([]);
          }
        } catch (error) {
          console.error("Failed to fetch product data in ProductDetailPage:", error);
          setProduct(null);
          setRelatedProducts([]);
        } finally {
          setIsLoading(false);
          setIsLoadingRelated(false);
        }
      } else {
        setProduct(null);
        setRelatedProducts([]);
        setIsLoading(false);
        setIsLoadingRelated(false);
      }
    };

    fetchProductData();
  }, [params]);

  const handleThumbnailClick = (url: string) => {
    setSelectedImage(url);
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, prev + change));
  };

  if (isLoading && !product) {
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
            priority
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
        <h2 className="font-headline text-2xl font-semibold mb-6">You Might Also Like</h2>
        {isLoadingRelated ? (
          <p>Loading related products...</p>
        ) : relatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  <Link href={`/products/${relatedProduct.id}`}>
                    <Image
                      src={relatedProduct.imageUrls[0] || 'https://placehold.co/600x800.png'}
                      alt={relatedProduct.name}
                      width={600}
                      height={800}
                      className="object-cover w-full h-80" // Adjusted height for consistency
                      data-ai-hint={relatedProduct.dataAiHint}
                    />
                  </Link>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-md font-medium mb-1 font-body">
                    <Link href={`/products/${relatedProduct.id}`}>{relatedProduct.name}</Link>
                  </CardTitle>
                  <p className="text-primary font-semibold text-lg">GH₵ {relatedProduct.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href={`/products/${relatedProduct.id}`}>View Product</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No related products found in this category.</p>
        )}
      </div>
    </div>
  );
}
