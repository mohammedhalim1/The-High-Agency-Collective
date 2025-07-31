import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { networkMonitor } from "@/utils/networkMonitor";
import { AuthProvider } from "@/lib/auth";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Transform from "./pages/Transform";
import TermsConditions from "./pages/TermsConditions";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import HomeEditor from "./components/admin/HomeEditor";
import AboutEditor from "./components/admin/AboutEditor";
import ServicesEditor from "./components/admin/ServicesEditor";
import ContactEditor from "./components/admin/ContactEditor";
import TransformEditor from "./components/admin/TransformEditor";
import ProtectedRoute from "./components/admin/ProtectedRoute";

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

const App = () => (
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
                <About />
                <Footer />
              </div>
            } />
            <Route path="/services" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Services />
                <Footer />
              </div>
            } />
            <Route path="/contact" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Contact />
                <Footer />
              </div>
            } />
            <Route path="/transform" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <Transform />
                <Footer />
              </div>
            } />
            <Route path="/terms-conditions" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <TermsConditions />
                <Footer />
              </div>
            } />
            <Route path="/privacy-policy" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <PrivacyPolicy />
                <Footer />
              </div>
            } />
            <Route path="/refund-policy" element={
              <div className="min-h-screen bg-background">
                <Navigation />
                <RefundPolicy />
                <Footer />
              </div>
            } />

            {/* Admin Routes */}
                        <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
                                          <Route index element={<Dashboard />} />
              <Route path="home" element={<HomeEditor />} />
              <Route path="about" element={<AboutEditor />} />
              <Route path="services" element={<ServicesEditor />} />
              <Route path="contact" element={<ContactEditor />} />
              <Route path="transform" element={<TransformEditor />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
