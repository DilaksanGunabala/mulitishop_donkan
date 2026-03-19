import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiPlusCircle, FiUploadCloud } from 'react-icons/fi';
import { getProducts } from '../../services/productService';
import AdminAnalytics from '../../components/AdminAnalytics';

const CATEGORIES = ['Fancy', 'Stationary', 'Baby Needs', 'Plastic Items', 'Others'];

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const catCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = products.filter((p) => p.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <StatCard label="Total Products" value={products.length} icon={FiPackage} color="teal" />
            {CATEGORIES.map((cat) => (
              <StatCard key={cat} label={cat} value={catCounts[cat]} icon={FiPackage} color="gray" />
            ))}
          </>
        )}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Products Added by Month</h2>
        {loading ? (
          <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
        ) : (
          <AdminAnalytics products={products} />
        )}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 text-sm font-medium transition-colors"
          >
            <FiPackage size={16} /> View Products
          </Link>
          <Link
            to="/admin/products/add"
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 text-sm font-medium transition-colors"
          >
            <FiPlusCircle size={16} /> Add Product
          </Link>
          <Link
            to="/admin/bulk-upload"
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 text-sm font-medium transition-colors"
          >
            <FiUploadCloud size={16} /> Bulk Upload
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }) {
  const colors = {
    teal: 'bg-teal-50 text-teal-600',
    gray: 'bg-gray-100 text-gray-500',
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color] || colors.gray}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-gray-100" />
      <div className="space-y-2 flex-1">
        <div className="h-6 bg-gray-100 rounded w-12" />
        <div className="h-3 bg-gray-100 rounded w-20" />
      </div>
    </div>
  );
}
