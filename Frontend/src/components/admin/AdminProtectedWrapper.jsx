import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FullPageLoader from '../ui/full-page-loader';

export default function AdminProtectedWrapper({ children }) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);

  if (loading) {
    return <FullPageLoader />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }

  const isAdminUser = Boolean(user?.isAdmin || user?.role === 'admin');

  if (!isAdminUser) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-4 text-2xl font-bold border border-red-500/20">
          ⚠️
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
        <p className="text-muted-foreground max-w-md mb-6">
          You are signed in as <strong className="text-foreground">{user?.email}</strong>, which does not have administrative privileges.
        </p>
        <div className="flex gap-3">
          <a
            href="/"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Back to Marketplace
          </a>
          <a
            href="/admin-login"
            className="px-4 py-2 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-colors"
          >
            Switch to Admin Account
          </a>
        </div>
      </div>
    );
  }

  return children ? children : <Outlet />;
}
