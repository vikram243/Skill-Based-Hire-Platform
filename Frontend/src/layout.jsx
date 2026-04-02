import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Navigation from "./components/users/Navigation";
import Footer from "./components/users/Footer";
import { useUI } from "./contexts/ui-context";
import ChatPage from "./pages/ChatPage";

const AuthPanel = lazy(() => import("./components/users/AuthPanel"));

const Layout = () => {
  const {
    setIsAuthPanelOpen,
    isDarkMode,
    toggleDarkMode,
    isAuthPanelOpen,
    searchQuery,
    setSearchQuery,
  } = useUI();

  const { pathname } = useLocation();
  const isProviderRoute = pathname.startsWith("/provider");
  const isChatRoute = pathname.startsWith("/chat");

  return (
    <>
      <ScrollRestoration />
      {!isProviderRoute && (
        <Navigation
          setIsAuthPanelOpen={setIsAuthPanelOpen}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <Outlet />

      {!isProviderRoute && <Footer />}

      <Suspense fallback={null}>
        {isAuthPanelOpen && (
          <AuthPanel
            isOpen={isAuthPanelOpen}
            onClose={() => setIsAuthPanelOpen(false)}
          />
        )}

      </Suspense>
    </>
  );
};

export default Layout;