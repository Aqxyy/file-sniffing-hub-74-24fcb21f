import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DISCORD_INVITE_URL = "https://discord.com/invite/UfnBUHXbDV";

const Product = () => {
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  useEffect(() => {
    const fetchMaintenanceStatus = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('maintenance_mode')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setMaintenanceMode(data.maintenance_mode);
      }
    };

    fetchMaintenanceStatus();

    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'site_settings',
        },
        (payload) => {
          setMaintenanceMode(payload.new.maintenance_mode);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <h1 className="text-2xl text-white">Maintenance...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4">
      <div className="text-center mt-8">
        <a href={DISCORD_INVITE_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="bg-indigo-600 text-white hover:bg-indigo-700">
            <MessageSquare className="w-4 h-4 mr-2" />
            Nous contacter sur Discord
          </Button>
        </a>
      </div>
    </div>
  );
};

export default Product;
