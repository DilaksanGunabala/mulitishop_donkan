import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/SearchBar';
import CategoryFilter from '../../components/CategoryFilter';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { products, loading, error } = useProducts(search, category);

  return (
    <>
      <Helmet>
        <title>Products — New Multi Shop</title>
        <meta name="description" content="Browse all products at New Multi Shop — fancy items, stationery, and more." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">All Products</h1>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 max-w-sm">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <CategoryFilter selected={category} onChange={setCategory} />
        </div>

        {/* Grid */}
        {loading ? (
          <LoadingSpinner message="Loading products..." />
        ) : error ? (
          <p className="text-red-500 text-center py-12">{error}</p>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No products found</p>
            {(search || category !== 'All') && (
              <button
                onClick={() => { setSearch(''); setCategory('All'); }}
                className="mt-3 text-blue-600 hover:underline text-sm"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
