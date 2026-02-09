import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { useDispatch } from "react-redux";
import { setUser, logoutUser, setLoading } from "./slices/userSlice";
import api from "./lib/axiosSetup";

const App = () => {
  const dispatch = useDispatch();
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);

  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        return JSON.parse(savedTheme);
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) {
      console.warn("Error getting initial theme", e);
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
        console.warn("Error verifying auth", err);
      }
    };

    verifyAuth();
  }, [dispatch]);

  return (
    <RouterProvider
      router={router({
        setIsAuthPanelOpen,
        isDarkMode,
        toggleDarkMode,
        isAuthPanelOpen,
      })}
    />
  );
};

export default App;