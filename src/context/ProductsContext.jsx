import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { products as staticProducts, getProduct as getStaticProduct, getRelated as getStaticRelated, grindOptions } from '../data/products';
import { api } from '../api';

const ProductsContext = createContext(null);

export function normalizeProduct(dbProd, staticCatalog = staticProducts) {
  if (!dbProd) return null;
  const base = staticCatalog.find((s) => s.slug === dbProd.slug || s.id === dbProd.id) || {};

  let notes = base.notes || [];
  if (typeof dbProd.notes === 'string' && dbProd.notes.trim()) {
    notes = dbProd.notes.split(/[،,]/).map((s) => s.trim()).filter(Boolean);
  } else if (Array.isArray(dbProd.notes)) {
    notes = dbProd.notes;
  }

  const price =
    dbProd.price !== null && dbProd.price !== undefined && Number(dbProd.price) > 0
      ? Number(dbProd.price)
      : null;

  return {
    ...base,
    id: dbProd.id,
    slug: dbProd.slug,
    name: dbProd.name || base.name || '',
    price,
    unit: dbProd.unit || base.unit || 'کیلوگرم',
    category: dbProd.category || base.category || 'beans',
    image: dbProd.image || base.image || '/images/photo-1509042239860-500.webp',
    gallery: base.gallery?.length ? base.gallery : [dbProd.image || '/images/photo-1509042239860-500.webp'],
    badge: dbProd.badge ?? base.badge ?? null,
    roast: dbProd.roast ?? base.roast ?? 'مدیوم',
    roastLevel: dbProd.roast_level ?? dbProd.roastLevel ?? base.roastLevel ?? 3,
    caffeine: dbProd.caffeine ?? base.caffeine ?? null,
    stockStatus: dbProd.stock_status ?? dbProd.stockStatus ?? base.stockStatus ?? 'in_stock',
    inventoryQty: dbProd.inventory_qty ?? dbProd.inventoryQty ?? base.inventoryQty ?? 50,
    isActive: dbProd.is_active !== undefined ? Boolean(Number(dbProd.is_active)) : (base.isActive ?? true),
    origin: dbProd.origin || base.origin || null,
    notes,
    description: dbProd.description || base.description || '',
    sensory: base.sensory || (dbProd.category === 'beans' ? { body: 4, aroma: 4, bitterness: 4, acidity: 2, crema: 4 } : null),
    recommendedBrew: base.recommendedBrew || (dbProd.category === 'beans' ? ['اسپرسوساز صنعتی', 'اسپرسوساز خانگی', 'موکاپات'] : []),
  };
}

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(() => staticProducts.map((p) => normalizeProduct(p)));
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await api.get('/products');
      if (res?.products && Array.isArray(res.products)) {
        const live = res.products.map((p) => normalizeProduct(p, staticProducts));
        setProducts(live);
      }
      setError(null);
    } catch (err) {
      console.warn('Failed to fetch live products, using static fallback:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get('/settings/public');
      if (res?.settings) {
        setSettings(res.settings);
      }
    } catch (err) {
      console.warn('Failed to fetch store settings:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchSettings();

    const handleUpdate = () => {
      fetchProducts();
      fetchSettings();
    };

    window.addEventListener('keepcoffee_products_updated', handleUpdate);
    return () => window.removeEventListener('keepcoffee_products_updated', handleUpdate);
  }, [fetchProducts, fetchSettings]);

  const getProduct = useCallback(
    (slug) => {
      if (!slug) return null;
      return products.find((p) => p.slug === slug) || getStaticProduct(slug) || null;
    },
    [products]
  );

  const getRelated = useCallback(
    (slug, count = 3) => {
      const current = getProduct(slug);
      if (!current) return products.slice(0, count);
      return products
        .filter((p) => p.slug !== slug && p.category === current.category)
        .slice(0, count);
    },
    [products, getProduct]
  );

  const value = useMemo(
    () => ({
      products,
      settings,
      loading,
      error,
      getProduct,
      getRelated,
      grindOptions,
      refreshProducts: fetchProducts,
      refreshSettings: fetchSettings,
    }),
    [products, settings, loading, error, getProduct, getRelated, fetchProducts, fetchSettings]
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) {
    // Ponytail fallback: if rendered outside ProductsProvider, return static catalog
    return {
      products: staticProducts,
      settings: null,
      loading: false,
      error: null,
      getProduct: getStaticProduct,
      getRelated: getStaticRelated,
      grindOptions,
      refreshProducts: () => {},
      refreshSettings: () => {},
    };
  }
  return ctx;
}
