"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "xc_cart_v1";

function loadCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, hydrated]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product_id === product.id);
      const maxQty = product.stock ?? 99;
      if (existing) {
        return prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, maxQty) }
            : item
        );
      }
      return [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          image_url: product.image_url,
          price: Number(product.price),
          delivery_price: Number(product.delivery_price),
          stock: product.stock,
          quantity: Math.min(quantity, maxQty),
        },
      ];
    });
  };

  const setQuantity = (productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) return prev.filter((item) => item.product_id !== productId);
      return prev.map((item) =>
        item.product_id === productId
          ? { ...item, quantity: Math.min(quantity, item.stock ?? 99) }
          : item
      );
    });
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
  };

  const clear = () => setItems([]);

  const totals = useMemo(() => {
    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryTotal = items.reduce((sum, item) => sum + item.delivery_price, 0);
    return {
      itemsTotal,
      deliveryTotal,
      grandTotal: itemsTotal + deliveryTotal,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, setQuantity, removeItem, clear, totals, hydrated }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
