/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logoutUser, setLoading } from "./slices/userSlice";
import api from "./lib/axiosSetup";
import FullPageLoader from "./components/ui/full-page-loader";

const App = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        return JSON.parse(savedTheme);
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
      return false;
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  useEffect(() => {
    const verifyAuth = async () => {
      dispatch(setLoading(true));

      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch(logoutUser());
        dispatch(setLoading(false));
        return;
      }

      try {
        const res = await api.get("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(setUser(res?.data?.data?.user));
      } catch (err) {
        localStorage.removeItem("accessToken");
        dispatch(logoutUser());
      } finally {
        dispatch(setLoading(false));
      }
    };

    verifyAuth();
  }, [dispatch]);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <RouterProvider
      router={router({
        setIsAuthPanelOpen,
        isDarkMode,
        toggleDarkMode,
        isAuthPanelOpen,
        searchQuery,
        setSearchQuery,
      })}
    />
  );
};

export default App;
