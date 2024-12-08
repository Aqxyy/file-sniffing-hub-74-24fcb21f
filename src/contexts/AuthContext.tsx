import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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
    
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("AuthProvider: Initial session check", session?.user?.email);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Setup auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("AuthProvider: Auth state changed", event, session?.user?.email);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        if (session?.user.email_confirmed_at) {
          navigate('/');
        } else {
          toast.warning("Veuillez vérifier votre email avant de continuer");
          navigate('/login');
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      } else if (event === 'USER_UPDATED') {
        if (session?.user.email_confirmed_at) {
          toast.success("Email vérifié avec succès !");
          navigate('/');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    console.log("AuthProvider: Attempting sign in", email);
    const { error, data } = await supabase.auth.signInWithPassword({ 
      email: email.toLowerCase().trim(), 
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
    console.log("AuthProvider: Attempting sign up", email);
    const { error, data } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
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