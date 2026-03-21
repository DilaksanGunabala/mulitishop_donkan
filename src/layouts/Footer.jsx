import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xl font-extrabold text-teal-400">New</span>
            <span className="text-xl font-extrabold text-white">Multi Shop</span>
          </div>
          <p className="text-sm leading-relaxed text-gray-400 max-w-xs">
            Your one-stop destination for quality products — fancy items, stationery, and more.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-gray-200 font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
            <li><Link to="/products" className="hover:text-teal-400 transition-colors">Products</Link></li>
            <li><Link to="/cart" className="hover:text-teal-400 transition-colors">Cart</Link></li>
            <li><Link to="/contact" className="hover:text-teal-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-gray-200 font-semibold mb-4">Categories</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/products?category=Fancy" className="hover:text-teal-400 transition-colors">Fancy</Link></li>
            <li><Link to="/products?category=Stationary" className="hover:text-teal-400 transition-colors">Stationary</Link></li>
            <li><Link to="/products?category=Baby Needs" className="hover:text-teal-400 transition-colors">Baby Needs</Link></li>
            <li><Link to="/products?category=Plastic Items" className="hover:text-teal-400 transition-colors">Plastic Items</Link></li>
            <li><Link to="/products?category=Others" className="hover:text-teal-400 transition-colors">Others</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} New Multi Shop. All rights reserved. Created By codeglofix.pvt.ltd
      </div>
    </footer>
  );
}
