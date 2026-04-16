"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartItem, Product } from "@/types";
import { storage } from "@/lib/utils";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    setCart(storage.get<CartItem[]>("sb_cart", []));
  }, []);

  // Persist on every change
  useEffect(() => {
    storage.set("sb_cart", cart);
  }, [cart]);

  const addItem = useCallback((product: Product) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, qty } : i))
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return { cart, addItem, updateQty, clearCart };
}
