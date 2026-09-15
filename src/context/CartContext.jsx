import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { products, grindOptions } from '../data/products';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

const STORAGE_KEY = 'keepcoffee_cart';

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  // items: [{ slug, qty, grind }]
  const [items, setItems] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [items]);

  const addItem = (slug, qty = 1, grind = null) => {
    setItems((prev) => {
      const matchItem = (i) => i.slug === slug && (i.grind || null) === (grind || null);
      const existing = prev.find(matchItem);
      if (existing) {
        return prev.map((i) =>
          matchItem(i) ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { slug, qty, grind: grind || null }];
    });
  };

  const updateQty = (cartKey, qty) => {
    setItems((prev) =>
      prev
        .map((i) => {
          const itemKey = i.grind ? `${i.slug}-${i.grind}` : i.slug;
          return itemKey === cartKey || i.slug === cartKey
            ? { ...i, qty: Math.max(1, qty) }
            : i;
        })
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (cartKey) =>
    setItems((prev) =>
      prev.filter((i) => {
        const itemKey = i.grind ? `${i.slug}-${i.grind}` : i.slug;
        return itemKey !== cartKey && i.slug !== cartKey;
      })
    );

  const clear = () => setItems([]);

  // Join cart entries with product data for rendering & totals
  const detailedItems = useMemo(
    () =>
      items
        .map((i) => {
          const product = products.find((p) => p.slug === i.slug);
          if (!product) return null;
          const grindObj = grindOptions?.find((g) => g.id === i.grind);
          const itemKey = i.grind ? `${i.slug}-${i.grind}` : i.slug;
          return {
            ...product,
            cartKey: itemKey,
            grind: i.grind,
            grindLabel: grindObj ? grindObj.label : null,
            qty: i.qty,
            lineTotal: (product.price || 0) * i.qty,
          };
        })
        .filter(Boolean),
    [items]
  );

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => detailedItems.reduce((sum, i) => sum + i.lineTotal, 0),
    [detailedItems]
  );

  const value = {
    items,
    detailedItems,
    count,
    subtotal,
    addItem,
    updateQty,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
