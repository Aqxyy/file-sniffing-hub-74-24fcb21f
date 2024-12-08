import { createClient } from '@supabase/supabase-js';

// Ces variables sont automatiquement injectées par l'intégration Lovable-Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables d\'environnement Supabase manquantes:', {
    url: supabaseUrl ? 'défini' : 'manquant',
    key: supabaseAnonKey ? 'défini' : 'manquant'
  });
  throw new Error('Variables d\'environnement Supabase manquantes');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);