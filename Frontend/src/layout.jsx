import { Outlet, ScrollRestoration } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Navigation from "./components/users/Navigation";
import Footer from "./components/users/Footer";
import { useUI } from "./contexts/ui-context";

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

  return (
    <>
      <ScrollRestoration />
      <Navigation
        setIsAuthPanelOpen={setIsAuthPanelOpen}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <Outlet />

      {location.pathname !== "/chat" && <Footer />}

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