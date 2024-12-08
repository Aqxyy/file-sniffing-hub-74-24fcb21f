import { createClient } from '@supabase/supabase-js';

// Ces variables sont automatiquement injectées par l'intégration Lovable-Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ajout de logs pour débugger
console.log('Vérification des variables Supabase:', {
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'présent' : 'manquant'
});

// Création d'une instance par défaut pour éviter les erreurs de typage
let supabase = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes:', {
    url: supabaseUrl ? 'défini' : 'manquant',
    key: supabaseAnonKey ? 'défini' : 'manquant'
  });

  // Rediriger vers la page de connexion si l'utilisateur n'est pas sur la page de login ou signup
  const currentPath = window.location.pathname;
  if (currentPath !== '/login' && currentPath !== '/signup') {
    window.location.href = '/login';
  }
} else {
  // On crée le client Supabase uniquement si les variables sont présentes
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

// Export d'une fonction qui vérifie si Supabase est initialisé
export const getSupabase = () => {
  if (!supabase) {
    throw new Error(
      'Variables d\'environnement Supabase manquantes. Veuillez vérifier que :\n' +
      '1. L\'intégration Supabase est activée dans Lovable\n' +
      '2. Vous êtes bien connecté à votre projet Supabase\n' +
      '3. Les variables d\'environnement sont bien injectées'
    );
  }
  return supabase;
};

// Export de l'instance pour la rétrocompatibilité
export { supabase };