import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHeart } from 'react-icons/fi';
import { useWishlistContext } from '../../context/WishlistContext';
import { getProductById } from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function WishlistPage() {
  const { wishlist } = useWishlistContext();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (wishlist.length === 0) {
      setProducts([]);
      return;
    }
    setLoading(true);
    Promise.all(wishlist.map((id) => getProductById(id)))
      .then((results) => setProducts(results.filter(Boolean)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [wishlist]);

  return (
    <>
      <Helmet>
        <title>Wishlist — New Multi Shop</title>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Wishlist ({wishlist.length})
        </h1>

        {loading ? (
          <LoadingSpinner message="Loading wishlist..." />
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <FiHeart size={56} className="mx-auto text-gray-300" />
            <p className="text-xl text-gray-400">Your wishlist is empty</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
