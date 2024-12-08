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
          Retour
        </Button>
        <h1 className="text-4xl font-bold text-white mb-8">Nos Offres</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingPlan 
            name="Plan Starter" 
            price="9.99" 
            variant="default"
            features={[
              { text: "50 recherches par jour" },
              { text: "Résultats complets" },
              { text: "Support basique" }
            ]}
            priceId="price_1OvPxlGPnRBnzxYPxRNBPGDR"
          />
          <PricingPlan 
            name="Plan Pro" 
            price="29.99" 
            variant="popular"
            features={[
              { text: "Recherches illimitées" },
              { text: "Résultats complets" },
              { text: "Support prioritaire" },
              { text: "API Access" }
            ]}
            priceId="price_1OvPyKGPnRBnzxYPxvBDPGDR"
          />
          <PricingPlan 
            name="Plan Entreprise" 
            price="99.99" 
            variant="lifetime"
            features={[
              { text: "Tout du plan Pro" },
              { text: "Support dédié" },
              { text: "Formation personnalisée" },
              { text: "API illimitée" }
            ]}
            priceId="price_1OvPyeGPnRBnzxYPxvBDPGDR"
          />
        </div>
      </div>
    </div>
  );
};

export default Product;