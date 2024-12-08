import { createClient } from '@supabase/supabase-js';

// Ces variables sont automatiquement injectées par l'intégration Lovable-Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Ajout de logs pour débugger
console.log('Vérification des variables Supabase:', {
  VITE_SUPABASE_URL: supabaseUrl,
  VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'présent' : 'manquant'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes:', {
    url: supabaseUrl ? 'défini' : 'manquant',
    key: supabaseAnonKey ? 'défini' : 'manquant'
  });

  // Au lieu de rediriger, on lance simplement l'erreur
  throw new Error(
    'Variables d\'environnement Supabase manquantes. Veuillez vérifier que :\n' +
    '1. L\'intégration Supabase est activée dans Lovable\n' +
    '2. Vous êtes bien connecté à votre projet Supabase\n' +
    '3. Les variables d\'environnement sont bien injectées'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);