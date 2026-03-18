import React from 'react';
import { WishlistProvider } from './WishlistContext';
import { CartProvider } from './CartContext';

export default function AppProviders({ children }) {
  return (
    <WishlistProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </WishlistProvider>
  );
}
