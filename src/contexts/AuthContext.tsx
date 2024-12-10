import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import { rateLimit } from '@/lib/rateLimit';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthProvider: Initializing auth state");
    
    // Initial session check with security headers
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthProvider: Initial session check", session?.user?.email);
      if (session?.user) {
        // Vérification supplémentaire de sécurité
        if (!session.user.email_confirmed_at) {
          setUser(null);
          navigate('/login');
          return;
        }
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Setup auth state listener with enhanced security
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: Auth state changed", event, session?.user?.email);
      
      if (session?.user) {
        // Vérification de sécurité supplémentaire
        if (!session.user.email_confirmed_at) {
          setUser(null);
          toast.error("Email non vérifié");
          navigate('/login');
          return;
        }
        setUser(session.user);
      } else {
        setUser(null);
      }
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user.email_confirmed_at) {
            navigate('/');
          } else {
            toast.warning("Veuillez vérifier votre email avant de continuer");
            navigate('/login');
          }
          break;
        case 'SIGNED_OUT':
          navigate('/login');
          break;
        case 'USER_UPDATED':
          if (session?.user.email_confirmed_at) {
            toast.success("Email vérifié avec succès !");
            navigate('/');
          }
          break;
        case 'TOKEN_REFRESHED':
          // Vérification du token rafraîchi
          if (!session?.user.email_confirmed_at) {
            setUser(null);
            navigate('/login');
          }
          break;
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    // Rate limiting
    if (!rateLimit('signIn', 3)) {
      throw new Error("Trop de tentatives de connexion. Veuillez réessayer plus tard.");
    }

    console.log("AuthProvider: Attempting sign in", email);
    const sanitizedEmail = DOMPurify.sanitize(email.toLowerCase().trim());
    
    // Validation supplémentaire
    if (!sanitizedEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      throw new Error("Format d'email invalide");
    }

    const { error, data } = await supabase.auth.signInWithPassword({ 
      email: sanitizedEmail, 
      password 
    });
    
    if (error) {
      console.error("AuthProvider: Sign in error", error);
      throw error;
    }
    
    if (!data.user.email_confirmed_at) {
      toast.error("Veuillez vérifier votre email avant de vous connecter");
      throw new Error("Email non vérifié");
    }
    
    console.log("AuthProvider: Sign in successful", data.user?.email);
  };

  const signUp = async (email: string, password: string) => {
    // Rate limiting
    if (!rateLimit('signUp', 3)) {
      throw new Error("Trop de tentatives d'inscription. Veuillez réessayer plus tard.");
    }

    console.log("AuthProvider: Attempting sign up", email);
    const sanitizedEmail = DOMPurify.sanitize(email.toLowerCase().trim());
    
    // Validation du mot de passe
    if (password.length < 8) {
      throw new Error("Le mot de passe doit contenir au moins 8 caractères");
    }
    if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
      throw new Error("Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre");
    }

    const { error, data } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    });
    
    if (error) {
      console.error("AuthProvider: Sign up error", error);
      throw error;
    }
    
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      throw new Error("Cet email est déjà utilisé");
    }
    
    console.log("AuthProvider: Sign up successful", data);
    
    if (data.user && !data.user.email_confirmed_at) {
      toast.success("Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception.");
      navigate('/login');
    }
  };

  const signOut = async () => {
    console.log("AuthProvider: Attempting sign out");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("AuthProvider: Sign out error", error);
      throw error;
    }
    console.log("AuthProvider: Sign out successful");
    // Nettoyage supplémentaire de sécurité
    localStorage.clear();
    sessionStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};