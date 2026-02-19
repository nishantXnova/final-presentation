import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import DestinationDetail from "./pages/DestinationDetail";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import SavedPlaces from "./pages/SavedPlaces";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CategoryPage from "./pages/CategoryPage";
import NotFound from "./pages/NotFound";
import NewsPage from "./pages/NewsPage";
import AutoTranslator from "./components/AutoTranslator";
import WeatherForecast from "./components/WeatherForecast";
import TestAuth from "./components/TestAuth";
import { WeatherProvider } from "./contexts/WeatherContext";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

// Inner component so useLocation works inside BrowserRouter
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/destination/:id" element={<DestinationDetail />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-places"
          element={
            <ProtectedRoute>
              <SavedPlaces />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="/test-auth" element={<TestAuth />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <AutoTranslator />
        <WeatherProvider>
          <WeatherForecast />
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </WeatherProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
