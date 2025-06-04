
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProductImageUploadForm } from '@/components/products/ProductImageUploadForm';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast";
import { addProduct, type NewProductData } from '@/lib/product-service';
import { useRouter } from 'next/navigation';


export default function NewProductPage() {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [productImageUris, setProductImageUris] = useState<string[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDescriptionGenerated = (generatedDescription: string) => {
    setDescription(generatedDescription);
  };

  const handleImageUploaded = (imageDataUris: string[] | null) => {
    setProductImageUris(imageDataUris);
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    
    const newProductData: NewProductData = {
      name: productName,
      price: parseFloat(price),
      category,
      stock: parseInt(stock, 10),
      description,
      imageProductDataUris: productImageUris || [],
      dataAiHint: productName.toLowerCase().split(' ').slice(0,2).join(' ') || 'product',
    };

    try {
      await addProduct(newProductData);
      toast({
        title: "Product Saved!",
        description: `${productName} has been added to the catalog.`,
      });
      // Reset form
      setProductName('');
      setPrice('');
      setCategory('');
      setStock('');
      setDescription('');
      setProductImageUris(null);
      
      router.refresh(); 
      router.push('/admin/products');
    } catch (error) {
      console.error("Failed to add product:", error);
      toast({
        title: "Error",
        description: "Could not save the product. Please check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/products">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to Products</span>
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-semibold">Add New Product</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Product Details</CardTitle>
                <CardDescription>Enter the information for the new product.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g., Summer Breeze Dress"
                    required
                    disabled={isSaving}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (GH₵)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g., 150.00"
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
                      placeholder="e.g., Dresses"
                      required
                      disabled={isSaving}
                    />
                  </div>
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="e.g., 100"
                      required
                      disabled={isSaving}
                    />
                  </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Product Description (AI can help below)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product..."
                    rows={6}
                    required
                    disabled={isSaving}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="ml-auto" disabled={isSaving}>
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                   Save Product
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <ProductImageUploadForm 
            onDescriptionGenerated={handleDescriptionGenerated} 
            onImageUploaded={handleImageUploaded} 
          />
        </div>
      </div>
    </div>
  );
}
