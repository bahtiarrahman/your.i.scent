import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PRODUCTS, Product, DecantVariant } from '../data/products';

interface ProductsContextType {
  products: Product[];
  updateProduct: (product: Product) => void;
  addProduct: (data: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  reduceStock: (productId: string, qty: number, variantSize?: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

const STORAGE_KEY = 'youri_products_v1';

function loadProducts(): Product[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // MIGRATION: convert old scentType (string) to new format (array)
      return parsed.map((p: any) => ({
        ...p,
        scentType: Array.isArray(p.scentType) ? p.scentType : [p.scentType]
      }));
    }
  } catch {}
  return PRODUCTS;
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadProducts);

  const save = (updated: Product[]) => {
    setProducts(updated);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
  };

  const updateProduct = (product: Product) =>
    save(products.map(p => p.id === product.id ? product : p));

  const addProduct = (data: Omit<Product, 'id'>) =>
    save([...products, { ...data, id: 'p' + Date.now() }]);

  const deleteProduct = (id: string) =>
    save(products.filter(p => p.id !== id));

  // Kurangi stok saat order selesai
  const reduceStock = (productId: string, qty: number, variantSize?: string) => {
    save(products.map(p => {
      if (p.id !== productId) return p;
      if (variantSize && p.variants) {
        const variants: DecantVariant[] = p.variants.map(v =>
          v.size === variantSize ? { ...v, stock: Math.max(0, v.stock - qty) } : v
        );
        const totalStock = variants.reduce((s, v) => s + v.stock, 0);
        return { ...p, variants, stock: totalStock };
      }
      return { ...p, stock: Math.max(0, p.stock - qty) };
    }));
  };

  return (
    <ProductsContext.Provider value={{ products, updateProduct, addProduct, deleteProduct, reduceStock }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
}
