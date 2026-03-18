import React, { createContext, useContext } from 'react';
import { useWishlist } from '../hooks/useWishlist';

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const wishlistState = useWishlist();
  return (
    <WishlistContext.Provider value={wishlistState}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlistContext() {
  return useContext(WishlistContext);
}
