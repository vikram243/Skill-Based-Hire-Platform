import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, loading, user } = useSelector(
    (state) => state.user
  );

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  if (user?.isProviderMode) {
    return <Navigate to="/provider/dashboard" replace state={{ from: location }} />;
  }

  return children ? children : <Outlet />;
}