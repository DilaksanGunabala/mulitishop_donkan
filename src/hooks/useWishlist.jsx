import { useState, useCallback } from 'react';

const STORAGE_KEY = 'wishlist';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

export function useWishlist() {
  const [wishlist, setWishlist] = useState(loadFromStorage);

  const addToWishlist = useCallback((id) => {
    setWishlist((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) => {
      const next = prev.filter((i) => i !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlist((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      saveToStorage(next);
      return next;
    });
  }, []);

  const isWishlisted = useCallback((id) => wishlist.includes(id), [wishlist]);

  return { wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted };
}
