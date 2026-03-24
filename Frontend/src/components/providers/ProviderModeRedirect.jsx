import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProviderModeRedirect({ children }) {
  const { loading, user } = useSelector((state) => state.user);

  if (loading) return null;

  if (user?.isProviderMode) {
    return <Navigate to="/provider" replace />;
  }

  return children || null;
}
