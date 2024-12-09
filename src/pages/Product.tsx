import { Button } from "@/components/ui/button";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import PricingPlan from "@/components/pricing/PricingPlan";
import PricingFeatures from "@/components/pricing/PricingFeatures";
import PaymentOptions from "@/components/pricing/PaymentOptions";
import NavButtons from "@/components/NavButtons";
import AdminButton from "@/components/AdminButton";
import { useState } from "react";

const DISCORD_INVITE_URL = "https://discord.com/invite/UfnBUHXbDV";

const Product = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <NavButtons />
      <AdminButton />
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Nos Offres</h1>
          <p className="text-gray-300 mb-8">
            Choisissez l'offre qui correspond le mieux à vos besoins
          </p>
          <a 
            href={DISCORD_INVITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button variant="outline" className="bg-blue-900 text-white hover:bg-blue-800 border-blue-700">
              Contactez nous
            </Button>
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <PricingPlan
            name="Standard"
            price="19.99"
            period="/mois"
            features={[
              { text: "Accès à l'API" },
              { text: "Support par email" },
              { text: "Mises à jour régulières" }
            ]}
            buttonText="S'abonner"
          />
          <PricingPlan
            name="Premium"
            price="49.99"
            period="/mois"
            features={[
              { text: "Accès illimité à l'API" },
              { text: "Support prioritaire" },
              { text: "Fonctionnalités avancées" },
              { text: "Statistiques détaillées" }
            ]}
            buttonText="S'abonner"
            variant="popular"
          />
        </div>

        <div className="space-y-8">
          <PricingFeatures 
            features={[
              { text: "Accès complet à toutes les fonctionnalités" },
              { text: "Support premium 24/7" },
              { text: "Mises à jour prioritaires" }
            ]} 
          />
          <PaymentOptions 
            priceNumber={49.99}
            planName="Premium"
            onCancel={() => {}}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;