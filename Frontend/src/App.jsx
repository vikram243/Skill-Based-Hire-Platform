import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
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
import { GoogleOAuthProvider } from '@react-oauth/google';

const App = () => {
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        return JSON.parse(savedTheme);
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (e) {
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}><LandingPage /></GoogleOAuthProvider>} />
        <Route path='/home' element={<HomeFeed />} />
        <Route path='/orders' element={<OrdersPage />} />
        <Route path='/hire/:skillId' element={<HireFlow />} />
        <Route path='/profile' element={<ProfilePage isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='*' element={<Navigate to='/home' />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App