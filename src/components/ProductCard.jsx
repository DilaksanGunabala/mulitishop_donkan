import React from 'react';
import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product }) {
  const { id, name, price, category, images, slug } = product;
  const imgSrc = images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />
        {/* Wishlist */}
        <div className="absolute top-2 right-2">
          <WishlistButton productId={id} />
        </div>
        {/* Category badge */}
        {category && (
          <span className="absolute bottom-2 left-2 bg-white/90 text-teal-700 text-xs px-2.5 py-0.5 rounded-full font-medium border border-teal-100">
            {category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate mb-0.5 text-sm">{name}</h3>
        <p className="text-teal-700 font-bold text-base mb-3">
          ₹{Number(price).toLocaleString('en-IN')}
        </p>
        <Link
          to={`/products/${slug}`}
          className="block text-center w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
