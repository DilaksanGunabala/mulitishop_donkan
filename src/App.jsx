import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import ViewerLayout from './layouts/ViewerLayout';
import AdminRoutes from './routes/AdminRoutes';

// Lazy-loaded client pages
const Home = lazy(() => import('./pages/client/Home'));
const Products = lazy(() => import('./pages/client/Products'));
const ProductDetail = lazy(() => import('./pages/client/ProductDetail'));
const Contact = lazy(() => import('./pages/client/Contact'));
const CartPage = lazy(() => import('./pages/client/CartPage'));
const WishlistPage = lazy(() => import('./pages/client/WishlistPage'));
const CheckoutSuccess = lazy(() => import('./pages/client/CheckoutSuccess'));

// Lazy-loaded admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AddProduct = lazy(() => import('./pages/admin/AddProduct'));
const EditProduct = lazy(() => import('./pages/admin/EditProduct'));
const BulkUpload = lazy(() => import('./pages/admin/BulkUpload'));

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner message="Loading..." />}>
          <Routes>
            {/* Viewer / Public Routes */}
            <Route element={<ViewerLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
            </Route>

            {/* Admin Login (outside admin layout) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin/*" element={<AdminRoutes />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="products/add" element={<AddProduct />} />
              <Route path="products/edit/:id" element={<EditProduct />} />
              <Route path="bulk-upload" element={<BulkUpload />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
