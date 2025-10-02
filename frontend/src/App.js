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
      <HomePageSEO />
      <Header />
      <Hero />
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardPreview />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<LoadingSpinner />}>
        <Support />
      </Suspense>
      <Footer />
    </div>
  );
};

function App() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring();
    
    // Register service worker for caching
    if (process.env.NODE_ENV === 'production') {
      registerSW();
    }
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ThemeProvider>
          <AuthProvider>
            <div className="App">
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route 
                    path="/login" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Login />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/register" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Register />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/forgot-password" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ForgotPassword />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/reset-password" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ResetPassword />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/verify-email" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <VerifyEmail />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="/dashboard/*" 
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <Dashboard />
                      </Suspense>
                    } 
                  />
                </Routes>
                <Toaster />
              </BrowserRouter>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;