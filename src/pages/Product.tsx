import { useAuth } from "@/contexts/AuthContext";
import NavButtons from "@/components/NavButtons";
import PricingPlan from "@/components/pricing/PricingPlan";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const Product = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch current subscription status
  const { data: subscription } = useQuery({
    queryKey: ['subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select('plan_type, status, api_access')
        .eq('user_id', user.id)
        .single();
        
      if (error) {
        console.error('Error fetching subscription:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id
  });

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
          Retour à la recherche
        </Button>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choisissez votre plan</h1>
          <p className="text-gray-300 text-lg">
            Accédez à la plus grande base de données de recherche avec des fonctionnalités avancées et un support premium
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <PricingPlan 
            name="Gratuit" 
            price="0" 
            period="€"
            variant="default"
            features={[
              { text: "10 recherches par jour" },
              { text: "Résultats limités" },
              { text: "Support basique" }
            ]}
            buttonText=""
            currentPlan={subscription?.plan_type === 'free'}
          />
          <PricingPlan 
            name="Standard" 
            price="9.99" 
            period="€/mois"
            variant="popular"
            buttonText="S'abonner"
            features={[
              { text: "35 recherches par jour" },
              { text: "Accès complet aux résultats" },
              { text: "Support prioritaire" },
              { text: "Accès aux bases premium" }
            ]}
            priceId="price_1QTZHvEeS2EtyeTMNWeSozYu"
            currentPlan={subscription?.plan_type === 'standard'}
          />
          <PricingPlan 
            name="Pro" 
            price="49.99" 
            period="€/mois"
            variant="default"
            buttonText="S'abonner"
            features={[
              { text: "Tout le plan Standard" },
              { text: "Clé API personnelle" },
              { text: "Support dédié 24/7" },
              { text: "Exports illimités" },
              { text: "Personnalisation avancée" }
            ]}
            priceId="price_1QTZHIEeS2EtyeTMIobx6y3O"
            currentPlan={subscription?.plan_type === 'pro'}
          />
          <PricingPlan 
            name="API Lifetime" 
            price="119.99" 
            period="€"
            variant="default"
            buttonText="S'abonner"
            features={[
              { text: "Clé API personnelle illimitée" },
              { text: "Support dédié 24/7" },
              { text: "Accès à vie" },
              { text: "Mises à jour gratuites" },
              { text: "Personnalisation avancée" }
            ]}
            priceId="price_1QTZwZEeS2EtyeTMcYOFcClK"
            currentPlan={subscription?.plan_type === 'lifetime' && subscription?.api_access}
          />
        </div>

        <div className="text-center mt-12 text-gray-400">
          Besoin d'une solution personnalisée ? <a href="#" className="text-blue-400 hover:text-blue-300">Contactez-nous</a>
        </div>
      </div>
    </div>
  );
};

export default Product;