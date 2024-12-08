import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import ApiSettings from "./ApiSettings";

export const SiteSettings = () => {
  const [apiEnabled, setApiEnabled] = useState(true);

  const fetchApiStatus = async () => {
    try {
      console.log("Fetching API status...");
      const { data, error } = await supabase
        .from('site_settings')
        .select('api_enabled')
        .single();

      if (error) {
        console.error("API status fetch error:", error);
        throw error;
      }
      
      console.log("API status data:", data);
      setApiEnabled(data?.api_enabled ?? true);
    } catch (error) {
      console.error("Erreur lors de la récupération du statut API:", error);
      toast.error("Erreur lors de la récupération des paramètres");
    }
  };

  const toggleApiStatus = async () => {
    try {
      const newStatus = !apiEnabled;
      // Remove the explicit ID from the upsert
      const { error } = await supabase
        .from('site_settings')
        .upsert({ api_enabled: newStatus });

      if (error) throw error;
      
      setApiEnabled(newStatus);
      toast.success(`API ${newStatus ? 'activée' : 'désactivée'} avec succès`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut API:", error);
      toast.error("Erreur lors de la mise à jour des paramètres");
    }
  };

  useEffect(() => {
    fetchApiStatus();
  }, []);

  return (
    <ApiSettings 
      apiEnabled={apiEnabled}
      onToggleApi={toggleApiStatus}
    />
  );
};