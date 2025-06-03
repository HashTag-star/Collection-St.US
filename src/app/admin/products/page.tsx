
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, Edit, Trash2, Package } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import { getProducts } from '@/lib/product-service';
import type { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const formatStock = (stock: number) => {
    if (stock > 10) return <Badge variant="default">In Stock ({stock})</Badge>;
    if (stock > 0) return <Badge variant="secondary">Low Stock ({stock})</Badge>;
    return <Badge variant="destructive">Out of Stock</Badge>;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-semibold">Products</h1>
          <Button asChild>
            <Link href="/admin/products/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
            </Link>
          </Button>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Product Catalog</CardTitle>
            <CardDescription>Manage your products, view stock levels, and edit details.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Loading products...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-semibold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
         <Card className="text-center py-12 shadow-lg">
            <CardContent>
                <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="font-headline text-2xl font-semibold mb-2">No Products Found</h2>
                <p className="text-muted-foreground mb-6">Start by adding your first product to the catalog.</p>
                <Button asChild>
                    <Link href="/admin/products/new">Add New Product</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">Product Catalog</CardTitle>
            <CardDescription>Manage your products, view stock levels, and edit details.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Price</TableHead>
                  <TableHead className="hidden md:table-cell">Stock</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={product.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={product.imageUrls[0] || 'https://placehold.co/64x64.png'}
                        width="64"
                        data-ai-hint={product.dataAiHint}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>
                      <Badge variant={product.status === 'Active' ? 'default' : 'outline'}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="hidden md:table-cell">GH₵ {product.price.toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatStock(product.stock)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Edit (Not Implemented)
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                            Delete (Not Implemented)
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
