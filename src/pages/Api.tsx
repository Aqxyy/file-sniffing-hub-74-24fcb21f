import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Code2, Lock } from "lucide-react";

const Api = () => {
  const { user } = useAuth();

  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const response = await fetch("https://dihvcgtshzhuwnfxhfnu.supabase.co/functions/v1/is-subscribed", {
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch subscription status");
      return response.json();
    },
  });

  if (!subscription?.subscribed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-8 bg-gray-800/50 rounded-lg text-center">
          <Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Accès Restreint</h1>
          <p className="text-gray-300 mb-6">
            L'API est disponible uniquement avec l'abonnement Pro.
          </p>
          <Link to="/product">
            <Button className="bg-blue-900 text-white hover:bg-blue-800">
              Voir les offres
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Code2 className="w-8 h-8 text-blue-500" />
            <h1 className="text-4xl font-bold text-white">Documentation API</h1>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Authentication</h2>
              <p className="text-gray-300 mb-4">
                Toutes les requêtes API doivent inclure votre clé API dans l'en-tête :
              </p>
              <pre className="bg-gray-900 p-4 rounded text-blue-400 overflow-x-auto">
                Authorization: Bearer YOUR_API_KEY
              </pre>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Endpoint de recherche</h2>
              <p className="text-gray-300 mb-4">
                Effectuez une recherche dans la base de données :
              </p>
              <pre className="bg-gray-900 p-4 rounded text-blue-400 overflow-x-auto">
                POST /api/search
                {`
{
  "keyword": "votre_mot_clé"
}`}
              </pre>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">Limites d'utilisation</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>100 requêtes par minute</li>
                <li>10,000 requêtes par jour</li>
                <li>Taille maximale de réponse : 1MB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Api;