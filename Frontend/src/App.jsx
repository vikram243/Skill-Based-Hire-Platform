import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import HomeFeed from './components/HomeFeed';
import AuthPanel from './components/AuthPanel'
import OrdersPage from './components/OrdersPage';
import SkillCard from './components/SkillCard';
import HireFlow from './components/HireFlow';
import ProfilePage from './components/ProfilePage';
import SearchPage from './components/SearchPage';
import SkillDetailPage from './components/SkillDetailPage';
import RegisterProviderPage from './components/RegisterProviderPage';
import ProtectedRoute from './components/ProtectedWrapper';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { setUser, logoutUser, setLoading } from "./slices/userSlice";
import api from './lib/axiosSetup';

const App = () => {
  const dispatch = useDispatch();

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
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}> <Navigation isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} /> </GoogleOAuthProvider>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/home' element={<HomeFeed />} />
          <Route path='/orders' element={<OrdersPage />} />
          <Route path='/hire/:skillId' element={<HireFlow />} />
          <Route path='/profile' element={<ProfilePage isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='*' element={<Navigate to='/home' />} />
        </Route>
      </Routes>
    </>
  )
}

export default App