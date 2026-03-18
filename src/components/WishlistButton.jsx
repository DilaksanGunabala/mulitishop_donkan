import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useWishlistContext } from '../context/WishlistContext';

export default function WishlistButton({ productId, className = '' }) {
  const { isWishlisted, toggleWishlist } = useWishlistContext();
  const wishlisted = isWishlisted(productId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  return (
    <button
      onClick={handleClick}
      aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`p-2 rounded-full bg-white shadow transition-colors ${
        wishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
      } ${className}`}
    >
      {wishlisted ? <FaHeart size={18} /> : <FiHeart size={18} />}
    </button>
  );
}
