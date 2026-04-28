import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../data/products';

export interface CartItem {
  product: Product;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => boolean; // returns false if out of stock
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('youri_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('youri_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product): boolean => {
    const maxStock = product.stock;
    if (maxStock <= 0) return false;

    let added = false;
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      const currentQty = existing?.qty ?? 0;
      if (currentQty >= maxStock) return prev; // sudah di max stok
      added = true;
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
    return added;
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) { removeFromCart(productId); return; }
    setItems(prev => prev.map(i => {
      if (i.product.id !== productId) return i;
      const maxStock = i.product.stock;
      return { ...i, qty: Math.min(qty, maxStock) };
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}