import React from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import '../styles/fonts.css';

export default function App() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}