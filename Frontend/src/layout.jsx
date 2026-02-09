import { Outlet, ScrollRestoration } from "react-router-dom";
import Navigation from "./components/users/Navigation";
import Footer from "./components/users/Footer";
import AuthPanel from "./components/users/AuthPanel";

const Layout = ({
  setIsAuthPanelOpen,
  isDarkMode,
  toggleDarkMode,
  isAuthPanelOpen
  , searchQuery, setSearchQuery
}) => {
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

      <Footer setIsAuthPanelOpen={setIsAuthPanelOpen} />

      <AuthPanel
        isOpen={isAuthPanelOpen}
        onClose={() => setIsAuthPanelOpen(false)}
      />
    </>
  );
};

export default Layout;