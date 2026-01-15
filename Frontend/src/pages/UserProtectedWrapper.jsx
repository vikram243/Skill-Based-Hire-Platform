import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../lib/axiosSetup";

export default function UserProtectedWrapper() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuth(false);
      return;
    }

    // Verify token with backend
    api
      .get("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => setIsAuth(true))
      .catch(() => {
        localStorage.removeItem("token");
        setIsAuth(false);
      });
  }, []);

  if (isAuth === null) return <p>Checking authentication...</p>;

  return isAuth ? <Outlet /> : <Navigate to="/" replace />;
}