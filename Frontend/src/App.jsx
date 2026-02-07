import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import LandingPage from './pages/users/LandingPage';
import Navigation from './components/users/Navigation';
import OrdersPage from './pages/users/OrdersPage';
import HireFlow from './pages/users/HireFlow';
import ProfilePage from './pages/users/ProfilePage';
import SearchPage from './pages/users/SearchPage';
import ProtectedRoute from './components/users/ProtectedWrapper';
import HowItWorksPage from './pages/users/HowItWorks';
import SafetyPage from './pages/users/SafetyPage';
import InsurancePage from './pages/users/InsurancePage';
import HelpCenterPage from './pages/users/HelpCenterPage';
import TermsPage from './pages/users/TermPage';
import AccessibilityPage from './pages/users/AccessibilityPage';
import CookiePage from './pages/users/CookiePage';
import GuaranteePage from './pages/users/GuaranteePage';
import CommunityGuidelinesPage from './pages/users/CommunityGuidelinesPage';
import PrivacyPage from './pages/users/PrivacyPage';
import { setUser, logoutUser, setLoading } from "./slices/userSlice";
import api from './lib/axiosSetup';
import AuthPanel from './components/users/AuthPanel';
import Footer from './components/users/Footer';

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
      <Navigation setIsAuthPanelOpen = {setIsAuthPanelOpen} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route path='/' element={<LandingPage setIsAuthPanelOpen={setIsAuthPanelOpen} />} />
        <Route path='/how-it-works' element={<HowItWorksPage setIsAuthPanelOpen={setIsAuthPanelOpen} />} />
        <Route path='/safety' element={<SafetyPage setIsAuthPanelOpen={setIsAuthPanelOpen} />} />
        <Route path ='/insurance' element ={<InsurancePage />} />
        <Route path ='/help' element ={<HelpCenterPage/>} />
        <Route path ='/terms' element ={<TermsPage/>} />
        <Route path ='/accessibility' element ={<AccessibilityPage/>} />
        <Route path ='/cookie' element ={<CookiePage />} />
        <Route path ='/guarantee' element ={<GuaranteePage />} />
        <Route path ='/guidelines' element ={<CommunityGuidelinesPage />} />
        <Route path ='/privacy' element ={<PrivacyPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/orders' element={<OrdersPage />} />
          <Route path='/hire/:skillId' element={<HireFlow />} />
          <Route path='/profile' element={<ProfilePage isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='*' element={<Navigate to='/' />} />
        </Route>
      </Routes>
      <Footer setIsAuthPanelOpen = {setIsAuthPanelOpen} />
      <AuthPanel
        isOpen={isAuthPanelOpen}
        onClose={() => setIsAuthPanelOpen(false)}
      />
    </>
  )
}

export default App