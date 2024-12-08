import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NavButtons from "@/components/NavButtons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ApiKeyDisplay from "@/components/api/ApiKeyDisplay";
import ApiDocumentation from "@/components/api/ApiDocumentation";
import AccessDenied from "@/components/api/AccessDenied";
import DOMPurify from "dompurify";

const Api = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: apiStatus } = useQuery({
    queryKey: ["api-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('api_enabled')
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No access token found");
      }
      
      const response = await fetch("https://dihvcgtshzhuwnfxhfnu.supabase.co/functions/v1/is-subscribed", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch subscription status");
      }
      
      return response.json();
    },
  });

  const { data: apiKey, isLoading } = useQuery({
    queryKey: ["api-key"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No access token found");
      }
      
      const response = await fetch("https://dihvcgtshzhuwnfxhfnu.supabase.co/functions/v1/manage-api-key", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API key fetch error:", errorData);
        throw new Error(errorData.error || "Failed to fetch API key");
      }
      
      return response.json();
    },
    enabled: subscription?.subscribed && ["pro", "lifetime"].includes(subscription?.subscription?.plan_type) && apiStatus?.api_enabled,
  });

  const isAdmin = user?.email === "williamguerif@gmail.com";
  const hasValidSubscription = subscription?.subscribed && ["pro", "lifetime"].includes(subscription?.subscription?.plan_type);

  if (!apiStatus?.api_enabled && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <NavButtons />
        <AccessDenied message="L'accès à l'API a été temporairement désactivé par l'administrateur. Veuillez réessayer plus tard." />
      </div>
    );
  }

  if (!hasValidSubscription && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
        <NavButtons />
        <AccessDenied message="Vous devez être abonné au plan PRO ou API Lifetime pour accéder à cette section." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <NavButtons />
      <div className="container mx-auto px-4 py-16">
        <Button 
          variant="ghost" 
          className="text-white mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>
        
        <h1 className="text-4xl font-bold text-white mb-4">Votre clé API</h1>
        <p className="text-gray-300 mb-8">
          Utilisez cette clé pour accéder à l'API. Ne la partagez avec personne.
        </p>

        {isLoading ? (
          <div className="text-gray-300">Chargement de votre clé API...</div>
        ) : apiKey?.api_key ? (
          <ApiKeyDisplay apiKey={DOMPurify.sanitize(apiKey.api_key)} />
        ) : (
          <div className="text-red-400">Erreur lors du chargement de la clé API</div>
        )}

        <h2 className="text-2xl font-semibold text-white mb-4">Documentation</h2>
        <ApiDocumentation />
      </div>
    </div>
  );
};

export default Api;