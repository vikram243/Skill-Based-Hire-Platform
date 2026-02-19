import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layout";
import ProtectedRoute from "./components/users/ProtectedWrapper";
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
const ChatPage = lazy(() => import("./pages/ChatPage"));

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
      { index: true, element: suspense(<LandingPage />) },
      { path: "how-it-works", element: suspense(<HowItWorksPage />) },
      { path: "safety", element: suspense(<SafetyPage />) },
      { path: "insurance", element: suspense(<InsurancePage />) },
      { path: "help", element: suspense(<HelpCenterPage />) },
      { path: "terms", element: suspense(<TermsPage />) },
      { path: "accessibility", element: suspense(<AccessibilityPage />) },
      { path: "cookie", element: suspense(<CookiePage />) },
      { path: "guarantee", element: suspense(<GuaranteePage />) },
      { path: "guidelines", element: suspense(<CommunityGuidelinesPage />) },
      { path: "privacy", element: suspense(<PrivacyPage />) },
      { path: "success-stories", element: suspense(<SuccessStoriesPage />) },

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

      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);
