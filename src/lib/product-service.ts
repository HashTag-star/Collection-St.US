
'use server';
// Though primarily used client-side for updates, marking as 'use server'
// if any function were to be callable from Server Actions directly.
// For in-memory, this directive's impact is minimal here.

import type { Product } from './types';

// Initial mock data, normalized
let products: Product[] = [
  { id: '1', name: 'Elegant Evening Gown', price: 250.00, description: 'A stunning full-length gown perfect for formal events. Made with high-quality silk and intricate lace details. Features a flattering A-line silhouette.', category: 'Dresses', imageUrls: ['https://placehold.co/800x1200.png', 'https://placehold.co/600x800.png', 'https://placehold.co/400x600.png'], stock: 15, status: 'Active', rating: 4.5, reviews: 25, dataAiHint: 'evening gown' },
  { id: '2', name: 'Casual Summer Dress', price: 120.00, description: 'Light and airy summer dress, ideal for warm weather. Crafted from breathable cotton with a vibrant floral print.', category: 'Dresses', imageUrls: ['https://placehold.co/600x800.png', 'https://placehold.co/400x600.png'], stock: 30, status: 'Active', rating: 4.2, reviews: 18, dataAiHint: 'summer dress' },
  { id: '3', name: 'Chic Office Blouse', price: 90.00, description: 'A stylish and professional blouse for the modern working woman. Made from a comfortable, wrinkle-resistant fabric.', category: 'Tops', imageUrls: ['https://placehold.co/600x800.png', 'https://placehold.co/400x600.png'], stock: 32, status: 'Active', rating: 4.8, reviews: 30, dataAiHint: 'office blouse' },
  { id: '4', name: 'Silk Scarf Collection', price: 75.00, description: 'Luxurious silk scarves in various prints. Adds a touch of elegance to any outfit.', category: 'Accessories', imageUrls: ['https://placehold.co/600x800.png'], stock: 50, status: 'Active', rating: 4.0, reviews: 10, dataAiHint: 'silk scarf' },
  { id: '5', name: 'Denim Jeans', price: 180.00, description: 'Comfortable and stylish denim jeans, perfect for casual wear. Available in multiple fits.', category: 'Bottoms', imageUrls: ['https://placehold.co/600x800.png'], stock: 20, status: 'Active', rating: 4.3, reviews: 22, dataAiHint: 'denim jeans' },
  { id: '6', name: 'Leather Handbag', price: 350.00, description: 'A high-quality leather handbag with multiple compartments. Durable and fashionable.', category: 'Accessories', imageUrls: ['https://placehold.co/600x800.png'], stock: 8, status: 'Active', rating: 4.9, reviews: 40, dataAiHint: 'leather handbag' },
  { id: '7', name: 'Summer Maxi Dress (Draft)', price: 180.00, description: 'Beautiful maxi dress for summer occasions. Made from lightweight fabric.', category: 'Dresses', imageUrls: ['https://placehold.co/600x800.png'], stock: 0, status: 'Draft', rating: 3.9, reviews: 5, dataAiHint: 'maxi dress' },
];

export const getProducts = async (): Promise<Product[]> => {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 50));
  return JSON.parse(JSON.stringify(products)); // Return a deep copy
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  // Simulate API delay
  // await new Promise(resolve => setTimeout(resolve, 50));
  const product = products.find(p => p.id === id);
  return product ? JSON.parse(JSON.stringify(product)) : undefined;
};

export type NewProductData = {
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  imageProductDataUri?: string; // data URI from file upload
  dataAiHint: string;
};

export const addProduct = async (productData: NewProductData): Promise<Product> => {
  const existingIds = products.map(p => parseInt(p.id, 10)).filter(id => !isNaN(id));
  const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
  const newId = (maxId + 1).toString();

  const newProduct: Product = {
    id: newId,
    name: productData.name,
    price: Number(productData.price), // Ensure price is a number
    category: productData.category,
    stock: Number(productData.stock), // Ensure stock is a number
    description: productData.description,
    imageUrls: productData.imageProductDataUri ? [productData.imageProductDataUri] : [`https://placehold.co/600x800.png?text=${encodeURIComponent(productData.name)}`],
    dataAiHint: productData.dataAiHint || productData.name.toLowerCase().split(' ').slice(0,2).join(' '),
    status: 'Active', // Default to active
    rating: undefined, // Initialize optional fields
    reviews: undefined,
  };
  products.push(newProduct);
  return JSON.parse(JSON.stringify(newProduct));
};

// In a real backend, you would also have updateProduct and deleteProduct functions.
// For this in-memory store, components will typically re-fetch the whole list or specific item
// after an action (like add, or if edit/delete were implemented).
