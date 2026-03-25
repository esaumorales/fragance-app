"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string; // product id
  name: string;
  price: number;
  size: string;
  qty: number;
  stock: number;
  image: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, newQty: number) => void;
  clearCart: () => void;
  totalItems: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lyoncall_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("lyoncall_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (newItem: CartItem) => {
    setItems(current => {
      const existing = current.find(i => i.id === newItem.id);
      if (existing) {
        // limit to stock
        const newQty = Math.min(existing.qty + newItem.qty, existing.stock);
        return current.map(i => i.id === newItem.id ? { ...i, qty: newQty } : i);
      }
      return [...current, newItem];
    });
  };

  const removeItem = (id: string) => {
    setItems(current => current.filter(i => i.id !== id));
  };

  const updateQty = (id: string, newQty: number) => {
    setItems(current => current.map(i => {
      if (i.id === id) {
        return { ...i, qty: Math.max(1, Math.min(newQty, i.stock)) };
      }
      return i;
    }));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
