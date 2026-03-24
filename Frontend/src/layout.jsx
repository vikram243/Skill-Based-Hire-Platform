import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import React, { Suspense, lazy, use } from "react";
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
  const { pathname } = useLocation();
const isChatPage = pathname === "/chat";


  return (
    <>
      <ScrollRestoration />
      {!isChatPage && (
        <Navigation
        setIsAuthPanelOpen={setIsAuthPanelOpen}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      )}
      

      <Outlet />

      {!isChatPage && <Footer />}

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