import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import AdminLayout from '../layouts/AdminLayout';
import LoadingSpinner from '../components/LoadingSpinner';

export default function AdminRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner message="Checking authentication..." />;

  if (!user) return <Navigate to="/admin/login" replace />;

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
