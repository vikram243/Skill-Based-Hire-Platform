import React,{useState,useEffect} from 'react';
// import { Button } from './components/ui/button';
import { Route, Routes } from 'react-router-dom';
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
import UserProtectedWrapper from './pages/UserProtectedWrapper';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }
  }, []);

  // Apply dark mode class to document and save preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
      <Routes>
        <Route path='/' element={<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}><LandingPage /></GoogleOAuthProvider>} />
        <Route path='/home' element={<UserProtectedWrapper><HomeFeed /></UserProtectedWrapper>} />
        <Route path='/profile' element={<UserProtectedWrapper><ProfilePage onToggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} /></UserProtectedWrapper>} />
      </Routes>
  )
}

export default App