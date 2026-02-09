import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layout";
import ProtectedRoute from "./components/users/ProtectedWrapper";
import LandingPage from "./pages/users/LandingPage";
import OrdersPage from "./pages/users/OrdersPage";
import HireFlow from "./pages/users/HireFlow";
import ProfilePage from "./pages/users/ProfilePage";
import SearchPage from "./pages/users/SearchPage";
import HowItWorksPage from "./pages/users/HowItWorks";
import SafetyPage from "./pages/users/SafetyPage";
import InsurancePage from "./pages/users/InsurancePage";
import HelpCenterPage from "./pages/users/HelpCenterPage";
import TermsPage from "./pages/users/TermPage";
import AccessibilityPage from "./pages/users/AccessibilityPage";
import CookiePage from "./pages/users/CookiePage";
import GuaranteePage from "./pages/users/GuaranteePage";
import CommunityGuidelinesPage from "./pages/users/CommunityGuidelinesPage";
import PrivacyPage from "./pages/users/PrivacyPage";
import SuccessStoriesPage from "./pages/users/SuccessStoriesPage";

export const router = ({
  setIsAuthPanelOpen,
  isDarkMode,
  toggleDarkMode,
  isAuthPanelOpen,
  searchQuery,
  setSearchQuery,
}) =>
  createBrowserRouter([
    {
      path: "/",
      element: (
        <Layout
          setIsAuthPanelOpen={setIsAuthPanelOpen}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
          isAuthPanelOpen={isAuthPanelOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      ),
      children: [
        { index: true, element: <LandingPage setIsAuthPanelOpen={setIsAuthPanelOpen} searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> },
        { path: "how-it-works", element: <HowItWorksPage setIsAuthPanelOpen={setIsAuthPanelOpen} /> },
        { path: "safety", element: <SafetyPage setIsAuthPanelOpen={setIsAuthPanelOpen} /> },
        { path: "insurance", element: <InsurancePage /> },
        { path: "help", element: <HelpCenterPage /> },
        { path: "terms", element: <TermsPage /> },
        { path: "accessibility", element: <AccessibilityPage /> },
        { path: "cookie", element: <CookiePage /> },
        { path: "guarantee", element: <GuaranteePage /> },
        { path: "guidelines", element: <CommunityGuidelinesPage /> },
        { path: "privacy", element: <PrivacyPage /> },
        { path: "success-stories", element: <SuccessStoriesPage setIsAuthPanelOpen={setIsAuthPanelOpen} /> },

        {
          element: <ProtectedRoute />,
          children: [
            { path: "orders", element: <OrdersPage /> },
            { path: "hire/:skillId", element: <HireFlow /> },
            { path: "profile", element: <ProfilePage isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} /> },
            { path: "search", element: <SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> },
            { path: "search/:providerId", element: <SearchPage searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> },
          ],
        },

        { path: "*", element: <Navigate to="/" /> },
      ],
    },
  ]);
