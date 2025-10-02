import React, { Suspense, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "./components/ui/toaster";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";

// Performance monitoring
import { initPerformanceMonitoring } from "./utils/performance";
import { registerSW } from "./utils/serviceWorker";

// SEO Components
import { HomePageSEO } from "./components/SEO/SEOHead";

// Static components (loaded immediately)
import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

// Lazy-loaded components for better performance
import { 
  DashboardPreview, 
  Pricing, 
  Support,
  Login,
  Register
} from "./components/LazyComponents";

// Lazy load heavy components
const ForgotPassword = React.lazy(() => import("./components/auth/ForgotPassword"));
const ResetPassword = React.lazy(() => import("./components/auth/ResetPassword"));
const VerifyEmail = React.lazy(() => import("./components/auth/VerifyEmail"));
const Dashboard = React.lazy(() => import("./components/dashboard/Dashboard"));

const Home = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Header />
      <Hero />
      <DashboardPreview />
      <Pricing />
      <Support />
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;