
export interface Product {
  id: string;
  name: string;
  price: number; // Stored as a number
  description: string;
  category: string;
  imageUrls: string[]; // Array of image URLs
  stock: number; // Stored as a number
  status: 'Active' | 'Draft'; // For admin product status
  rating?: number;
  reviews?: number;
  dataAiHint: string;
}

// Cart items might still use a simplified structure or be adapted later
export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
  dataAiHint?: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string; // In a real app, this would be a hashed password
  avatarUrl?: string;
}

export type NewUserCredentials = Pick<User, 'fullName' | 'email' | 'password'>;
export type LoginCredentials = Pick<User, 'email' | 'password'>;

export type NewProductData = {
  name: string;
  price: number;
  category: string;
  stock: number;
  description: string;
  imageProductDataUri?: string; // data URI from file upload
  dataAiHint: string;
};

export type UpdateProductData = Partial<Omit<Product, 'id' | 'imageUrls' | 'rating' | 'reviews' | 'dataAiHint'>> & {
  // We are not allowing direct image URL updates via this type for simplicity in this step.
  // dataAiHint will be derived from name if not provided or kept as is.
};
