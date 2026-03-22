import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getProductsLive } from '../../services/productService';
import ProductCard from '../../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductsLive()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Featured products (marked by admin) — shown first
  const featured = products.filter((p) => p.featured).slice(0, 8);
  // Recent products — all latest additions regardless of featured flag
  const recent = products.slice(0, 8);
  // Show featured if any exist, otherwise show recent
  const showProducts = featured.length > 0 ? featured : recent;
  const sectionTitle = featured.length > 0 ? 'Featured Products' : 'New Arrivals';

  return (
    <>
      <Helmet>
        <title>New Multi Shop — Quality Products Online</title>
        <meta name="description" content="Shop the best fancy items, stationery, baby needs, plastic items, and more at New Multi Shop." />
        <meta property="og:title" content="New Multi Shop — Quality Products Online" />
        <meta property="og:description" content="Shop the best fancy items, stationery, baby needs, plastic items, and more at New Multi Shop." />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-cyan-50">
        <div className="pointer-events-none absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-teal-100/60 -translate-y-1/3 translate-x-1/3 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-72 rounded-full bg-cyan-100/50 translate-y-1/3 -translate-x-1/4 blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 flex flex-col items-center text-center gap-5">
          <span className="inline-flex items-center px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full uppercase tracking-widest">
            New Arrivals Every Week
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-800 leading-tight max-w-3xl">
            Everything You Need,{' '}
            <span className="text-teal-600">All in One Place</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-lg leading-relaxed">
            Fancy items, stationery, baby needs, plastic items &amp; more — carefully curated for everyday joy.
          </p>
          <div className="flex gap-3 flex-wrap justify-center mt-1">
            <Link
              to="/products"
              className="px-7 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors shadow-md shadow-teal-200"
            >
              Shop Now
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3 bg-white text-gray-600 font-semibold rounded-xl border border-gray-200 hover:border-teal-300 hover:text-teal-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Category chips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-2">
        <div className="flex flex-wrap gap-3 justify-center">
          {['Fancy', 'Stationary', 'Baby Needs', 'Plastic Items', 'Others'].map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="px-5 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-colors shadow-sm"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Products section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{sectionTitle}</h2>
          <Link to="/products" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-2 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-6 bg-gray-100 rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        ) : showProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p>No products added yet.</p>
            <Link to="/contact" className="text-teal-600 hover:underline text-sm mt-2 inline-block">
              Contact us
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {showProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
