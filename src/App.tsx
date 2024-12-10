import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Support from "./pages/Support";
import Api from "./pages/Api";
import Admin from "./pages/Admin";
import { useAuth } from "./contexts/AuthContext";
import { toast } from "sonner";
import { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component avec vérification de sécurité renforcée
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!user.email_confirmed_at) {
    toast.error("Veuillez vérifier votre email avant d'accéder au site");
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

// Admin Route Component avec vérification stricte
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user || user.email !== "williamguerif@gmail.com" || !user.email_confirmed_at) {
    toast.error("Accès non autorisé");
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

// Public Route Component avec protection contre les attaques
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (user?.email_confirmed_at) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route
        path="/product"
        element={
          <ProtectedRoute>
            <Product />
          </ProtectedRoute>
        }
      />
      <Route
        path="/support"
        element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        }
      />
      <Route
        path="/api"
        element={
          <ProtectedRoute>
            <Api />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />
    </Routes>
  );
};

const App = () => {
  useEffect(() => {
    // Content Security Policy
    const meta = document.createElement('meta');
    meta.httpEquiv = "Content-Security-Policy";
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';";
    document.head.appendChild(meta);

    // X-Frame-Options
    const xFrameOptions = document.createElement('meta');
    xFrameOptions.httpEquiv = "X-Frame-Options";
    xFrameOptions.content = "DENY";
    document.head.appendChild(xFrameOptions);

    // X-Content-Type-Options
    const xContentTypeOptions = document.createElement('meta');
    xContentTypeOptions.httpEquiv = "X-Content-Type-Options";
    xContentTypeOptions.content = "nosniff";
    document.head.appendChild(xContentTypeOptions);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;