/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logoutUser, setLoading } from "./slices/userSlice";
import api from "./lib/axiosSetup";
import FullPageLoader from "./components/ui/full-page-loader";
import { UIProvider } from "./contexts/ui-context";
import Toaster from "./components/ui/sonner";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
  const verifyAuth = async () => {
    dispatch(setLoading(true));

    let token = localStorage.getItem("accessToken");

    try {
      // 🔥 STEP 1: agar token nahi hai → refresh try karo
      if (!token) {
        const refreshRes = await api.post("/api/users/refresh");
        const newToken = refreshRes?.data?.data?.accessToken;

        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          token = newToken;
        } else {
          throw new Error("No token from refresh");
        }
      }

      // 🔥 STEP 2: verify user
      const res = await api.get("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(setUser(res?.data?.data?.user));
    } catch (err) {
      console.log("Auth failed:", err);
      localStorage.removeItem("accessToken");
      dispatch(logoutUser());
    } finally {
      dispatch(setLoading(false));
    }
  };

  verifyAuth();
}, [dispatch]);

  useEffect(() => {
    const isEditableTarget = (target) => {
      const el = target;
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      return tag === "input" || tag === "textarea" || tag === "select" || el.isContentEditable;
    };

    const preventIfNotEditable = (e) => {
      if (isEditableTarget(e.target)) return;
      e.preventDefault();
    };

    const preventCopyCutKeys = (e) => {
      if (isEditableTarget(e.target)) return;
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = (e.key || "").toLowerCase();
      if (key === "c" || key === "x") {
        e.preventDefault();
      }
    };

    document.addEventListener("copy", preventIfNotEditable);
    document.addEventListener("cut", preventIfNotEditable);
    document.addEventListener("contextmenu", preventIfNotEditable);
    document.addEventListener("keydown", preventCopyCutKeys);

    return () => {
      document.removeEventListener("copy", preventIfNotEditable);
      document.removeEventListener("cut", preventIfNotEditable);
      document.removeEventListener("contextmenu", preventIfNotEditable);
      document.removeEventListener("keydown", preventCopyCutKeys);
    };
  }, []);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <UIProvider>
      <RouterProvider router={router} />
      <Toaster richColors closeButton position="top-center" />
    </UIProvider>
  );
};

export default App;
