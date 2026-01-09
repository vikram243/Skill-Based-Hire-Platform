import React from 'react';
// import { Button } from './components/ui/button';
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

  return (
   <BrowserRouter>
    <Routes>
      <Route path='/' element={<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}><LandingPage /></GoogleOAuthProvider>} />
    </Routes>
   </BrowserRouter>
  )
}

export default App