"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import { type CartItem, type Product } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "shahi-vastram-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (saved) {
      setItems(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      addItem: (product) =>
        setItems((current) => {
          const existing = current.find((item) => item.id === product.id);
          if (existing) {
            return current.map((item) =>
              item.id === product.id
                ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
                : item
            );
          }
          return [...current, { ...product, quantity: 1 }];
        }),
      removeItem: (productId) =>
        setItems((current) => current.filter((item) => item.id !== productId)),
      updateQuantity: (productId, quantity) =>
        setItems((current) =>
          current
            .map((item) =>
              item.id === productId
                ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
                : item
            )
            .filter((item) => item.quantity > 0)
        ),
      clearCart: () => setItems([]),
      subtotal,
      itemCount
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
