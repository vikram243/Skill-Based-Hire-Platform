import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useSelector(
    (state) => state.user
  );

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return children ? children : <Outlet />;
}