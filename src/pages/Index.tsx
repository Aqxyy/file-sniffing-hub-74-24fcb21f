import { useState } from "react";
import { Database } from "lucide-react";
import { motion } from "framer-motion";
import NavButtons from "@/components/NavButtons";
import AdminButton from "@/components/AdminButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import MaintenanceScreen from "@/components/MaintenanceScreen";
import SearchForm from "@/components/search/SearchForm";
import SearchResults from "@/components/search/SearchResults";

const Index = () => {
  const [results, setResults] = useState<any[]>([]);

  // Fetch maintenance mode status
  const { data: siteSettings } = useQuery({
    queryKey: ['site_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('maintenance_mode')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error) throw error;
      return data;
    }
  });

  // Show maintenance screen if maintenance mode is enabled
  if (siteSettings?.maintenance_mode) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <NavButtons />
        <AdminButton />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <Database className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              ZeenBase
            </h1>
          </div>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Recherche ultra-rapide dans vos bases de données
          </p>
        </motion.div>

        <SearchForm onSearchResults={setResults} />
        <SearchResults results={results} />
      </div>
    </div>
  );
};

export default Index;