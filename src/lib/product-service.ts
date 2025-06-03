
'use server';

import type { Product, NewProductData, UpdateProductData } from './types';
import { revalidatePath } from 'next/cache';

// Initial mock data, normalized
let products: Product[] = [
  { id: '1', name: 'Elegant Evening Gown', price: 250.00, description: 'A stunning full-length gown perfect for formal events. Made with high-quality silk and intricate lace details. Features a flattering A-line silhouette.', category: 'Dresses', imageUrls: ['https://placehold.co/800x1200.png', 'https://placehold.co/600x800.png', 'https://placehold.co/400x600.png'], stock: 15, status: 'Active', rating: 4.5, reviews: 25, dataAiHint: 'evening gown', sizes: ['S', 'M', 'L', 'XL'] },
  { id: '2', name: 'Casual Summer Dress', price: 120.00, description: 'Light and airy summer dress, ideal for warm weather. Crafted from breathable cotton with a vibrant floral print.', category: 'Dresses', imageUrls: ['https://placehold.co/600x800.png', 'https://placehold.co/400x600.png'], stock: 30, status: 'Active', rating: 4.2, reviews: 18, dataAiHint: 'summer dress', sizes: ['XS', 'S', 'M'] },
  { id: '3', name: 'Chic Office Blouse', price: 90.00, description: 'A stylish and professional blouse for the modern working woman. Made from a comfortable, wrinkle-resistant fabric.', category: 'Tops', imageUrls: ['https://placehold.co/600x800.png', 'https://placehold.co/400x600.png'], stock: 32, status: 'Active', rating: 4.8, reviews: 30, dataAiHint: 'office blouse', sizes: ['S', 'M', 'L'] },
  { id: '4', name: 'Silk Scarf Collection', price: 75.00, description: 'Luxurious silk scarves in various prints. Adds a touch of elegance to any outfit.', category: 'Accessories', imageUrls: ['https://placehold.co/600x800.png'], stock: 50, status: 'Active', rating: 4.0, reviews: 10, dataAiHint: 'silk scarf' }, // No sizes for scarves
  { id: '5', name: 'Denim Jeans', price: 180.00, description: 'Comfortable and stylish denim jeans, perfect for casual wear. Available in multiple fits.', category: 'Bottoms', imageUrls: ['https://placehold.co/600x800.png'], stock: 20, status: 'Active', rating: 4.3, reviews: 22, dataAiHint: 'denim jeans', sizes: ['28', '30', '32', '34', '36'] },
  { id: '6', name: 'Leather Handbag', price: 350.00, description: 'A high-quality leather handbag with multiple compartments. Durable and fashionable.', category: 'Accessories', imageUrls: ['https://placehold.co/600x800.png'], stock: 8, status: 'Active', rating: 4.9, reviews: 40, dataAiHint: 'leather handbag' }, // No sizes for handbags
  { id: '7', name: 'Summer Maxi Dress (Draft)', price: 180.00, description: 'Beautiful maxi dress for summer occasions. Made from lightweight fabric.', category: 'Dresses', imageUrls: ['https://placehold.co/600x800.png'], stock: 0, status: 'Draft', rating: 3.9, reviews: 5, dataAiHint: 'maxi dress', sizes: ['S', 'M', 'L'] },
];

export const getProducts = async (): Promise<Product[]> => {
  return JSON.parse(JSON.stringify(products));
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  const product = products.find(p => p.id === id);
  return product ? JSON.parse(JSON.stringify(product)) : undefined;
};

export const addProduct = async (productData: NewProductData): Promise<Product> => {
  const existingIds = products.map(p => parseInt(p.id, 10)).filter(id => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const newId = (maxId + 1).toString();

  const newProduct: Product = {
    id: newId,
    name: productData.name,
    price: Number(productData.price),
    category: productData.category,
    stock: Number(productData.stock),
    description: productData.description,
    imageUrls: productData.imageProductDataUri ? [productData.imageProductDataUri] : [`https://placehold.co/600x800.png?text=${encodeURIComponent(productData.name)}`],
    dataAiHint: productData.dataAiHint || productData.name.toLowerCase().split(' ').slice(0,2).join(' '),
    status: 'Active',
    rating: undefined,
    reviews: undefined,
    sizes: undefined, // New products won't have sizes by default via this form
  };
  products.push(newProduct);

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');
  revalidatePath(`/products/${newId}`);


  return JSON.parse(JSON.stringify(newProduct));
};

export const updateProduct = async (id: string, updates: UpdateProductData): Promise<Product | undefined> => {
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return undefined;
  }

  const originalProduct = products[productIndex];
  const updatedProduct: Product = {
    ...originalProduct,
    ...updates,
    price: updates.price !== undefined ? Number(updates.price) : originalProduct.price,
    stock: updates.stock !== undefined ? Number(updates.stock) : originalProduct.stock,
    // Ensure dataAiHint is updated if name changes and no explicit hint is provided
    dataAiHint: updates.name ? updates.name.toLowerCase().split(' ').slice(0,2).join(' ') : originalProduct.dataAiHint,
    // Sizes are not managed by this update function in this iteration
  };

  products[productIndex] = updatedProduct;

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');
  revalidatePath(`/products/${id}`);
  revalidatePath(`/admin/products/${id}/edit`);


  return JSON.parse(JSON.stringify(updatedProduct));
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex === -1) {
    return false;
  }
  products.splice(productIndex, 1);

  revalidatePath('/admin/products');
  revalidatePath('/products');
  revalidatePath('/');
  revalidatePath(`/products/${id}`); // Invalidate the deleted product's detail page specifically

  return true;
};
