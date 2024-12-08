import { useAuth } from "@/contexts/AuthContext";
import NavButtons from "@/components/NavButtons";
import PricingPlan from "@/components/pricing/PricingPlan";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <PricingPlan 
            name="Gratuit" 
            price="0" 
            period="€"
            variant="default"
            buttonText="Commencer"
            features={[
              { text: "10 recherches par jour" },
              { text: "Résultats limités" },
              { text: "Support basique" }
            ]}
          />
          <PricingPlan 
            name="Standard" 
            price="19.99" 
            period="€/mois"
            variant="popular"
            buttonText="Essai gratuit de 7 jours"
            features={[
              { text: "Recherches illimitées" },
              { text: "Accès complet aux résultats" },
              { text: "Support prioritaire" },
              { text: "Accès aux bases premium" }
            ]}
            priceId="price_1QTaXfEeS2EtyeTMzMA5ts9U"
          />
          <PricingPlan 
            name="Pro" 
            price="49.99" 
            period="€/mois"
            variant="default"
            buttonText="Contacter les ventes"
            features={[
              { text: "Tout le plan Standard" },
              { text: "API Access" },
              { text: "Support dédié 24/7" },
              { text: "Exports illimités" },
              { text: "Personnalisation avancée" }
            ]}
            priceId="price_1QTaXPEeS2EtyeTMAfT6QyVE"
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