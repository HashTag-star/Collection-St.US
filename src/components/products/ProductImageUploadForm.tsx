"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";


export function ProductImageUploadForm({
  onDescriptionGenerated,
}: {
  onDescriptionGenerated: (description: string) => void;
}) {
  const [productImage, setProductImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productImage) {
      setError('Please select an image file.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateProductDescription({ productImage });
      onDescriptionGenerated(result.description);
      toast({
        title: "Description Generated!",
        description: "AI has successfully crafted a product description.",
        variant: "default",
      });
    } catch (err) {
      console.error('Error generating product description:', err);
      setError('Failed to generate product description. Please try again.');
       toast({
        title: "Generation Failed",
        description: "Could not generate description. Check console for errors.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          AI Product Description Generator
        </CardTitle>
        <CardDescription>
          Upload a product image and let AI craft a compelling description for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productImage" className="text-base">Product Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="productImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById('productImage')?.click()}>
                <ImageIcon className="mr-2 h-4 w-4" />
                {fileName || 'Choose Image'}
              </Button>
            </div>
            {productImage && (
              <div className="mt-4 border rounded-md p-2 inline-block bg-muted">
                <Image src={productImage} alt="Product Preview" width={150} height={150} className="rounded-md object-cover" />
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoading || !productImage} className="w-full sm:w-auto">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Description
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
