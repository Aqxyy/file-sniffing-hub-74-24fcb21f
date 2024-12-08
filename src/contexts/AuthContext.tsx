import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

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
    try {
      const supabase = getSupabase();
      console.log("Initialisation de l'auth context");
      
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("Session récupérée:", session ? "Connecté" : "Non connecté");
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Changement d'état auth:", _event);
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.error("Erreur lors de l'initialisation de l'auth:", error);
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("Tentative de connexion pour:", email);
    const supabase = getSupabase();
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error("Erreur de connexion:", error);
      throw error;
    }
    console.log("Connexion réussie:", data);
    navigate('/');
  };

  const signUp = async (email: string, password: string) => {
    console.log("Tentative d'inscription pour:", email);
    const supabase = getSupabase();
    const { error, data } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Erreur d'inscription:", error);
      throw error;
    }
    console.log("Inscription réussie:", data);
    if (data.user) {
      console.log("Redirection vers login après inscription réussie");
      navigate('/login');
    }
  };

  const signOut = async () => {
    console.log("Tentative de déconnexion");
    const supabase = getSupabase();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erreur de déconnexion:", error);
      throw error;
    }
    console.log("Déconnexion réussie");
    navigate('/login');
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