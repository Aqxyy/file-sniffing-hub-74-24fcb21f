import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Code2, Lock, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NavButtons from "@/components/NavButtons";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Api = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("No access token found");
      
      console.log("Calling is-subscribed with token:", session.access_token);
      
      const response = await fetch("https://dihvcgtshzhuwnfxhfnu.supabase.co/functions/v1/is-subscribed", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (!response.ok) {
        console.error("Subscription check failed:", response.status, response.statusText);
        throw new Error("Failed to fetch subscription status");
      }
      
      const data = await response.json();
      console.log("Subscription data:", data);
      return data;
    },
    retry: 1,
  });

  if (!subscription?.subscribed) {
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
          <h1 className="text-4xl font-bold text-white mb-4">Accès requis</h1>
          <p className="text-gray-300 mb-4">Vous devez être abonné pour accéder à cette section.</p>
          <Link to="/product">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
              Voir les offres
            </button>
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
        <h1 className="text-4xl font-bold text-white mb-4">Documentation de l'API</h1>
        <p className="text-gray-300 mb-4">Voici la documentation de notre API.</p>
        <h2 className="text-2xl font-semibold text-white mb-2">Endpoints</h2>
        <ul className="list-disc list-inside text-gray-300">
          <li>
            <Code2 className="inline w-4 h-4 mr-1" />
            <strong>GET /api/data</strong> - Récupérer des données
          </li>
          <li>
            <Code2 className="inline w-4 h-4 mr-1" />
            <strong>POST /api/data</strong> - Ajouter des données
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Api;
