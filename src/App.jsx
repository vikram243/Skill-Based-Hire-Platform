import React, { useState, useEffect } from 'react'
import { LandingPage } from './components/LandingPage.jsx'
import { AuthPage } from './components/AuthPage.jsx'
import { HomeFeed } from './components/HomeFeed.jsx'
import { SkillDetailPage } from './components/SkillDetailPage.jsx'
import { HireFlow } from './components/HireFlow.jsx'
import { OrdersPage } from './components/OrdersPage.jsx'
import { ProfilePage } from './components/ProfilePage.jsx'
import { RegisterProviderPage } from './components/RegisterProviderPage.jsx'
import { MapPage } from './components/MapPage.jsx'
import { CartPage } from './components/CartPage.jsx'
import { HistoryPage } from './components/HistoryPage.jsx'

export default function App() {
  const [appState, setAppState] = useState({
    currentPage: 'landing',
    isAuthenticated: false
  })

  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load dark mode preference from localStorage on mount
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Apply dark mode class to document and save preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

  const navigate = (page, data) => {
    setAppState(prev => ({
      ...prev,
      currentPage: page,
      ...data
    }))
  }

  const login = (user) => {
    setAppState(prev => ({
      ...prev,
      isAuthenticated: true,
      user,
      currentPage: 'home'
    }))
  }

  const logout = () => {
    setAppState({
      currentPage: 'landing',
      isAuthenticated: false
    })
  }

  const renderPage = () => {
    switch (appState.currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} onLogin={() => navigate('auth')} />
      case 'auth':
        return <AuthPage onLogin={login} onBack={() => navigate('landing')} />
      case 'home':
        return <HomeFeed onNavigate={navigate} user={appState.user} />
      case 'skill-detail':
        return (
          <SkillDetailPage 
            providerId={appState.selectedProviderId} 
            onNavigate={navigate}
            onBack={() => navigate('home')}
          />
        )
      case 'hire-flow':
        return (
          <HireFlow 
            providerId={appState.selectedProviderId}
            onComplete={() => navigate('orders')}
            onBack={() => navigate('skill-detail')}
          />
        )
      case 'orders':
        return <OrdersPage onNavigate={navigate} user={appState.user} />
      case 'history':
        return <HistoryPage onNavigate={navigate} user={appState.user} />
      case 'cart':
        return <CartPage onNavigate={navigate} user={appState.user} />
      case 'profile':
        return <ProfilePage onNavigate={navigate} user={appState.user} onLogout={logout} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      case 'register-provider':
        return <RegisterProviderPage onNavigate={navigate} onBack={() => navigate('profile')} />
      case 'map':
        return <MapPage onNavigate={navigate} onBack={() => navigate('home')} />
      default:
        return <LandingPage onNavigate={navigate} onLogin={() => navigate('auth')} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {renderPage()}
    </div>
  )
}
