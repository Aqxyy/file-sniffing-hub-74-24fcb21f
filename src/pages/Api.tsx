import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Code2, ArrowLeft, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NavButtons from "@/components/NavButtons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const Api = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

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
        throw new Error("Failed to fetch API key");
      }
      
      return response.json();
    },
    enabled: subscription?.subscribed && ["pro", "lifetime"].includes(subscription?.subscription?.plan_type),
  });

  const copyToClipboard = async () => {
    if (apiKey?.api_key) {
      await navigator.clipboard.writeText(apiKey.api_key);
      setCopied(true);
      toast.success("Clé API copiée dans le presse-papier");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!subscription?.subscribed || !["pro", "lifetime"].includes(subscription?.subscription?.plan_type)) {
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
          <h1 className="text-4xl font-bold text-white mb-4">Accès API requis</h1>
          <p className="text-gray-300 mb-4">Vous devez être abonné au plan PRO ou API Lifetime pour accéder à cette section.</p>
          <Link to="/product">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Voir les offres
            </Button>
          </Link>
        </div>
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
          <div className="bg-gray-800 p-6 rounded-lg mb-8">
            <div className="flex items-center justify-between">
              <code className="text-blue-400">{apiKey.api_key}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyToClipboard}
                className="ml-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-red-400">Erreur lors du chargement de la clé API</div>
        )}

        <h2 className="text-2xl font-semibold text-white mb-4">Documentation</h2>
        <div className="space-y-6 text-gray-300">
          <div>
            <h3 className="text-xl font-medium text-white mb-2">Authentication</h3>
            <p className="mb-2">
              Incluez votre clé API dans l'en-tête de chaque requête :
            </p>
            <pre className="bg-gray-800 p-4 rounded">
              {`Authorization: Bearer YOUR_API_KEY`}
            </pre>
          </div>

          <div>
            <h3 className="text-xl font-medium text-white mb-2">Endpoints</h3>
            <div className="space-y-4">
              <div>
                <code className="text-blue-400">GET /api/search</code>
                <p className="mt-1">Rechercher dans la base de données</p>
                <pre className="bg-gray-800 p-4 rounded mt-2">
                  {`curl -X GET "https://api.example.com/search?q=keyword" \\
-H "Authorization: Bearer YOUR_API_KEY"`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Api;