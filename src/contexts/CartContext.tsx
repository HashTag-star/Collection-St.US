
'use client';

import type { ReactNode, Dispatch, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, CartContextType } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

const CART_STORAGE_KEY = 'stusCollectionsCart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoadingCart(true);
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from local storage:", error);
      // Optionally clear corrupted cart data
      // localStorage.removeItem(CART_STORAGE_KEY);
    }
    setIsLoadingCart(false);
  }, []);

  useEffect(() => {
    if (!isLoadingCart) { // Only save to localStorage after initial load
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.error("Failed to save cart to local storage:", error);
      }
    }
  }, [cartItems, isLoadingCart]);

  const addToCart = useCallback((product: Product, quantity: number, selectedSize?: string) => {
    if (product.stock === 0) {
      toast({ title: "Out of Stock", description: `${product.name} is currently out of stock.`, variant: "destructive" });
      return;
    }
    if (quantity <= 0) return;

    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.productId === product.id && item.size === selectedSize
      );

      let newCartItems;

      if (existingItemIndex > -1) {
        newCartItems = prevItems.map((item, index) => {
          if (index === existingItemIndex) {
            const newQuantity = item.quantity + quantity;
            if (newQuantity > product.stock) {
              toast({ title: "Stock Limit Reached", description: `Cannot add more ${product.name} (Size: ${selectedSize || 'N/A'}) than available in stock (${product.stock}).`, variant: "destructive" });
              return { ...item, quantity: product.stock };
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      } else {
        if (quantity > product.stock) {
          toast({ title: "Stock Limit Reached", description: `Cannot add ${product.name} (Size: ${selectedSize || 'N/A'}) - requested quantity exceeds stock (${product.stock}).`, variant: "destructive" });
          newCartItems = [...prevItems, {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrls[0] || 'https://placehold.co/100x150.png',
            quantity: product.stock,
            size: selectedSize,
            availableStock: product.stock,
          }];
        } else {
          newCartItems = [...prevItems, {
            productId: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrls[0] || 'https://placehold.co/100x150.png',
            quantity,
            size: selectedSize,
            availableStock: product.stock,
          }];
        }
      }
      toast({ title: "Item Added", description: `${product.name} ${selectedSize ? `(Size: ${selectedSize}) ` : ''}added to cart.` });
      return newCartItems;
    });
  }, [toast]);

  const removeFromCart = useCallback((productId: string, size?: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.productId === productId && item.size === size))
    );
    toast({ title: "Item Removed", description: "Item removed from cart." });
  }, [toast]);

  const updateQuantity = useCallback((productId: string, newQuantity: number, size?: string) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.productId === productId && item.size === size) {
          if (newQuantity <= 0) {
            // This case should ideally trigger remove, but for direct update:
            toast({ title: "Invalid Quantity", description: "Quantity must be at least 1. Use remove to delete.", variant: "destructive" });
            return item; // Or handle removal
          }
          if (newQuantity > item.availableStock) {
            toast({ title: "Stock Limit Reached", description: `Cannot set quantity for ${item.name} (Size: ${size || 'N/A'}) above available stock (${item.availableStock}).`, variant: "destructive" });
            return { ...item, quantity: item.availableStock };
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  }, [toast]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({ title: "Cart Cleared", description: "Your shopping cart is now empty." });
  }, [toast]);

  const getCartSubtotal = useCallback(() : number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getTotalCartItems = useCallback(() : number => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);


  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      getCartSubtotal, 
      getTotalCartItems,
      isLoadingCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
