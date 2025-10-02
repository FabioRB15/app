/**
 * Lazy-loaded components for better performance
 * Code splitting reduces initial bundle size
 */
import { lazy } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy load heavy components
export const DashboardPreview = lazy(() => import('./DashboardPreview'));
export const Pricing = lazy(() => import('./Pricing'));
export const Support = lazy(() => import('./Support'));

// Auth components
export const Login = lazy(() => import('./auth/Login'));
export const Register = lazy(() => import('./auth/Register'));

// Dashboard components
export const ServerManagement = lazy(() => import('./dashboard/ServerManagement'));
export const Analytics = lazy(() => import('./dashboard/Analytics'));

// Wrapper component for lazy components with loading fallback
export const LazyWrapper = ({ children, fallback = <LoadingSpinner /> }) => {
  return (
    <div className="min-h-[200px] flex items-center justify-center">
      {children}
    </div>
  );
};

// Higher-order component for lazy loading with error boundary
export const withLazyLoading = (LazyComponent, fallbackComponent = LoadingSpinner) => {
  return (props) => (
    <LazyWrapper fallback={<fallbackComponent />}>
      <LazyComponent {...props} />
    </LazyWrapper>
  );
};