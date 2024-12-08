import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dihvcgtshzhuwnfxhfnu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRpaHZjZ3RzaHpodXduZnhoZm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM2MTc0ODAsImV4cCI6MjA0OTE5MzQ4MH0.6eBm1nNjSwEosKFGkMisTg1HXI7GmtbJvB5ouSVDOT8";

// Création d'une instance par défaut pour éviter les erreurs de typage
let supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export de l'instance pour la rétrocompatibilité
export { supabase };

// Export d'une fonction qui vérifie si Supabase est initialisé
export const getSupabase = () => {
  if (!supabase) {
    throw new Error(
      'Erreur d\'initialisation de Supabase. Veuillez vérifier votre configuration.'
    );
  }
  return supabase;
};