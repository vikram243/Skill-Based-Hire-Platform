import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layout";
import ProtectedRoute from "./components/users/ProtectedWrapper";
import ProtectedWrapper from "./components/providers/ProtectedWrapper";
import FullPageLoader from "./components/ui/full-page-loader";

const LandingPage = lazy(() => import("./pages/users/LandingPage"));
const OrdersPage = lazy(() => import("./pages/users/OrdersPage"));
const HireFlow = lazy(() => import("./pages/users/HireFlow"));
const ProfilePage = lazy(() => import("./pages/users/ProfilePage"));
const SearchPage = lazy(() => import("./pages/users/SearchPage"));
const HowItWorksPage = lazy(() => import("./pages/users/HowItWorks"));
const SafetyPage = lazy(() => import("./pages/users/SafetyPage"));
const InsurancePage = lazy(() => import("./pages/users/InsurancePage"));
const HelpCenterPage = lazy(() => import("./pages/users/HelpCenterPage"));
const TermsPage = lazy(() => import("./pages/users/TermPage"));
const AccessibilityPage = lazy(() => import("./pages/users/AccessibilityPage"));
const CookiePage = lazy(() => import("./pages/users/CookiePage"));
const GuaranteePage = lazy(() => import("./pages/users/GuaranteePage"));
const CommunityGuidelinesPage = lazy(() => import("./pages/users/CommunityGuidelinesPage"));
const PrivacyPage = lazy(() => import("./pages/users/PrivacyPage"));
const SuccessStoriesPage = lazy(() => import("./pages/users/SuccessStoriesPage"));
const ProviderDashboard = lazy(() => import("./pages/providers/Dashboard"));
const ProviderLayout = lazy(() => import("./components/providers/ProviderLayout"));
const ProviderOrders = lazy(() => import("./pages/providers/Orders"));
const ProviderHistory = lazy(() => import("./pages/providers/History"));
const ProviderAnalytics = lazy(() => import("./pages/providers/Analytics"));
const ProviderReviews = lazy(() => import("./pages/providers/Reviews"));
const ProviderProfile = lazy(() => import("./pages/providers/Profile"));
const ProviderModeRedirect = lazy(() => import("./components/providers/ProviderModeRedirect"));
const ChatPage = lazy(() => import("./pages/users/ChatPage"));

const suspense = (node) => (
  <Suspense fallback={<FullPageLoader />}>
    {node}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: suspense(<ProviderModeRedirect>{suspense(<LandingPage />)}</ProviderModeRedirect>) },
      { path: "how-it-works", element: suspense(<ProviderModeRedirect>{suspense(<HowItWorksPage />)}</ProviderModeRedirect>) },
      { path: "safety", element: suspense(<ProviderModeRedirect>{suspense(<SafetyPage />)}</ProviderModeRedirect>) },
      { path: "insurance", element: suspense(<ProviderModeRedirect>{suspense(<InsurancePage />)}</ProviderModeRedirect>) },
      { path: "help", element: suspense(<ProviderModeRedirect>{suspense(<HelpCenterPage />)}</ProviderModeRedirect>) },
      { path: "terms", element: suspense(<ProviderModeRedirect>{suspense(<TermsPage />)}</ProviderModeRedirect>) },
      { path: "accessibility", element: suspense(<ProviderModeRedirect>{suspense(<AccessibilityPage />)}</ProviderModeRedirect>) },
      { path: "cookie", element: suspense(<ProviderModeRedirect>{suspense(<CookiePage />)}</ProviderModeRedirect>) },
      { path: "guarantee", element: suspense(<ProviderModeRedirect>{suspense(<GuaranteePage />)}</ProviderModeRedirect>) },
      { path: "guidelines", element: suspense(<ProviderModeRedirect>{suspense(<CommunityGuidelinesPage />)}</ProviderModeRedirect>) },
      { path: "privacy", element: suspense(<ProviderModeRedirect>{suspense(<PrivacyPage />)}</ProviderModeRedirect>) },
      { path: "success-stories", element: suspense(<ProviderModeRedirect>{suspense(<SuccessStoriesPage />)}</ProviderModeRedirect>) },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "orders", element: suspense(<OrdersPage />) },
          { path: "profile", element: suspense(<ProfilePage />) },
          { path: "search", element: suspense(<SearchPage />) },
          { path: "search/:providerId", element: suspense(<SearchPage />) },
          { path: "hire/:providerId", element: suspense(<HireFlow />) },
          { path: "chat", element: suspense(<ChatPage />) },
        ],
      },

      {
        path: "provider",
        element: <ProtectedWrapper />,
        children: [
          { index: true, element: <Navigate to="/provider/dashboard" replace /> },
          { path: "", element: suspense(<ProviderLayout />), children: [
              { path: "dashboard", element: suspense(<ProviderDashboard />) },
              { path: "orders", element: suspense(<ProviderOrders />) },
              { path: "history", element: suspense(<ProviderHistory />) },
              { path: "analytics", element: suspense(<ProviderAnalytics />) },
              { path: "reviews", element: suspense(<ProviderReviews />) },
              { path: "profile", element: suspense(<ProviderProfile />) },
            ]
          },
        ],
      },

      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);
