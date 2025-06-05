
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
  sizes?: string[]; // Optional: Array of available sizes like ['S', 'M', 'L']
}

export interface CartItem {
  productId: string; // References Product.id
  name: string;
  price: number; // Price at the time of adding to cart
  imageUrl: string; // Main image URL
  quantity: number;
  size?: string; // Optional, to distinguish items like "T-Shirt, Size M" and "T-Shirt, Size L"
  availableStock: number; // Store the original stock of the product variant
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
  imageProductDataUris?: string[]; // data URIs from file upload
  dataAiHint: string;
  sizes?: string[];
};

export type UpdateProductData = Partial<Omit<Product, 'id' | 'imageUrls' | 'rating' | 'reviews' | 'sizes'>> & {
  // dataAiHint will be derived from name if not provided or kept as is.
  // sizes can be updated
  sizes?: string[] | null; // Allow setting to null or empty array
};

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  phone: string;
}

export interface OrderItem {
  id: string; // Or orderItemId
  orderId: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  priceAtPurchase: number; // Price of the product when the order was made
  size?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderDate: string; // ISO date string
  totalAmount: number;
  status: 'Pending Payment' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  shippingAddress: ShippingAddress; // Stored as JSON in DB
  items: OrderItem[]; // Typically fetched separately or joined
  customerFullName?: string; // Denormalized for admin display, optional
  customerEmail?: string; // Denormalized for admin display, optional
}


export interface NewOrderData {
  userId: string;
  items: CartItem[]; // Items from the cart
  shippingAddress: ShippingAddress;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  paymentMethod: string; // e.g., 'Mobile Money', 'Card'
  paymentStatus: Order['paymentStatus']; // Initial payment status
}


export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, selectedSize?: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  updateQuantity: (productId: string, newQuantity: number, size?: string) => void;
  clearCart: () => void;
  getCartSubtotal: () => number;
  getTotalCartItems: () => number;
  isLoadingCart: boolean;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  subscribedAt: string; // ISO date string
}
