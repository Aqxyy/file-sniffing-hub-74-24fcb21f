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
  throw new Error('Variables d\'environnement Supabase manquantes. Assurez-vous que l\'intégration Supabase est bien configurée dans Lovable.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);