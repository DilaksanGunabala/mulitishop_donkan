import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar (handles its own overlay internally) */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Mobile-only top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            aria-controls="admin-sidebar"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex items-center gap-1">
            <span className="text-base font-extrabold text-teal-600">New</span>
            <span className="text-base font-extrabold text-gray-800">Multi Shop</span>
            <span className="ml-1 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
}
