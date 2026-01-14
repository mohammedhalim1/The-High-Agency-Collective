import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { lazy, Suspense } from "react";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";
import Home from "./pages/Home";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import PageSkeleton from "./components/PageSkeleton";

// Lazy load non-critical pages
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Contact = lazy(() => import("./pages/Contact"));
const Transform = lazy(() => import("./pages/Transform"));
const TermsConditions = lazy(() => import("./pages/TermsConditions"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));

// Lazy load admin components
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const HomeEditor = lazy(() => import("./components/admin/HomeEditor"));
const AboutEditor = lazy(() => import("./components/admin/AboutEditor"));
const ServicesEditor = lazy(() => import("./components/admin/ServicesEditor"));
const ContactEditor = lazy(() => import("./components/admin/ContactEditor"));
const TransformEditor = lazy(() => import("./components/admin/TransformEditor"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // ZERO caching - always fetch fresh data
      staleTime: 0,
      gcTime: 0, // Previously cacheTime, now gcTime in v5
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchInterval: false, // Don't auto-refetch on interval
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Loading component for lazy loaded pages
const PageLoader = () => <PageSkeleton />;

const App = () => {
  // Load Google Analytics automatically if configured
  useGoogleAnalytics();

  return (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Home />
                <Footer />
              </div>
            } />
            <Route path="/about" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Suspense fallback={<PageLoader />}>
                  <About />
                </Suspense>
                <Footer />
              </div>
            } />
            <Route path="/services" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Suspense fallback={<PageLoader />}>
                  <Services />
                </Suspense>
                <Footer />
              </div>
            } />
            <Route path="/contact" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Suspense fallback={<PageLoader />}>
                  <Contact />
                </Suspense>
                <Footer />
              </div>
            } />
            <Route path="/transform" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Suspense fallback={<PageLoader />}>
                  <Transform />
                </Suspense>
                <Footer />
              </div>
            } />
            <Route path="/terms-conditions" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Suspense fallback={<PageLoader />}>
                  <TermsConditions />
                </Suspense>
                <Footer />
              </div>
            } />
            <Route path="/privacy-policy" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Suspense fallback={<PageLoader />}>
                  <PrivacyPolicy />
                </Suspense>
                <Footer />
              </div>
            } />
            <Route path="/refund-policy" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Suspense fallback={<PageLoader />}>
                  <RefundPolicy />
                </Suspense>
                <Footer />
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <Suspense fallback={<PageLoader />}>
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              </Suspense>
            }>
              <Route index element={
                <Suspense fallback={<PageLoader />}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="home" element={
                <Suspense fallback={<PageLoader />}>
                  <HomeEditor />
                </Suspense>
              } />
              <Route path="about" element={
                <Suspense fallback={<PageLoader />}>
                  <AboutEditor />
                </Suspense>
              } />
              <Route path="services" element={
                <Suspense fallback={<PageLoader />}>
                  <ServicesEditor />
                </Suspense>
              } />
              <Route path="contact" element={
                <Suspense fallback={<PageLoader />}>
                  <ContactEditor />
                </Suspense>
              } />
              <Route path="transform" element={
                <Suspense fallback={<PageLoader />}>
                  <TransformEditor />
                </Suspense>
              } />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
