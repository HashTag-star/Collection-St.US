
'use server';

import db from './db';
import type { Product, NewProductData, UpdateProductData } from './types';
import { revalidatePath } from 'next/cache';

// Helper to map DB row to Product type
const mapRowToProduct = (row: any): Product => {
  if (!row) return undefined as unknown as Product; // Should not happen if row exists
  return {
    id: String(row.id),
    name: row.name,
    price: Number(row.price),
    description: row.description,
    category: row.category,
    imageUrls: row.imageUrls ? JSON.parse(row.imageUrls) : [],
    stock: Number(row.stock),
    status: row.status as 'Active' | 'Draft',
    rating: row.rating !== null && row.rating !== undefined ? Number(row.rating) : undefined,
    reviews: row.reviews !== null && row.reviews !== undefined ? Number(row.reviews) : undefined,
    dataAiHint: row.dataAiHint,
    sizes: row.sizes ? JSON.parse(row.sizes) : undefined,
  };
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const stmt = db.prepare('SELECT * FROM products');
    const rows = stmt.all() as any[];
    return rows.map(mapRowToProduct);
  } catch (error) {
    console.error('Failed to get products:', error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
    const row = stmt.get(id) as any; // id is string, but SQLite will handle conversion for INTEGER PK
    return row ? mapRowToProduct(row) : undefined;
  } catch (error) {
    console.error(`Failed to get product by id ${id}:`, error);
    return undefined;
  }
};

export const addProduct = async (productData: NewProductData): Promise<Product> => {
  const imageUrlsString = JSON.stringify(
    (productData.imageProductDataUris && productData.imageProductDataUris.length > 0)
      ? productData.imageProductDataUris
      : [`https://placehold.co/600x800.png?text=${encodeURIComponent(productData.name)}`]
  );

  const dataAiHint = productData.dataAiHint || productData.name.toLowerCase().split(' ').slice(0,2).join(' ');
  const sizesString = productData.sizes ? JSON.stringify(productData.sizes) : null;

  try {
    const stmt = db.prepare(
      'INSERT INTO products (name, price, category, stock, description, imageUrls, dataAiHint, status, sizes) VALUES (@name, @price, @category, @stock, @description, @imageUrls, @dataAiHint, @status, @sizes)'
    );
    const info = stmt.run({
      name: productData.name,
      price: Number(productData.price),
      category: productData.category,
      stock: Number(productData.stock),
      description: productData.description,
      imageUrls: imageUrlsString,
      dataAiHint: dataAiHint,
      status: 'Active', // New products default to Active
      sizes: sizesString,
    });

    const newProductId = String(info.lastInsertRowid);

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath(`/products/${newProductId}`);
    revalidatePath('/admin/dashboard'); // Revalidate dashboard for product counts

    const newProduct = await getProductById(newProductId);
    if (!newProduct) {
        throw new Error("Failed to retrieve newly added product");
    }
    return newProduct;

  } catch (error) {
    console.error('Failed to add product:', error);
    throw error; 
  }
};

export const updateProduct = async (id: string, updates: UpdateProductData): Promise<Product | undefined> => {
  try {
    const currentProduct = await getProductById(id);
    if (!currentProduct) {
      return undefined;
    }

    const setClauses: string[] = [];
    const params: any = { id: Number(id) }; 

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) { 
        if (key === 'sizes') {
          setClauses.push(`sizes = @sizes`);
          params.sizes = value === null ? null : JSON.stringify(value);
        } else {
          setClauses.push(`${key} = @${key}`);
          params[key] = value;
        }
      }
    });
    
    if (updates.name && updates.dataAiHint === undefined) {
        const newAiHint = updates.name.toLowerCase().split(' ').slice(0,2).join(' ');
        if (newAiHint !== currentProduct.dataAiHint) {
             if (!setClauses.some(c => c.startsWith('dataAiHint'))) {
                setClauses.push('dataAiHint = @dataAiHint');
             }
             params.dataAiHint = newAiHint;
        }
    } else if (updates.dataAiHint) {
        if (!setClauses.some(c => c.startsWith('dataAiHint'))) {
            setClauses.push('dataAiHint = @dataAiHint');
        }
        params.dataAiHint = updates.dataAiHint;
    }


    if (setClauses.length === 0) {
      return currentProduct;
    }

    const sql = `UPDATE products SET ${setClauses.join(', ')} WHERE id = @id`;
    const stmt = db.prepare(sql);
    stmt.run(params);

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/');
    revalidatePath(`/products/${id}`);
    revalidatePath(`/admin/products/${id}/edit`);
    revalidatePath('/admin/dashboard');

    return await getProductById(id);
  } catch (error) {
    console.error(`Failed to update product ${id}:`, error);
    return undefined;
  }
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    const info = stmt.run(Number(id)); 

    if (info.changes > 0) {
      revalidatePath('/admin/products');
      revalidatePath('/products');
      revalidatePath('/');
      revalidatePath(`/products/${id}`);
      revalidatePath('/admin/dashboard');
      return true;
    }
    return false; 
  } catch (error) {
    console.error(`Failed to delete product ${id}:`, error);
    return false;
  }
};

// For Admin Analytics
export const getProductsGroupedByCategory = async (): Promise<Record<string, number>> => {
  try {
    const rows = db.prepare(
      "SELECT category, COUNT(*) as count FROM products GROUP BY category"
    ).all() as { category: string; count: number }[];
    
    const grouped: Record<string, number> = {};
    rows.forEach(row => {
      grouped[row.category] = row.count;
    });
    return grouped;
  } catch (error) {
    console.error('Failed to get products grouped by category:', error);
    return {};
  }
};

export const getTotalProductCount = async (): Promise<number> => {
  try {
    const result = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
    return result?.count || 0;
  } catch (error) {
    console.error('Failed to get total product count:', error);
    return 0;
  }
};
