
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { getProductById, updateProduct, type UpdateProductData } from '@/lib/product-service';
import type { Product } from '@/lib/types';

// Define the expected type for resolved params
type ResolvedParamsType = { id: string };
// Define the prop type, which could be the resolved type or a Promise of it
type ParamsPropType = ResolvedParamsType | Promise<ResolvedParamsType>;

// Custom hook to resolve params if they are a Promise
function useResolvedParams(paramsProp: ParamsPropType): ResolvedParamsType | null {
  if (typeof (paramsProp as Promise<ResolvedParamsType>)?.then === 'function') {
    // This will suspend if paramsProp is a promise
    // Note: React.use can only be called from Server Components or inside another hook.
    // For client components, this hook needs to be structured carefully.
    // If paramsProp is indeed a promise, this line will cause the component to suspend.
    try {
      return React.use(paramsProp as Promise<ResolvedParamsType>);
    } catch (e) {
      // If React.use throws (e.g. promise rejected), rethrow to be caught by error boundary
      // or handle appropriately if it's the special "Suspense Exception".
      // For now, we assume if it's a promise it will resolve or suspend.
      // If this hook is ONLY called in a client component, direct promise access will be an issue.
      // A common pattern is to resolve the promise in an effect or pass resolved params.
      // Given the error message from the user previously, this approach for `React.use` should be outside try/catch.
      // Let's refine this.
      // The `use` hook should not be in a try/catch block for its specific suspense behavior.
      return React.use(paramsProp as Promise<ResolvedParamsType>);
    }
  }
  return paramsProp as ResolvedParamsType;
}


export default function EditProductPage({ params: paramsPropInput }: { params: ParamsPropType }) {
  const params = useResolvedParams(paramsPropInput);
  const router = useRouter();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Active' | 'Draft'>('Draft');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (params?.id) {
        setIsLoading(true);
        const fetchedProduct = await getProductById(params.id);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
          setProductName(fetchedProduct.name);
          setPrice(fetchedProduct.price.toString());
          setCategory(fetchedProduct.category);
          setStock(fetchedProduct.stock.toString());
          setDescription(fetchedProduct.description);
          setStatus(fetchedProduct.status);
        } else {
          toast({ title: "Error", description: "Product not found.", variant: "destructive" });
          router.push('/admin/products');
        }
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params, router, toast]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!params?.id) return;
    setIsSaving(true);

    const productUpdates: UpdateProductData = {
      name: productName,
      price: parseFloat(price),
      category,
      stock: parseInt(stock, 10),
      description,
      status,
    };

    const updatedProduct = await updateProduct(params.id, productUpdates);

    if (updatedProduct) {
      toast({
        title: "Product Updated!",
        description: `${updatedProduct.name} has been updated.`,
      });
      router.refresh(); // Refreshes data for the current route
      router.push('/admin/products');
    } else {
      toast({
        title: "Error",
        description: "Could not update product. Please try again.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return <p>Product not found or an error occurred.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Products</span>
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-semibold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Product Details</CardTitle>
            <CardDescription>Update the product information below.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                disabled={isSaving}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (GH₵)</Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  step="0.01"
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  disabled={isSaving}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  disabled={isSaving}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as 'Active' | 'Draft')} disabled={isSaving}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Product Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                required
                disabled={isSaving}
              />
            </div>
            {/* Image editing is not part of this step for simplicity */}
            <CardDescription className="text-xs">Current product images will be retained. Image editing is not available in this form.</CardDescription>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
