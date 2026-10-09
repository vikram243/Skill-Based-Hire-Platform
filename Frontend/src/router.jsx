import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "./layout";
import ProtectedRoute from "./components/users/ProtectedWrapper";
import ProtectedWrapper from "./components/providers/ProtectedWrapper";
import FullPageLoader from "./components/ui/full-page-loader";

// User Pages
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
const ContactPage = lazy(() => import("./pages/users/ContactPage"));
const AboutPage = lazy(() => import("./pages/users/AboutPage"));
const FAQPage = lazy(() => import("./pages/users/FAQPage"));
const RefundPolicyPage = lazy(() => import("./pages/users/RefundPolicyPage"));
const ServicesPage = lazy(() => import("./pages/users/ServicesPage"));
const BlogPage = lazy(() => import("./pages/users/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/users/BlogPostPage"));
const ProviderDetailPage = lazy(() => import("./pages/users/ProviderDetailPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));

// Provider Pages
const ProviderDashboard = lazy(() => import("./pages/providers/Dashboard"));
const ProviderLayout = lazy(() => import("./components/providers/ProviderLayout"));
const ProviderServices = lazy(() => import("./pages/providers/Services"));
const ProviderEarnings = lazy(() => import("./pages/providers/Earnings"));
const ProviderOrders = lazy(() => import("./pages/providers/Orders"));
const ProviderHistory = lazy(() => import("./pages/providers/History"));
const ProviderAnalytics = lazy(() => import("./pages/providers/Analytics"));
const ProviderReviews = lazy(() => import("./pages/providers/Reviews"));
const ProviderProfile = lazy(() => import("./pages/providers/Profile"));
const ProviderModeRedirect = lazy(() => import("./components/providers/ProviderModeRedirect"));

// Admin Panel Lazy Components
const AdminProtectedWrapper = lazy(() => import("./components/admin/AdminProtectedWrapper"));
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProviders = lazy(() => import("./pages/admin/AdminProviders"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminActivities = lazy(() => import("./pages/admin/AdminActivities"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));

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
      // Public Informational & Marketplace Routes
      { index: true, element: suspense(<ProviderModeRedirect>{suspense(<LandingPage />)}</ProviderModeRedirect>) },
      { path: "search", element: suspense(<SearchPage />) },
      { path: "search/:providerId", element: suspense(<SearchPage />) },
      { path: "services", element: suspense(<ServicesPage />) },
      { path: "categories", element: suspense(<ServicesPage />) },
      { path: "providers/:providerId", element: suspense(<ProviderDetailPage />) },
      { path: "how-it-works", element: suspense(<ProviderModeRedirect>{suspense(<HowItWorksPage />)}</ProviderModeRedirect>) },
      { path: "about", element: suspense(<AboutPage />) },
      { path: "contact", element: suspense(<ContactPage />) },
      { path: "faq", element: suspense(<FAQPage />) },
      { path: "refund-policy", element: suspense(<RefundPolicyPage />) },
      { path: "blog", element: suspense(<BlogPage />) },
      { path: "blog/:slug", element: suspense(<BlogPostPage />) },
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

      // Protected User Routes (Require Account Login)
      {
        element: <ProtectedRoute />,
        children: [
          { path: "orders", element: suspense(<OrdersPage />) },
          { path: "profile", element: suspense(<ProfilePage />) },
          { path: "hire/:providerId", element: suspense(<HireFlow />) },
          { path: "chat", element: suspense(<ChatPage />) },
        ],
      },

      // Provider Panel Routes (Requires Verified Provider Mode)
      {
        path: "provider",
        element: <ProtectedWrapper />,
        children: [
          { index: true, element: <Navigate to="/provider/dashboard" replace /> },
          {
            path: "",
            element: suspense(<ProviderLayout />),
            children: [
              { path: "dashboard", element: suspense(<ProviderDashboard />) },
              { path: "services", element: suspense(<ProviderServices />) },
              { path: "earnings", element: suspense(<ProviderEarnings />) },
              { path: "orders", element: suspense(<ProviderOrders />) },
              { path: "history", element: suspense(<ProviderHistory />) },
              { path: "analytics", element: suspense(<ProviderAnalytics />) },
              { path: "reviews", element: suspense(<ProviderReviews />) },
              { path: "profile", element: suspense(<ProviderProfile />) },
            ],
          },
        ],
      },

      // Admin Console
      { path: "admin-login", element: suspense(<AdminLoginPage />) },
      {
        path: "admin",
        element: suspense(<AdminProtectedWrapper />),
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          {
            path: "",
            element: suspense(<AdminLayout />),
            children: [
              { path: "dashboard", element: suspense(<AdminDashboard />) },
              { path: "services", element: suspense(<AdminServices />) },
              { path: "providers", element: suspense(<AdminProviders />) },
              { path: "users", element: suspense(<AdminUsers />) },
              { path: "orders", element: suspense(<AdminOrders />) },
              { path: "reviews", element: suspense(<AdminReviews />) },
              { path: "activities", element: suspense(<AdminActivities />) },
            ],
          },
        ],
      },

      { path: "*", element: <Navigate to="/" /> },
    ],
  },
]);
