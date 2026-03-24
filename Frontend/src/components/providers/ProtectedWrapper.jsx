import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProviderProtectedWrapper({ children }) {
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);

  if (loading) return <p>Loading...</p>;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const isApprovedProvider = Boolean(
    user?.providerStatus === "approved" && user?.isProvider === true,
  );

  if (!isApprovedProvider) return <Navigate to="/" replace />;
  if (!user?.isProviderMode) return <Navigate to="/" replace />;

  return children ? children : <Outlet />;
}
