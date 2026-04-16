"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartItem, Product } from "@/types";
import { storage } from "@/lib/storage";

const STORAGE_KEY = "sb_cart";

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hidrata do localStorage apenas no cliente
  useEffect(() => {
    setCart(storage.get<CartItem[]>(STORAGE_KEY, []));
    setHydrated(true);
  }, []);

  // Persiste cada mudança
  useEffect(() => {
    if (hydrated) {
      storage.set(STORAGE_KEY, cart);
    }
  }, [cart, hydrated]);

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
    setCart((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, qty } : i))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  return { cart, hydrated, addItem, updateQty, clearCart };
}
