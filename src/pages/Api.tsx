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

  // Fetch API status
  const { data: apiStatus } = useQuery({
    queryKey: ["api-status"],
    queryFn: async () => {
      console.log("Fetching API status...");
      const { data, error } = await supabase
        .from('site_settings')
        .select('api_enabled')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching API status:", error);
        throw error;
      }
      console.log("API status data:", data);
      return data;
    },
  });

  // Fetch subscription status
  const { data: subscription } = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      console.log("Fetching subscription for user:", user.id);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching subscription:", error);
        return null;
      }
      
      console.log("Subscription data:", data);
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch API key only if user has valid subscription or is admin
  const { data: apiKey, isLoading: isLoadingApiKey } = useQuery({
    queryKey: ["api-key", user?.id],
    queryFn: async () => {
      console.log("Fetching API key...");
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error("No access token found");
      }
      
      const response = await supabase.functions.invoke('manage-api-key', {
        method: 'GET',
      });

      if (response.error) {
        console.error("API key fetch error:", response.error);
        throw new Error(response.error.message || "Failed to fetch API key");
      }
      
      console.log("API key response:", response.data);
      return response.data;
    },
    enabled: !!user?.id && (
      user?.email === "williamguerif@gmail.com" || 
      (subscription?.plan_type === 'pro' || subscription?.plan_type === 'lifetime') && 
      subscription?.status === 'active' && 
      subscription?.api_access === true && 
      apiStatus?.api_enabled === true
    ),
    retry: false,
  });

  const isAdmin = user?.email === "williamguerif@gmail.com";
  const hasValidSubscription = subscription && 
    ['pro', 'lifetime'].includes(subscription.plan_type) && 
    subscription.status === 'active' && 
    subscription.api_access;

  console.log("Current user:", user?.email);
  console.log("Is admin:", isAdmin);
  console.log("Has valid subscription:", hasValidSubscription);
  console.log("API status:", apiStatus);
  console.log("Subscription data:", subscription);

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

        {isLoadingApiKey ? (
          <div className="text-gray-300">Chargement de votre clé API...</div>
        ) : apiKey?.api_key ? (
          <ApiKeyDisplay apiKey={DOMPurify.sanitize(apiKey.api_key)} />
        ) : (
          <div className="text-red-400 mb-4">
            Impossible de récupérer votre clé API. Veuillez vérifier votre abonnement ou contacter le support.
          </div>
        )}

        <h2 className="text-2xl font-semibold text-white mb-4 mt-8">Documentation</h2>
        <ApiDocumentation />
      </div>
    </div>
  );
};

export default Api;