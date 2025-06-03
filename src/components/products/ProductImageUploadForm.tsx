
"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// Textarea removed as description is now in the main form
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import NextImage from 'next/image'; // Renamed to avoid conflict with Lucide icon
import { useToast } from "@/hooks/use-toast";


export function ProductImageUploadForm({
  onDescriptionGenerated,
  onImageUploaded,
}: {
  onDescriptionGenerated: (description: string) => void;
  onImageUploaded: (imageDataUri: string | null) => void;
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
        const result = reader.result as string;
        setProductImage(result);
        onImageUploaded(result); // Pass image data URI to parent
      };
      reader.readAsDataURL(file);
    } else {
      setProductImage(null);
      onImageUploaded(null);
      setFileName('');
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productImage) {
      setError('Please select an image file to generate a description.');
      toast({
        title: "Image Required",
        description: "Please upload an image before generating a description.",
        variant: "destructive",
      });
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
          AI Product Helper
        </CardTitle>
        <CardDescription>
          Upload an image to auto-fill it in the form and let AI craft a description.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="productImageHelper" className="text-base">Product Image</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="productImageHelper" // Changed ID to avoid conflict if main form also has one
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button type="button" variant="outline" onClick={() => document.getElementById('productImageHelper')?.click()}>
                <ImageIcon className="mr-2 h-4 w-4" />
                {fileName || 'Choose Image'}
              </Button>
            </div>
            {productImage && (
              <div className="mt-4 border rounded-md p-2 inline-block bg-muted">
                <NextImage src={productImage} alt="Product Preview" width={150} height={150} className="rounded-md object-cover" />
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
                Generating Description...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Description
              </>
            )}
          </Button>
           <p className="text-xs text-muted-foreground">The generated description will populate the main form.</p>
        </form>
      </CardContent>
    </Card>
  );
}
