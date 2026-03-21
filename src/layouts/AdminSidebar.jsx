import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FiGrid,
  FiPackage,
  FiPlusCircle,
  FiUploadCloud,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import { logOut } from '../services/authService';
import { toast } from 'react-toastify';

const links = [
  { to: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
  { to: '/admin/products', icon: FiPackage, label: 'Products' },
  { to: '/admin/products/add', icon: FiPlusCircle, label: 'Add Product' },
  { to: '/admin/bulk-upload', icon: FiUploadCloud, label: 'Bulk Upload' },
];

export default function AdminSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success('Logged out');
      navigate('/admin/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  return (
    <>
      {/* Mobile overlay backdrop */}
      <div
        className={`fixed inset-0 z-20 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-0 left-0 z-30 h-full w-64
          bg-white border-r border-gray-100 shadow-xl
          flex flex-col flex-shrink-0
          transition-transform duration-300 ease-in-out
          md:static md:z-auto md:w-60 md:shadow-sm md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-lg font-extrabold text-teal-600">New</span>
            <span className="text-lg font-extrabold text-gray-800">Multi Shop</span>
            <span className="ml-1 text-[11px] text-gray-400 font-normal bg-gray-100 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-semibold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <FiLogOut size={17} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
