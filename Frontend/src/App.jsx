import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import LandingPage from './components/LandingPage';
import Navigation from './components/Navigation';
import HomeFeed from './components/HomeFeed';
import OrdersPage from './components/OrdersPage';
import HireFlow from './components/HireFlow';
import ProfilePage from './components/ProfilePage';
import SearchPage from './components/SearchPage';
import ProtectedRoute from './components/ProtectedWrapper';
import HowItWorksPage from './components/HowItWorks';
import { setUser, logoutUser, setLoading } from "./slices/userSlice";
import api from './lib/axiosSetup';

const App = () => {
  const [isAuthPanelOpen, setIsAuthPanelOpen] = useState(false);
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
      <Navigation setIsAuthPanelOpen = {setIsAuthPanelOpen} isAuthPanelOpen ={isAuthPanelOpen} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/how-it-works' element={<HowItWorksPage setIsAuthPanelOpen={setIsAuthPanelOpen} isAuthPanelOpen ={isAuthPanelOpen} />} />
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