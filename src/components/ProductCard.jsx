import React from 'react';
import { Link } from 'react-router-dom';
import WishlistButton from './WishlistButton';

export default function ProductCard({ product }) {
  const { id, name, price, category, images, slug } = product;
  const imgSrc = images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image';

  return (
    <div className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 flex-shrink-0">
        <img
          src={imgSrc}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
          loading="lazy"
        />
        {/* Wishlist */}
        <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
          <WishlistButton productId={id} />
        </div>
        {/* Category badge */}
        {category && (
          <span className="absolute bottom-1 left-1 bg-white/90 text-teal-700 text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-medium border border-teal-100 backdrop-blur-sm">
            {category}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-1.5 sm:p-2 md:p-3 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-semibold text-gray-800 line-clamp-2 md:truncate mb-0.5 text-[10px] sm:text-xs md:text-sm leading-tight">
            {name}
          </h3>
          <p className="text-teal-700 font-bold text-xs sm:text-sm md:text-base mb-2">
            ₹{Number(price).toLocaleString('en-IN')}
          </p>
        </div>
        <Link
          to={`/products/${slug}`}
          className="block text-center w-full py-1 sm:py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-[10px] sm:text-xs font-semibold rounded-lg transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
}
