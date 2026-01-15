import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/axiosSetup";

export default function UserProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        setStatus("unauth");
        return;
      }

      try {
        await api.get("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStatus("auth");
      } catch (err) {
        localStorage.removeItem("accessToken");
        setStatus("unauth");
      }
    };

    checkAuth();
  }, []);

  if (status === "loading") return <p>Loading.....</p>;

  if (status !== "auth") return <Navigate to="/" replace />;

  // support both usage patterns: nested routes via <Outlet /> and wrapper with children
  return children ? children : <Outlet />;
}