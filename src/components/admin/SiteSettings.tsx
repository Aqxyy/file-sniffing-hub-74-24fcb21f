import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import ApiSettings from "./ApiSettings";
import { Switch } from "@/components/ui/switch";

export const SiteSettings = () => {
  const [apiEnabled, setApiEnabled] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const fetchSettings = async () => {
    try {
      console.log("Fetching site settings...");
      const { data, error } = await supabase
        .from('site_settings')
        .select('api_enabled, maintenance_mode')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Settings fetch error:", error);
        throw error;
      }
      
      console.log("Site settings data:", data);
      if (data) {
        setApiEnabled(data.api_enabled);
        setMaintenanceMode(data.maintenance_mode);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des paramètres:", error);
      toast.error("Erreur lors de la récupération des paramètres");
    }
  };

  const toggleApiStatus = async () => {
    try {
      const newStatus = !apiEnabled;
      const { error } = await supabase
        .from('site_settings')
        .insert({ 
          api_enabled: newStatus,
          maintenance_mode: maintenanceMode 
        })
        .select()
        .single();

      if (error) throw error;
      
      setApiEnabled(newStatus);
      toast.success(`API ${newStatus ? 'activée' : 'désactivée'} avec succès`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut API:", error);
      toast.error("Erreur lors de la mise à jour des paramètres");
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      const newStatus = !maintenanceMode;
      const { error } = await supabase
        .from('site_settings')
        .insert({ 
          maintenance_mode: newStatus,
          api_enabled: apiEnabled 
        })
        .select()
        .single();

      if (error) throw error;
      
      setMaintenanceMode(newStatus);
      toast.success(`Mode maintenance ${newStatus ? 'activé' : 'désactivé'} avec succès`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du mode maintenance:", error);
      toast.error("Erreur lors de la mise à jour des paramètres");
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <div className="space-y-6">
      <ApiSettings 
        apiEnabled={apiEnabled}
        onToggleApi={toggleApiStatus}
      />
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Mode Maintenance</h2>
        <div className="flex items-center space-x-4">
          <span className="text-white">Mode Maintenance</span>
          <Switch checked={maintenanceMode} onCheckedChange={toggleMaintenanceMode} />
          <span className="text-gray-400">
            {maintenanceMode ? 'Activé' : 'Désactivé'}
          </span>
        </div>
        <p className="text-gray-400 mt-2 text-sm">
          Active ou désactive le mode maintenance du site
        </p>
      </div>
    </div>
  );
};