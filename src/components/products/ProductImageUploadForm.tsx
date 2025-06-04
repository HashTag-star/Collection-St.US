
"use client";

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { generateProductDescription } from '@/ai/flows/generate-product-description';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, Image as ImageIcon, XCircle } from 'lucide-react';
import NextImage from 'next/image';
import { useToast } from "@/hooks/use-toast";

export function ProductImageUploadForm({
  onDescriptionGenerated,
  onImageUploaded,
}: {
  onDescriptionGenerated: (description: string) => void;
  onImageUploaded: (imageDataUris: string[] | null) => void;
}) {
  const [productImages, setProductImages] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [isLoadingDescription, setIsLoadingDescription] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newImagePromises: Promise<string>[] = [];
      const newFileNames: string[] = [];

      Array.from(files).forEach(file => {
        newFileNames.push(file.name);
        newImagePromises.push(
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
        );
      });

      Promise.all(newImagePromises)
        .then(newImageDataUris => {
          setProductImages(prevImages => [...prevImages, ...newImageDataUris]);
          setFileNames(prevNames => [...prevNames, ...newFileNames]);
          onImageUploaded([...productImages, ...newImageDataUris]);
        })
        .catch(err => {
          console.error("Error reading files:", err);
          setError("Could not load one or more images.");
          toast({ title: "Image Load Error", description: "Failed to load some images.", variant: "destructive" });
        });
    }
    // Reset file input to allow re-selecting the same file(s) if needed
    if (event.target) {
        event.target.value = '';
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = productImages.filter((_, index) => index !== indexToRemove);
    const updatedFileNames = fileNames.filter((_, index) => index !== indexToRemove);
    setProductImages(updatedImages);
    setFileNames(updatedFileNames);
    onImageUploaded(updatedImages.length > 0 ? updatedImages : null);
  };

  const handleGenerateDescription = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (productImages.length === 0) {
      setError('Please select at least one image to generate a description.');
      toast({
        title: "Image Required",
        description: "Please upload an image before generating a description.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingDescription(true);
    setError(null);

    try {
      // Use the first image for description generation
      const result = await generateProductDescription({ productImage: productImages[0] });
      onDescriptionGenerated(result.description);
      toast({
        title: "Description Generated!",
        description: "AI has successfully crafted a product description using the first image.",
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
      setIsLoadingDescription(false);
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
          Upload one or more images. The first image will be used by AI to craft a description.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-6">
          <Label htmlFor="productImageHelper" className="text-base">Product Images</Label>
          <div className="flex items-center space-x-2">
            <Input
              id="productImageHelper"
              type="file"
              accept="image/*"
              multiple // Allow multiple file selection
              onChange={handleImageChange}
              className="hidden"
            />
            <Button type="button" variant="outline" onClick={() => document.getElementById('productImageHelper')?.click()}>
              <ImageIcon className="mr-2 h-4 w-4" />
              {productImages.length > 0 ? `${productImages.length} image(s) chosen` : 'Choose Image(s)'}
            </Button>
          </div>
          {productImages.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {productImages.map((imageUri, index) => (
                <div key={index} className="relative group border rounded-md p-1 bg-muted">
                  <NextImage src={imageUri} alt={`Product Preview ${index + 1}`} width={100} height={100} className="rounded-md object-cover w-full aspect-square" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="sr-only">Remove image {index + 1}</span>
                  </Button>
                  <p className="text-xs text-muted-foreground truncate mt-1" title={fileNames[index]}>{fileNames[index]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <form onSubmit={handleGenerateDescription} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" disabled={isLoadingDescription || productImages.length === 0} className="w-full sm:w-auto">
            {isLoadingDescription ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Description...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Description (from 1st image)
              </>
            )}
          </Button>
           <p className="text-xs text-muted-foreground">The generated description will populate the main form.</p>
        </form>
      </CardContent>
    </Card>
  );
}
