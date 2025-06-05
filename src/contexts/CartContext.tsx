
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
    }
    setIsLoadingCart(false);
  }, []);

  useEffect(() => {
    if (!isLoadingCart) {
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

    let itemEffectivelyAdded = false;
    let stockLimitReachedDuringAdd = false;
    let finalEffectiveQuantity = quantity;


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
              stockLimitReachedDuringAdd = true;
              finalEffectiveQuantity = product.stock - item.quantity > 0 ? product.stock - item.quantity : 0; // quantity that was actually added
              itemEffectivelyAdded = finalEffectiveQuantity > 0;
              return { ...item, quantity: product.stock };
            }
            itemEffectivelyAdded = true;
            finalEffectiveQuantity = quantity;
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
      } else {
        if (quantity > product.stock) {
          stockLimitReachedDuringAdd = true;
          finalEffectiveQuantity = product.stock;
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
        itemEffectivelyAdded = true; // New item is always "effectively added" even if capped
      }
      return newCartItems;
    });

    // Call toasts after state update is scheduled
    if (stockLimitReachedDuringAdd) {
       if (itemEffectivelyAdded && finalEffectiveQuantity > 0) {
         toast({ title: "Stock Limit Reached", description: `Added ${finalEffectiveQuantity} of ${product.name} (Size: ${selectedSize || 'N/A'}) up to available stock (${product.stock}).`, variant: "destructive" });
       } else if (!itemEffectivelyAdded && finalEffectiveQuantity === 0) { // Case where existing item was already at max stock
         toast({ title: "Stock Limit Reached", description: `Cannot add more ${product.name} (Size: ${selectedSize || 'N/A'}), already at max stock (${product.stock}).`, variant: "destructive" });
       } else {
         toast({ title: "Stock Limit Reached", description: `Requested quantity for ${product.name} (Size: ${selectedSize || 'N/A'}) exceeds stock (${product.stock}). Added max available.`, variant: "destructive" });
       }
    } else if (itemEffectivelyAdded) {
      toast({ title: "Item Added", description: `${quantity} x ${product.name} ${selectedSize ? `(Size: ${selectedSize}) ` : ''}added to cart.` });
    }
  }, [toast]);

  const removeFromCart = useCallback((productId: string, size?: string) => {
    let removedItemName = '';
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.productId === productId && item.size === size);
      if (itemToRemove) {
        removedItemName = itemToRemove.name;
      }
      return prevItems.filter(item => !(item.productId === productId && item.size === size));
    });
    if (removedItemName) {
      toast({ title: "Item Removed", description: `${removedItemName} removed from cart.` });
    }
  }, [toast]);

  const updateQuantity = useCallback((productId: string, newQuantity: number, size?: string) => {
    let operationOutcome: 'success' | 'invalid_quantity' | 'stock_limit' | 'no_change' = 'no_change';
    let itemNameForToast = '';
    let stockForToast = 0;
    let originalQuantity = 0;
    let finalQuantity = newQuantity;

    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item.productId === productId && item.size === size) {
          itemNameForToast = item.name;
          stockForToast = item.availableStock;
          originalQuantity = item.quantity;

          if (newQuantity <= 0) {
            operationOutcome = 'invalid_quantity';
            finalQuantity = item.quantity; // Keep original if invalid
            return item;
          }
          if (newQuantity > item.availableStock) {
            operationOutcome = 'stock_limit';
            finalQuantity = item.availableStock;
            return { ...item, quantity: item.availableStock };
          }
          if (item.quantity !== newQuantity) {
            operationOutcome = 'success';
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );

    // Call toasts after state update
    if (operationOutcome === 'invalid_quantity') {
      toast({ title: "Invalid Quantity", description: "Quantity must be at least 1. Use remove icon to delete.", variant: "destructive" });
    } else if (operationOutcome === 'stock_limit') {
      toast({ title: "Stock Limit Reached", description: `Quantity for ${itemNameForToast} (Size: ${size || 'N/A'}) set to max available stock (${stockForToast}).`, variant: "destructive" });
    } else if (operationOutcome === 'success') {
       toast({ title: "Quantity Updated", description: `Quantity for ${itemNameForToast} ${size ? `(Size: ${size}) ` : ''}changed to ${finalQuantity}.` });
    }
  }, [toast]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast({ title: "Cart Cleared", description: "Your shopping cart is now empty." });
  }, [toast]);

  const getCartSubtotal = useCallback((): number => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getTotalCartItems = useCallback((): number => {
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

