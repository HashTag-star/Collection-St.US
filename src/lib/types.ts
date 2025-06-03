
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
